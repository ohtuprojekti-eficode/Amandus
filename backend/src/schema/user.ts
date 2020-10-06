import { UserInputError } from 'apollo-server'
import config from '../../utils/config'
import { UserType, GitHubAuthCode } from '../../types/user'
import { requestGithubUser } from '../../services/gitHub'
import User from '../model/user'

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

interface AppContext {
  gitHubId?: string,
  currentUser: UserType
}

const resolvers = {
  Query: {
    me: (_root:unknown, _args:unknown, context: AppContext):UserType|undefined => {
      return context.currentUser
    },
    githubLoginUrl: ():string => {
      const cbUrl = config.GITHUB_CB_URL || ''
      const cliendID = config.GITHUB_CLIENT_ID || ''

      if (!cbUrl || !cliendID) {
        throw new Error('GitHub cliend id or callback url not set')
      }

      return `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${cbUrl}&client_id=${cliendID}`
    } 
  },
  Mutation: {
    authorizeWithGithub: async (_root: unknown, args: GitHubAuthCode):Promise<UserType> => {
      
        if (!args.code) {
          throw new UserInputError('GitHub code not provided')
        }

        try {
          const gitHubUser = await requestGithubUser({
            client_id: config.GITHUB_CLIENT_ID || '',
            client_secret: config.GITHUB_CLIENT_SECRET || '',
            code: args.code
          })

          return User.findOrCreateUserByGitHubUser(gitHubUser)

        } catch (error) {
          throw new UserInputError(error)
        } 
    },
    logout: (_root: unknown, _args:undefined, _context: AppContext):string => {
      return 'logout'
    },
  },
}

export default {
  typeDef,
  resolvers,
}
