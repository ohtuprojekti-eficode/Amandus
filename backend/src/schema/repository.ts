/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  cloneRepository,
  getCurrentBranchName,
  getCurrentCommitMessage,
  saveChanges,
  getLocalBranches,
  switchCurrentBranch,
  pullNewestChanges,
} from '../services/git'
import { existsSync, readFileSync } from 'fs'
import readRecursive from 'recursive-readdir'
import { ForbiddenError, ApolloError } from 'apollo-server'
import { relative } from 'path'
import { AppContext } from '../types/user'
import { BranchSwitchArgs, SaveArgs } from '../types/params'
import { RepoState } from '../types/repoState'
import { getRepoLocationFromUrlString, getServiceTokenFromAppContext } from '../utils/utils'
import { getBitbucketRepoList, getGitHubRepoList, getGitLabRepoList } from '../services/commonServices'
import { Repo } from '../types/repo'
import {
  parseGithubRepositories,
  parseBitbucketRepositories,
  parseGitlabRepositories
} from '../utils/utils'
import { ServiceName } from '../types/service'

const typeDef = `
    type File {
        name: String!
        content: String!
    }
    input FileInput {
      name: String!
      content: String!
    }
    type RepoState {
      currentBranch: String!
      files: [File]!
      branches: [String]!
      url: String!
      commitMessage: String!
    }
    type Repo {
      id: String!
      name: String!
      full_name: String!
      clone_url: String!
      html_url: String!
      service: String!
    }
`

const resolvers = {
  Query: {
    cloneRepository: async (
      _root: unknown,
      args: { url: string },
      context: AppContext
    ): Promise<string> => {
      const repoLocation = getRepoLocationFromUrlString(args.url, context.currentUser.username)
      // TODO: Would be ideal that user's configs are set when repo
      // is first cloned instead of doing it in commit operation
      // (because automerges also require username and email)
      // requires user specific repos & clone only possible
      // when context.currentuser exists
      if (!existsSync(repoLocation)) {
        await cloneRepository(args.url, context.currentUser.username)
      
      }
      // Pulling now if the repo is cloned from before

      return 'Cloned'
    },

    getRepoState: async (
      _root: unknown,
      args: { url: string },
      context: AppContext
    ): Promise<RepoState> => {
      const repoLocation = getRepoLocationFromUrlString(args.url, context.currentUser.username)
      const currentBranch = await getCurrentBranchName(repoLocation)
      const commitMessage = await getCurrentCommitMessage(repoLocation)

      const filePaths = await readRecursive(repoLocation, ['.git'])
      const files = filePaths.map((file) => ({
        name: relative('repositories/', file),
        content: readFileSync(file, 'utf-8'),
      }))

      const branches = await getLocalBranches(repoLocation)
      return { currentBranch, files, branches, url: args.url, commitMessage }
    },

    getRepoListFromService: async (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): Promise<Repo[]> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      if (!context.currentUser.services) {
        throw new Error('User is not connected to any service')
      }

      const repolist = await Promise.all(context.currentUser.services.map(
        async (service) => {
          const token = getServiceTokenFromAppContext({service: service.serviceName as ServiceName, appContext: context})



          let repolist: Repo[] = []

          if (!token) {
            return repolist
          }

          if (service.serviceName === 'github') {
            const response = await getGitHubRepoList(service, token)
            repolist = parseGithubRepositories(response)

          } else if (service.serviceName === 'bitbucket') {
            const response = await getBitbucketRepoList(service, token)
            repolist = parseBitbucketRepositories(response)

          } else if (service.serviceName === 'gitlab') {
            const response = await getGitLabRepoList(service, token)
            repolist = parseGitlabRepositories(response)
          }

          return repolist
        }
      ))

      const repos = repolist.flat()

      return repos

    },
  },

  Mutation: {
    saveChanges: async (
      _root: unknown,
      saveArgs: SaveArgs,
      context: AppContext
    ): Promise<string> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      try {
        await saveChanges(saveArgs, context)
      } catch (error) {
        if (error.message === 'Merge conflict') {
          throw new ApolloError('Merge conflict detected')
        } else {
          throw new ApolloError(error.message)
        }
      }

      return 'Saved'
    },
    switchBranch: async (
      _root: unknown,
      branchSwitchArgs: BranchSwitchArgs,
      context: AppContext
    ): Promise<string> => {
      const repoLocation = getRepoLocationFromUrlString(branchSwitchArgs.url, context.currentUser.username)
      return await switchCurrentBranch(repoLocation, branchSwitchArgs.branch)
    },
    pullRepository: async (
      _root: unknown,
      args: { url: string },
      context: AppContext
    ): Promise<string> => {
      const repoLocation = getRepoLocationFromUrlString(args.url, context.currentUser.username)
      try {
        await pullNewestChanges(repoLocation)
      } catch (error) {
        // In case of merge conflict
        if (error.message === 'Merge conflict') {
          throw new ApolloError('Merge conflict detected')
        } else {
          throw new ApolloError(error.message)
        }
      }
      return 'Pulled'
    },
  },
}

export default {
  resolvers,
  typeDef,
}
