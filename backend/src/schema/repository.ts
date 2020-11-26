/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  cloneRepository,
  getCurrentBranchName,
  pullNewestChanges,
  saveChanges,
  saveChangesAndPush,
  getLocalBranches,
  switchCurrentBranch,
} from '../services/git'
import { existsSync, readFileSync } from 'fs'
import readRecursive from 'recursive-readdir'
import { ForbiddenError, ApolloError } from 'apollo-server'
import { relative } from 'path'
import { AppContext } from '../types/user'
import { BranchSwitchArgs, SaveArgs } from '../types/params'
import { RepoState } from '../types/repoState'

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
      url: String!
      localBranches: [String]!
    }
`

const resolvers = {
  Query: {
    cloneRepository: async (
      _root: unknown,
      args: { url: string },
      _context: unknown
    ): Promise<string> => {
      const url = new URL(args.url)
      const repositoryName = url.pathname
      const fileLocation = `./repositories/${repositoryName}`

      if (!existsSync(fileLocation)) {
        await cloneRepository(url.href)
      } else {
        await pullNewestChanges(url.href)
      }
      return 'Cloned'
    },
    getRepoState: async (
      _root: unknown,
      args: { url: string },
      _context: unknown
    ): Promise<RepoState> => {
      const urlObject = new URL(args.url)
      const repositoryName = urlObject.pathname
      const repoLocation = `./repositories/${repositoryName}`

      const currentBranch = await getCurrentBranchName(repoLocation)

      const filePaths = await readRecursive(repoLocation, ['.git'])
      const files = filePaths.map((file) => ({
        name: relative('repositories/', file),
        content: readFileSync(file, 'utf-8'),
      }))

      const localBranches = await getLocalBranches(repoLocation)
      const url = args.url

      return { currentBranch, files, localBranches, url }
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
        if (!context.githubToken) {
          await saveChanges(saveArgs, context.currentUser)
        } else {
          await saveChangesAndPush(
            saveArgs,
            context.currentUser,
            context.githubToken ?? ''
          )
        }
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
      const url = new URL(branchSwitchArgs.url)
      const repositoryName = url.pathname
      const repoLocation = `./repositories/${repositoryName}`
      return await switchCurrentBranch(repoLocation, branchSwitchArgs.branch)
    },
  },
}

export default {
  resolvers,
  typeDef,
}
