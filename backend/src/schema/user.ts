/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { UserInputError } from 'apollo-server'
import config from '../../utils/config'
import { Context } from 'vm'
import { UserType, GitHubAuthCode } from '../../types/user'
import { requestGithubUser } from '../../services/gitHub'

const typeDef = `
    type User {
        id: ID
        username: String
        emails: [String]
        gitHubid: String
        gitHubLogin: String
        gitHubEmail: String
        gitHubReposUrl: String
        gitHubToken: String
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
    authorizeWithGithub: async (_root: unknown, args: GitHubAuthCode):Promise<UserType> => {
      
        const gitHubUser = await requestGithubUser({
          client_id: config.GITHUB_CLIENT_ID ? config.GITHUB_CLIENT_ID : '',
          client_secret: config.GITHUB_CLIENT_SECRET ? config.GITHUB_CLIENT_SECRET : '',
          code: args.code
        })
      
        const currentUser:UserType = {
          username: gitHubUser.login ? gitHubUser.login : '',
          emails: [gitHubUser.email ? gitHubUser.email : ''],
          gitHubid: gitHubUser.id,
          gitHubLogin: gitHubUser.login,
          gitHubEmail: gitHubUser.email,
          gitHubReposUrl: gitHubUser.repos_url,
          gitHubToken: gitHubUser.access_token,
        }
        
        console.log('currentuser', currentUser)
        return currentUser
    },
    logout: (_root: unknown, _args:undefined, context: Context):void => {
      context.logout()
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
