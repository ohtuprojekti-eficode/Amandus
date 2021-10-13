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
  VCServiceAuthCode,
  ServiceAuthResponse,
} from '../types/user'
import {
  requestGithubToken,
  requestGithubUserAccount,
} from '../services/gitHub'
import {
  requestBitbucketToken,
  requestBitbucketUserAccount,
  requestBitbucketUserEmail,
} from '../services/bitbucket'

import {
  requestGitLabToken,
  requestGitLabUserAccount,
} from '../services/gitLab'

import { Tokens } from '../types/tokens'

import tokenService from '../services/token'

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
      return !!context.githubToken
    },
    isGitLabConnected: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): boolean => {
      return !!context.gitlabToken
    },
    githubLoginUrl: (): string => {
      const cbUrl = config.GITHUB_CB_URL || ''
      const clientID = config.GITHUB_CLIENT_ID || ''

      if (!cbUrl || !clientID) {
        throw new Error('GitHub client id or callback url not set')
      }

      return `https://github.com/login/oauth/authorize?response_type=code&redirect_uri=${cbUrl}&client_id=${clientID}&scope=repo`
    },

    isBitbucketConnected: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): boolean => {
      return !!context.bitbucketToken
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
    authorizeWithGithub: async (
      _root: unknown,
      args: VCServiceAuthCode,
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

      tokenService.setToken(context.currentUser.id, 'github', access_token)

      const serviceUser = {
        serviceName: 'github',
        username: gitHubUser.login,
        email: gitHubUser.email,
        reposurl: gitHubUser.repos_url,
      }

      const tokens = createTokens(context.currentUser)

      return {
        serviceUser,
        tokens,
      }
    },

    authorizeWithGitLab: async (
      _root: unknown,
      args: VCServiceAuthCode,
      context: AppContext
    ): Promise<ServiceAuthResponse> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      if (!args.code) {
        throw new UserInputError('GitLab code not provided')
      }

      const { access_token } = await requestGitLabToken(args.code)

      if (!access_token) {
        throw new UserInputError('Invalid or expired GitLab code')
      }

      const gitLabUser = await requestGitLabUserAccount(access_token)

      tokenService.setToken(context.currentUser.id, 'gitlab', access_token)

      const serviceUser = {
        serviceName: 'gitlab',
        username: gitLabUser.username,
        email: gitLabUser.email,
        reposurl: 'https://gitlab.com/api/v4/projects?simple=true&min_access_level=30'
      }

      const tokens = createTokens(context.currentUser)

      return {
        serviceUser,
        tokens,
      }
    },

    authorizeWithBitbucket: async (
      _root: unknown,
      args: VCServiceAuthCode,
      context: AppContext
    ): Promise<ServiceAuthResponse> => {
      if (!context.currentUser) {
        throw new ForbiddenError('You have to login')
      }

      if (!args.code) {
        throw new UserInputError('Bitbucket code not provided')
      }

      const { access_token } = await requestBitbucketToken(args.code)

      if (!access_token) {
        throw new UserInputError('Invalid or expired Bitbucket code')
      }

      const bitBucketUser = await requestBitbucketUserAccount(access_token)
      const bitbucketUserEmail = await requestBitbucketUserEmail(access_token)

      tokenService.setToken(context.currentUser.id, 'bitbucket', access_token)

      const email = bitbucketUserEmail.values.find(
        (email) => email.is_primary
      )?.email

      if (!email) {
        throw new Error('Bitbucket email not found!')
      }

      const serviceUser = {
        serviceName: 'bitbucket',
        username: bitBucketUser.username,
        email: email,
        reposurl: bitBucketUser.links.repositories.href,
      }

      const tokens = createTokens(context.currentUser)

      return {
        serviceUser,
        tokens,
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
      const username = args.username
      if (!username) {
        throw new UserInputError(
          'User not valid'
        )
      }
      await User.deleteUser(username)
    }
  }
}

export default {
  typeDef,
  resolvers,
}
