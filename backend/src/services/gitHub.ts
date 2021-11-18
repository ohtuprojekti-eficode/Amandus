import {
  AccessTokenResponse,
  GitHubUserType,
  ServiceUser,
  ServiceUserResponse,
} from '../types/service'

import { default as nodeFetch } from 'node-fetch'

import config from '../utils/config'
import { UserInputError } from 'apollo-server-errors'

export const requestGithubToken = (
  code: string,
  fetch: typeof nodeFetch
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
  token: string,
  fetch: typeof nodeFetch
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
  code: string,
  fetch: typeof nodeFetch
): Promise<ServiceUserResponse> => {
  const response = await requestGithubToken(code, fetch)
  const { access_token } = response

  if (!access_token) {
    throw new UserInputError('Invalid or expired GitHub code')
  }

  const gitHubUser = await requestGithubUserAccount(access_token, fetch)

  const serviceUser: ServiceUser = {
    serviceName: 'github',
    username: gitHubUser.login,
    email: gitHubUser.email,
    reposurl: 'https://api.github.com/user/repos',
  }

  return { serviceUser, response }
}
