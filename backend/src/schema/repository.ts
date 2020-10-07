import { cloneRepository, saveChanges } from '../git'
import { existsSync, readFileSync } from 'fs'
import readRecursive from 'recursive-readdir'
import { relative } from 'path'

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
  repositoryName: string
  username: string
  email: string
  token: string
}

const resolvers = {
  Query: {
    cloneRepository: async (
      _root: any,
      args: { url: string },
      _context: any
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
      _root: any,
      { file, username, email, token }: SaveArgs,
      _context: any
    ): Promise<string> => {
      await saveChanges(file, username, email, token)
      return 'Saved'
    },
  },
}

export default {
  resolvers,
  typeDef,
}
