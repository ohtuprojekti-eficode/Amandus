import {
  cloneRepository,
  getCurrentBranchName,
  pullMasterChanges,
  saveChanges,
} from '../services/git'
import { existsSync, readFileSync } from 'fs'
import readRecursive from 'recursive-readdir'
import { ForbiddenError } from 'apollo-server'
import { relative } from 'path'
import { AppContext } from '../types/user'
import { File } from '../types/file'
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
      branchName: String!
    }
`

const resolvers = {
  Query: {
    cloneRepository: async (
      _root: unknown,
      args: { url: string },
      _context: unknown
    ): Promise<File[]> => {
      const url = new URL(args.url)
      const repositoryName = url.pathname
      const fileLocation = `./repositories/${repositoryName}`

      if (!existsSync(fileLocation)) {
        await cloneRepository(url.href)
      } else {
        await pullMasterChanges(url.href)
      }

      const paths = await readRecursive(fileLocation, ['.git'])
      const contents = paths.map((file) => ({
        name: relative('repositories/', file),
        content: readFileSync(file, 'utf-8'),
      }))

      return contents
    },
    getRepoState: async (
      _root: unknown,
      args: { url: string },
      _context: unknown
    ): Promise<RepoState> => {
      const url = new URL(args.url)
      const repositoryName = url.pathname
      const repoLocation = `./repositories/${repositoryName}`
      const branchName = await getCurrentBranchName(repoLocation)
      return { branchName: branchName }
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
