/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { UserInputError } from 'apollo-server'
import config from '../../utils/config'
import { Context } from 'vm'
import { UserType, LoginArgs } from '../../types/user'

const typeDef = `
    type User {
        id: ID
        githubid: String
        username: String
        email: String
    }
`

const resolvers = {
  Query: {
    getUserById: (_root: unknown, args: UserType, _context: Context ):string => {

      
      if (!args.id) {
        throw new UserInputError('No user id provided')
      }

      // do something here

      return args.id
    },
    githubLoginUrl: ():string => {
      return `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${config.GITHUB_CB_URL}&client_id=${config.GITHUB_CLIENT_ID}`
    } 
  },
  Mutation: {
    logout: (_root: unknown, _args:undefined, context: Context):void => {
      context.logout()
    },
    loginGitHub: async (_root: unknown, args:LoginArgs, context: Context):Promise<UserType|undefined> => {
      // const email = args.email
      // const password = args.password
      console.log(args)
      const { user } = await context.authenticate('github')
      console.log('context user', context)
      void context.login(user)
      
      return context.getUser()

    },
    addUser: (_root: unknown, args: UserType, _context: Context):string => {
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
