/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  cloneRepository,
  getCurrentBranchName,
  getCurrentCommitMessage,
  saveChanges,
  saveMerge,
  getLocalBranches,
  switchCurrentBranch,
  pullNewestChanges,
  addAndCommitLocal,
} from '../services/git'
import { existsSync, readFileSync } from 'fs'
import readRecursive from 'recursive-readdir'
import { ForbiddenError, ApolloError } from 'apollo-server'
import { relative } from 'path'
import { AppContext } from '../types/user'
import { BranchSwitchArgs, SaveArgs } from '../types/params'
import { RepoState } from '../types/repoState'
import {
  getRepoLocationFromUrlString,
  getServiceTokenFromAppContext,
  getServiceNameFromUrlString,
  writeToFile
} from '../utils/utils'
import { parseServiceRepositories } from '../utils/parsers'
import { getRepoList } from '../services/commonServices'
import { Repository } from '../types/repository'
import { ServiceName } from '../types/service'
import { File } from '../types/file'


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
      service: String!
    }
    type Repository {
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

      return 'Cloned'
    },
    getRepoState: async (
      _root: unknown,
      args: { url: string },
      context: AppContext
    ): Promise<RepoState> => {
      if (!args.url) {
        throw new Error('Repository url not provided')
      }

      const service = getServiceNameFromUrlString(args.url)
      const repoLocation = getRepoLocationFromUrlString(args.url, context.currentUser.username)
      const currentBranch = await getCurrentBranchName(repoLocation)
      const commitMessage = await getCurrentCommitMessage(repoLocation)

      if (!service) {
        throw new Error('Unable to parse service name, or service is unsupported.')
      }

      const filePaths = await readRecursive(repoLocation, ['.git'])
      const files = filePaths.map((file) => ({
        name: relative('repositories/', file),
        content: readFileSync(file, 'utf-8'),
      }))

      const branches = await getLocalBranches(repoLocation)
      return { currentBranch, files, branches, url: args.url, commitMessage, service }
    },

    getRepoListFromService: async (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): Promise<Repository[]> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      if (!context.currentUser.services) {
        throw new Error('User is not connected to any service')
      }

      const allRepositories = await Promise.all(context.currentUser.services.map(
        async (service) => {
          const token = getServiceTokenFromAppContext({
            service: service.serviceName as ServiceName, appContext: context
          })

          if (!token) {
            console.log(`Service token missing for service ${service.serviceName}`)
            return []
          }

          const response = await getRepoList(service, token)
          const serviceRepositories: Repository[] = parseServiceRepositories(response, service.serviceName)

          return serviceRepositories
        }
      ))

      return allRepositories.flat()

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
      } catch (e) {
        if ((e as Error).message === 'Merge conflict') {
          throw new ApolloError('Merge conflict detected')
        } else {
          throw new ApolloError((e as Error).message)
        }
      }

      return 'Saved'
    },
    saveMergeEdit: async (
      _root: unknown,
      saveArgs: SaveArgs,
      context: AppContext
    ): Promise<string> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      try {
        await saveMerge(saveArgs, context)
      } catch (e) {
        throw new ApolloError((e as Error).message)
      }

      return 'Merged successfully'
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
      } catch (e) {
        if ((e as Error).message === 'Merge conflict') {
          throw new ApolloError('Merge conflict detected')
        } else {
          throw new ApolloError((e as Error).message)
        }
      }
      return 'Pulled'
    },
    localSave: async (
      _root: unknown,
      args: {file: File},
      context: AppContext
    ): Promise<string> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }
      writeToFile(args.file)

      return 'saved locally'
    },
    commitLocalChanges: async (
      _root: unknown,
      args: { url: string },
      context: AppContext
    ): Promise<string> => {
      const repoLocation = getRepoLocationFromUrlString(args.url, context.currentUser.username)
      
      try {
        await addAndCommitLocal(repoLocation, context)
      } catch (e) {
        throw new ApolloError((e as Error).message)
      }
      return 'committed'
    }
  }
}

export default {
  resolvers,
  typeDef,
}
