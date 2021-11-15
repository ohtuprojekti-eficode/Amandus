import { UserInputError, ForbiddenError } from 'apollo-server'
import fetch from 'node-fetch'
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
import { UserType, AppContext } from '../types/user'
import { ServiceAuthCode, ServiceAuthResponse } from '../types/service'

import { Tokens } from '../types/tokens'

import tokenService from '../services/token'
import { requestServiceUser } from '../services/commonServices'

const typeDef = `
    enum ServiceName {
      github
      bitbucket
      gitlab
    }
    type ServiceUser {
      serviceName: ServiceName
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
    isServiceConnected: (
      _root: unknown,
      _args: unknown,
      context: AppContext,
      service: string
    ): Promise<any> => {
      return fetch(`http://tokenservice:3002/api/tokens/${context.currentUser.id}/${service}?data=state`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${context.accessToken}` }
      }).then(res => {
        if (!res.ok) {
          throw new Error('Error fetching service connection state')
        }
        return res.json()
      }
      )
    },
    isGithubConnected: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): boolean => {
      return tokenService.isServiceConnected(context.currentUser.id, 'github')
    },
    isGitLabConnected: (
      _root: unknown,
      _args: unknown,
      context: AppContext
    ): boolean => {
      return tokenService.isServiceConnected(context.currentUser.id, 'gitlab')
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

      //TODO: rename requestServiceUser, as it returns user and token, not just user
      const serviceUserResponse = await requestServiceUser(service, args.code)
      const body = { serviceToken: serviceUserResponse.response }

      const response = await fetch(`http://tokenservice:3002/api/tokens/${context.currentUser.id}/${service}?data=token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${context.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })

      if (response.status !== 200) {
        throw new Error('something went wrong while adding new token')
      }

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
      context: AppContext
    ): Promise<void> => {
      const { username } = args

      if (!username) {
        throw new UserInputError('User not valid')
      }
      const user = await User.findUserByUsername(username)

      if (!user?.id) {
        throw new Error('Did not receive user id for use removal')
      }

      console.log(`Attempting removal of user ${user.id} with token ${context.accessToken}`)

      const response = await fetch(`http://tokenservice:3002/api/tokens/${user.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${context.accessToken}`,
            "Content-Type": "application/json"
          }
        })

      if (response.status !== 200) {
        console.log(response.json())
        throw new Error('Something went wrong while deleting user tokens from token service')
      }


      await User.deleteUser(username)
    },
  },
}

export default {
  typeDef,
  resolvers,
}
