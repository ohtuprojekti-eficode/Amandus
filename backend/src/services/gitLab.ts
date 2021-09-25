import { GitLabAccessTokenResponse, GitLabUserType } from '../types/user'
import fetch from 'node-fetch'
import config from '../utils/config'

export const requestGitLabToken = (
  code: string
): Promise<GitLabAccessTokenResponse> => {
  const credentials = {
    client_id: config.GITLAB_CLIENT_ID || '',
    client_secret: config.GITLAB_CLIENT_SECRET || '',
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.GITLAB_CB_URL
  }

  return fetch('https://gitlab.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then<GitLabAccessTokenResponse>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}

export const requestGitLabUserAccount = (
  token: string
): Promise<GitLabUserType> => {
  return fetch('https://gitlab.com/api/v4/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then<GitLabUserType>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
