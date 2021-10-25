import { AccessTokenResponse, GitHubUserType } from '../types/service'
import fetch from 'node-fetch'
import config from '../utils/config'

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