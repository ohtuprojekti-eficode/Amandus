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
  getServiceNameFromUrlString,
} from '../utils/utils'
import { parseServiceRepositories } from '../utils/parsers'
import { getRepoList } from '../services/commonServices'
// import tokenService from '../services/token'
import fetch from 'node-fetch'
import { Repository } from '../types/repository'
// import { AccessTokenResponse } from '../types/service'

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

      console.log('HELLO FROM BACKEND')
      console.log('HERE IS CURRENT APPCONTEXT:')
      console.log(context)

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

          const tokenResponse = await fetch(`http://localhost:3002/api/tokens/${context.currentUser.id}/${service.serviceName}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${context.accessToken}` }
          })

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const token = await tokenResponse.json()

          console.log('HELLO FROM BACKEND')
          console.log('ATTEMPTED TO FETCH SERVICE TOKEN:')
          console.log(token.access_token)
          // const token = await tokenService.getAccessTokenByServiceAndId(
          //   context.currentUser.id,
          //   service.serviceName
          // )

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
  },
}

export default {
  resolvers,
  typeDef,
}
