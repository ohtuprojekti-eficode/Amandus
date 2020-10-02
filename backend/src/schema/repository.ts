import { cloneRepository } from '../git'
import { existsSync, readFileSync } from 'fs'
import readRecursive from 'recursive-readdir'
import { relative } from 'path'

const typeDef = `
    type File {
        name: String!
        content: String!
    }
`

interface File {
  name: string
  content: string
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
}

export default {
  resolvers,
  typeDef,
}