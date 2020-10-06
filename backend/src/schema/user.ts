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

        const gitHubUser = await requestGithubUser({
          client_id: config.GITHUB_CLIENT_ID || '',
          client_secret: config.GITHUB_CLIENT_SECRET || '',
          code: args.code
        })

        if (!gitHubUser) {
          throw new Error('GitHub user not found or invalid/expired code provided')
        } 

        const currentUser:UserType = {
          username: gitHubUser.login ? gitHubUser.login : '',
          emails: [gitHubUser.email ? gitHubUser.email : ''],
          gitHubid: gitHubUser.id,
          gitHubLogin: gitHubUser.login,
          gitHubEmail: gitHubUser.email,
          gitHubReposUrl: gitHubUser.repos_url,
          gitHubToken: gitHubUser.access_token,
        }
       
        return currentUser
    },
    logout: (_root: unknown, _args:undefined, _context: Context):string => {
      return 'logout'
    },
  },
}

export default {
  typeDef,
  resolvers,
}
