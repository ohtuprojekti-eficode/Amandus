import { AccessTokenResponse, ServiceName } from "../types"
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

const refreshGitLabToken = (
  refreshToken: string
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

const refreshBitbucketToken = (
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

  return fetch('https://bitbucket.org/site/oauth2/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Basic ${digested}`,
    },
    body: params,
  })
    .then<AccessTokenResponse>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}