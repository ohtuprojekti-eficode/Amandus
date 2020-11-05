import {
  cloneRepository,
  getCurrentBranchName,
  pullMasterChanges,
  saveChanges,
  getBranches,
} from '../services/git'
import { existsSync, readFileSync } from 'fs'
import readRecursive from 'recursive-readdir'
import { ForbiddenError } from 'apollo-server'
import { relative } from 'path'
import { AppContext } from '../types/user'
import { SaveArgs } from '../types/params'
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
      branches: [String]!
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
        await pullMasterChanges(url.href)
      }
      return 'Cloned'
    },
    getRepoState: async (
      _root: unknown,
      args: { url: string },
      _context: unknown
    ): Promise<RepoState> => {
      const url = new URL(args.url)
      const repositoryName = url.pathname
      const repoLocation = `./repositories/${repositoryName}`

      const currentBranch = await getCurrentBranchName(repoLocation)

      const filePaths = await readRecursive(repoLocation, ['.git'])
      const files = filePaths.map((file) => ({
        name: relative('repositories/', file),
        content: readFileSync(file, 'utf-8'),
      }))

      const branches = await getBranches(repoLocation)

      return { currentBranch, files, branches }
    },
  },
  Mutation: {
    saveChanges: async (
      _root: unknown,
      saveArgs: SaveArgs,
      context: AppContext
    ): Promise<string> => {
      if (!context.currentUser || !context.currentUser.gitHubToken) {
        throw new ForbiddenError('You have to login')
      }

      await saveChanges(saveArgs, context.currentUser)
      return 'Saved'
    },
  },
}

export default {
  resolvers,
  typeDef,
}
