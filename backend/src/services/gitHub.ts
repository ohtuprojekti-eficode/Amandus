import {
  AccessTokenResponse,
  GitHubUserType,
  ServiceUser,
  ServiceUserResponse,
} from '../types/service'
import fetch from 'node-fetch'
import config from '../utils/config'
import { UserInputError } from 'apollo-server-errors'

export const requestGithubToken = (
  code: string
): Promise<AccessTokenResponse> => {
  const credentials = {
    client_id: config.GITHUB_CLIENT_ID || '',
    client_secret: config.GITHUB_CLIENT_SECRET || '',
    code,
  }

  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then<AccessTokenResponse>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}

export const requestGithubUserAccount = (
  token: string
): Promise<GitHubUserType> => {
  return fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then<GitHubUserType>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}

export const requestGithubUser = async (
  code: string
): Promise<ServiceUserResponse> => {
  const response = await requestGithubToken(code)
  const { access_token } = response

  if (!access_token) {
    throw new UserInputError('Invalid or expired GitHub code')
  }

  const gitHubUser = await requestGithubUserAccount(access_token)

  const serviceUser: ServiceUser = {
    serviceName: 'github',
    username: gitHubUser.login,
    email: gitHubUser.email,
    reposurl: gitHubUser.repos_url,
  }

  return { serviceUser, response }
}
