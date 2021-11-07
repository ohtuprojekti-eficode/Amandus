import {
  GitLabUserType,
  AccessTokenResponse,
  ServiceUserResponse,
  ServiceUser,
} from '../types/service'

import { default as nodeFetch } from 'node-fetch'
import config from '../utils/config'
import { UserInputError } from 'apollo-server-errors'

export const requestGitLabToken = (
  code: string,
  fetch: typeof nodeFetch
): Promise<AccessTokenResponse> => {
  const credentials = {
    client_id: config.GITLAB_CLIENT_ID || '',
    client_secret: config.GITLAB_CLIENT_SECRET || '',
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.GITLAB_CB_URL,
  }

  return fetch('https://gitlab.com/oauth/token', {
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

export const requestGitLabUserAccount = (
  token: string,
  fetch: typeof nodeFetch
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

export const refreshGitLabToken = (
  refreshToken: string,
  fetch: typeof nodeFetch
): Promise<AccessTokenResponse> => {
  const credentials = {
    client_id: config.GITLAB_CLIENT_ID || '',
    client_secret: config.GITLAB_CLIENT_SECRET || '',
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    redirect_uri: config.GITLAB_CB_URL,
  }

  return fetch('https://gitlab.com/oauth/token', {
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

export const requestGitLabUser = async (
  code: string,
  fetch: typeof nodeFetch
): Promise<ServiceUserResponse> => {
  const response = await requestGitLabToken(code, fetch)
  const { access_token } = response

  if (!access_token) {
    throw new UserInputError('Invalid or expired GitLab code')
  }

  const gitLabUser = await requestGitLabUserAccount(access_token, fetch)

  const serviceUser: ServiceUser = {
    serviceName: 'gitlab',
    username: gitLabUser.username,
    email: gitLabUser.email,
    reposurl:
      'https://gitlab.com/api/v4/projects?simple=true&min_access_level=30',
  }

  return { serviceUser, response }
}
