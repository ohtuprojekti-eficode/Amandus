import { UserInputError } from 'apollo-server'
import { sign } from 'jsonwebtoken'
import config from '../utils/config'
import { UserType, GitHubAuthCode, AuthResponse, AppContext } from '../types/user'
import { requestGithubToken, requestGithubUserAccount } from '../services/gitHub'
import User from '../model/user'

const typeDef = `
    type User {
        id: ID
        username: String
        emails: [String]
        gitHubId: String
        gitHubLogin: String
        gitHubEmail: String
        gitHubReposUrl: String
        gitHubToken: String
    }
`

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
    authorizeWithGithub: async (_root: unknown, args: GitHubAuthCode):Promise<AuthResponse> => {
      
        if (!args.code) {
          throw new UserInputError('GitHub code not provided')
        }

        const { access_token } = await requestGithubToken(args.code)
        
        if (!access_token) {
          throw new UserInputError('Invalid or expired GitHub code')
        }

        let gitHubUser = await requestGithubUserAccount(access_token.toString())
        // store gh token in user for now
        gitHubUser = {
          ...gitHubUser,
          access_token: access_token.toString()
        }
        if (!gitHubUser) {
          throw new Error('No GitHub user found')
        }
        
        const user = User.findOrCreateUserByGitHubUser(gitHubUser)
        
        const token = sign(
          {
            gitHubId: user.gitHubId,
            gitHubToken: access_token.toString()
          },
          config.JWT_SECRET
        )

        return {
          user,
          token
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
