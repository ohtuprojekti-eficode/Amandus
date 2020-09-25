import { UserInputError } from 'apollo-server'

const typeDef = `
    type User {
        id: ID!
        username: String
    }
`

const resolvers = {
  Query: {
    getUserById: async (_root: any, args: any, _context: any) => {
      if (!args.id) {
        throw new UserInputError('No user id provided')
      }

      // do something here

      return args.id
    },
  },
  Mutation: {
    addUser: async (_root: any, args: any, _context: any) => {
      if (!args.username) {
        throw new UserInputError('No username provided')
      }

      // do something here

      return args.username
    },
  },
}

export default {
  typeDef,
  resolvers,
}
