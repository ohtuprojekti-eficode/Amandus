import { cloneRepository, saveChanges } from '../git'
import { existsSync, readFileSync } from 'fs'
import readRecursive from 'recursive-readdir'
import { ForbiddenError } from 'apollo-server'
import { relative } from 'path'
import { AppContext } from '../../types/user'

const typeDef = `
    type File {
        name: String!
        content: String!
    }
    input FileInput {
      name: String!
      content: String!
    }
`

interface File {
  name: string
  content: string
}

interface SaveArgs {
  file: File
}

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
      }

      const paths = await readRecursive(fileLocation, ['.git'])
      const contents = paths.map((file) => ({
        name: relative('repositories/', file),
        content: readFileSync(file, 'utf-8'),
      }))

      return contents
    },
  },
  Mutation: {
    saveChanges: async (
      _root: unknown,
      { file }: SaveArgs,
      context: AppContext
    ): Promise<string> => {
      if (!context.currentUser || !context.currentUser.gitHubToken) {
        throw new ForbiddenError('You have to login')
      }
      const { username, gitHubEmail, gitHubToken } = context.currentUser
      console.log(
        `${JSON.stringify(file)} ${username} ${gitHubEmail} ${gitHubToken}`
      )
      await saveChanges(file, username, gitHubEmail ?? '', gitHubToken)
      return 'Saved'
    },
  },
}

export default {
  resolvers,
  typeDef,
}
