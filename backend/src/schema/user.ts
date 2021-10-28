import { UserInputError, ForbiddenError } from 'apollo-server'
import bcrypt from 'bcryptjs'
import Crypto from 'crypto'
import User from '../model/user'
import Service from '../model/service'
import { createTokens } from '../utils/tokens'
import config from '../utils/config'
import { validateUserArgs } from '../utils/validation'
import {
  RegisterUserInput,
  LoginUserInput,
  AddServiceArgs,
} from '../types/params'
import {
  UserType,
  AppContext,
} from '../types/user'
import {
  ServiceAuthCode,
  ServiceAuthResponse,
} from '../types/service'

import { Tokens } from '../types/tokens'

import tokenService from '../services/token'
import { requestServiceUser } from '../services/commonServices'

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
        user_role: String!
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
    isGithubConnected: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): boolean => {
      return tokenService.isServiceConnected(
        context.currentUser.id,
        'github'
      )
    },
    isGitLabConnected: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): boolean => {
      return tokenService.isServiceConnected(
        context.currentUser.id,
        'gitlab'
      )
    },
    isBitbucketConnected: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): boolean => {
      return tokenService.isServiceConnected(
        context.currentUser.id,
        'bitbucket'
      )
    },
    githubLoginUrl: (): string => {
      const cbUrl = config.GITHUB_CB_URL || ''
      const clientID = config.GITHUB_CLIENT_ID || ''

      if (!cbUrl || !clientID) {
        throw new Error('GitHub client id or callback url not set')
      }

      return `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${cbUrl}&client_id=${clientID}&scope=repo`
    },
    bitbucketLoginUrl: (): string => {
      const cbUrl = config.BITBUCKET_CB_URL || ''
      const clientID = config.BITBUCKET_CLIENT_ID || ''

      if (!cbUrl || !clientID) {
        throw new Error('Bitbucket client id or callback url not set')
      }

      return `https://bitbucket.org/site/oauth2/authorize?client_id=${clientID}&response_type=code`
    },
    gitLabLoginUrl: (): string => {
      const cbUrl = config.GITLAB_CB_URL || ''
      const clientID = config.GITLAB_CLIENT_ID || ''
      const state = Crypto.randomBytes(24).toString('hex')

      if (!cbUrl || !clientID) {
        throw new Error('GitLab client id or callback url not set')
      }

      return `https://gitlab.com/oauth/authorize?client_id=${clientID}&redirect_uri=${cbUrl}&response_type=code&state=${state}&scope=read_user+read_repository+write_repository+api`
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

      const validServices = ['github', 'bitbucket', 'gitlab']

      if (!validServices.includes(args.service.serviceName)) {
        throw new UserInputError(
          `'Currently supported services are 'github', 'bitbucket' and 'gitlab'.`
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
    authorizeWithService: async (
      _root: unknown,
      args: ServiceAuthCode,
      context: AppContext
    ): Promise<ServiceAuthResponse> => {
      const service = args.service
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      if (!args.code) {
        throw new UserInputError(`${service} code not provided`)
      }

      const serviceUserResponse = await requestServiceUser(service, args.code)

      tokenService.setToken(context.currentUser.id, service, serviceUserResponse.access_token)
      const serviceUser = serviceUserResponse.serviceUser
      const tokens = createTokens(context.currentUser)

      return { serviceUser, tokens }
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
    ): Promise<Tokens> => {
      const { validationFailed, errorMessage } = validateUserArgs(args)
      if (validationFailed) {
        throw new UserInputError(errorMessage)
      }

      const user = await User.registerUser(args)

      if (!user) {
        throw new UserInputError(
          'Could not create a user with given username and password'
        )
      }

      const tokens = createTokens(user)

      return tokens
    },
    login: async (_root: unknown, args: LoginUserInput): Promise<Tokens> => {
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

      const tokens = createTokens(user)
      return tokens
    },
    deleteUser: async (
      _root: unknown,
      args: UserType,
      _context: AppContext
    ): Promise<void> => {
      const { username } = args

      if (!username) {
        throw new UserInputError('User not valid')
      }
      const user = await User.findUserByUsername(username)
      user?.id && tokenService.deleteTokenByUserId(user.id)
      await User.deleteUser(username)
    },
  },
}

export default {
  typeDef,
  resolvers,
}
