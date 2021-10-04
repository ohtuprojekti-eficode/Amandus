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
import { getRepoLocationFromUrlString } from '../utils/utils'
import { getRepoList } from '../services/commonServices'
import { Repo } from '../types/repo'
import {
  getServiceTokenFromContext,
  parseGithubRepositories,
  parseBitbucketRepositories,
  parseGitlabRepositories
} from '../utils/utils'

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
      _context: unknown
    ): Promise<string> => {
      const repoLocation = getRepoLocationFromUrlString(args.url)
      // TODO: Would be ideal that user's configs are set when repo
      // is first cloned instead of doing it in commit operation
      // (because automerges also require username and email)
      // requires user specific repos & clone only possible
      // when context.currentuser exists
      if (!existsSync(repoLocation)) {
        await cloneRepository(args.url)
      }
      // Pulling now if the repo is cloned from before

      return 'Cloned'
    },

    getRepoState: async (
      _root: unknown,
      args: { url: string },
      _context: unknown
    ): Promise<RepoState> => {
      const repoLocation = getRepoLocationFromUrlString(args.url)
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
          const token = getServiceTokenFromContext(service.serviceName, context)

          if (!token) {
            throw new Error(`${service.serviceName} token is missing`)
          }
          const response = await getRepoList(service, token)

          if (!response) {
            throw new Error(`Failed to fetch repo data from ${service.serviceName}`)
          }

          let repolist: Repo[] = []
          if (service.serviceName === 'github') {
            repolist = parseGithubRepositories(response)
          } else if (service.serviceName === 'bitbucket') {
            repolist = parseBitbucketRepositories(response)
          } else if (service.serviceName === 'gitlab') {
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
        await saveChanges(saveArgs, context.currentUser, context.githubToken)
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
      _context: unknown
    ): Promise<string> => {
      const repoLocation = getRepoLocationFromUrlString(branchSwitchArgs.url)
      return await switchCurrentBranch(repoLocation, branchSwitchArgs.branch)
    },
    pullRepository: async (
      _root: unknown,
      args: { url: string },
      _context: unknown
    ): Promise<string> => {
      const repoLocation = getRepoLocationFromUrlString(args.url)
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
