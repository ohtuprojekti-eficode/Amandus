import {
  AccessTokenResponse,
  ServiceName,
  UserType,
  Tokens
} from "../types"
import { sign } from 'jsonwebtoken'
import fetch from 'node-fetch'
import config from './config'


export const hasExpired = (data: AccessTokenResponse): boolean => {
  const { created_at, expires_in } = data

  if (created_at && expires_in) {
    const ttl = created_at + expires_in
    const bufferTime = 300
    const currentEpochTime = Math.floor(+new Date() / 1000)

    return currentEpochTime > ttl - bufferTime
  }

  return false
}

export const refreshToken = async (
  service: ServiceName,
  refreshToken: string
): Promise<AccessTokenResponse> => {
  let details: AccessTokenResponse = { access_token: '' }

  switch (service) {
    case 'gitlab':
      details = await refreshGitLabToken(refreshToken)
      break
    case 'bitbucket':
      details = await refreshBitbucketToken(refreshToken)
      break
    default:
  }

  return details
}

const refreshGitLabToken = async (
  refreshToken: string
): Promise<AccessTokenResponse> => {
  const credentials = {
    client_id: config.GITLAB_CLIENT_ID || '',
    client_secret: config.GITLAB_CLIENT_SECRET || '',
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    redirect_uri: config.GITLAB_CB_URL,
  }

  const response = await fetch('https://gitlab.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    throw new Error('error fetching refresh token')
  }

  const token = await response.json() as AccessTokenResponse

  return token
}

const refreshBitbucketToken = async (
  refreshToken: string
): Promise<AccessTokenResponse> => {
  const credentials = {
    client_id: config.BITBUCKET_CLIENT_ID || '',
    client_secret: config.BITBUCKET_CLIENT_SECRET || '',
  }

  const digested = Buffer.from(
    `${credentials.client_id}:${credentials.client_secret}`
  ).toString('base64')

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: `${refreshToken}`,
  })

  const response = await fetch('https://bitbucket.org/site/oauth2/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Basic ${digested}`,
    },
    body: params,
  })

  if (!response.ok) {
    throw new Error('error fetching refresh token')
  }

  const token = await response.json() as AccessTokenResponse

  return token
}

export const createTokens = (user: UserType | null): Tokens => {
  const accessToken = sign(
    {
      id: user?.id,
      username: user?.username,
    },
    config.JWT_SECRET,
    { expiresIn: '15 min' }
  )

  const refreshToken = sign(
    {
      id: user?.id,
      username: user?.username,
      // todo: should have "count"
    },
    config.JWT_SECRET, //!!! TODO: Should have different secret!
    { expiresIn: '7 days' }
  )
  return { accessToken, refreshToken }
}

export const formatData = (data: AccessTokenResponse): AccessTokenResponse => {
  if (data.created_at || data.expires_in) {
    data.created_at = data.created_at || Math.floor(+new Date() / 1000)
    data.expires_in = data.expires_in || 7200
  }

  return data
}