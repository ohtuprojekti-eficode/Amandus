import { UserInputError, ForbiddenError } from 'apollo-server'
import bcrypt from 'bcryptjs'
import config from '../utils/config'
import {
  UserType,
  AuthResponse,
  AppContext,
  GitHubAuthCode,
  ServiceAuthResponse,
} from '../types/user'
import User from '../model/user'
import Service from '../model/service'
import { createToken } from '../utils/token'
import {
  RegisterUserInput,
  LoginUserInput,
  AddServiceArgs,
} from '../types/params'
import {
  requestGithubToken,
  requestGithubUserAccount,
} from '../services/gitHub'

const typeDef = `
    type ServiceUser {
      serviceName: String!
      username: String!
      email: String
      reposurl: String!
    }
    type User {
        id: Int!
        username: String!
        email: String!
        services: [ServiceUser!]
    }
`

const resolvers = {
  Query: {
    me: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): UserType | undefined => {
      return context.currentUser
    },
    githubLoginUrl: (): string => {
      const cbUrl = config.GITHUB_CB_URL || ''
      const cliendID = config.GITHUB_CLIENT_ID || ''

      if (!cbUrl || !cliendID) {
        throw new Error('GitHub cliend id or callback url not set')
      }

      return `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${cbUrl}&client_id=${cliendID}`
    },
    currentToken: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): string | undefined => {
      return context.githubToken
    },
  },
  Mutation: {
    connectGitService: async (
      _root: unknown,
      args: AddServiceArgs,
      context: AppContext
    ): Promise<string> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      if (!args) {
        throw new UserInputError('No service account provided')
      }

      if (args.service.serviceName !== 'github') {
        throw new UserInputError(
          `'github' is the only currently supported service`
        )
      }

      const service = await Service.getServiceByName(args.service.serviceName)

      await User.addServiceUser({
        ...args.service,
        user_id: context.currentUser.id,
        services_id: service.id,
      })

      return 'success'
    },
    authorizeWithGithub: async (
      _root: unknown,
      args: GitHubAuthCode,
      context: AppContext
    ): Promise<ServiceAuthResponse> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      if (!args.code) {
        throw new UserInputError('GitHub code not provided')
      }

      const { access_token } = await requestGithubToken(args.code)

      if (!access_token) {
        throw new UserInputError('Invalid or expired GitHub code')
      }

      const gitHubUser = await requestGithubUserAccount(access_token)

      const serviceUser = {
        serviceName: 'github',
        username: gitHubUser.login,
        email: gitHubUser.email,
        reposurl: gitHubUser.repos_url,
      }
      const token = createToken(context.currentUser, access_token)

      return {
        serviceUser,
        token,
      }
    },
    logout: (
      _root: unknown,
      _args: undefined,
      _context: AppContext
    ): string => {
      return 'logout'
    },
    register: async (
      _root: unknown,
      args: RegisterUserInput
    ): Promise<AuthResponse> => {
      if (
        args.username.length === 0 ||
        args.email.length === 0 ||
        args.password.length === 0
      ) {
        throw new UserInputError('Username, email or password can not be empty')
      }

      const user = await User.registerUser(args)

      if (!user) {
        throw new UserInputError(
          'Could not create a user with given username and password'
        )
      }

      const token = createToken(user)

      return {
        user,
        token,
      }
    },
    login: async (
      _root: unknown,
      args: LoginUserInput
    ): Promise<AuthResponse> => {
      const user = await User.findUserByUsername(args.username)

      if (!user) {
        throw new UserInputError('Invalid username or password')
      }

      const passwordMatch = await bcrypt.compare(
        args.password,
        user.password ?? ''
      )

      if (!passwordMatch) {
        throw new UserInputError('Invalid username or password')
      }

      const token = createToken(user)

      return {
        user,
        token,
      }
    },
  },
}

export default {
  typeDef,
  resolvers,
}
