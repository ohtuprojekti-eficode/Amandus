import {
  AccessTokenResponse,
  BitbucketUserType,
  BitbucketEmail,
  ServiceUserResponse,
  ServiceUser,
} from '../types/service'
import fetch from 'node-fetch'
import config from '../utils/config'
import { UserInputError } from 'apollo-server-errors'

export const requestBitbucketToken = (
  code: string
): Promise<AccessTokenResponse> => {
  const credentials = {
    client_id: config.BITBUCKET_CLIENT_ID || '',
    client_secret: config.BITBUCKET_CLIENT_SECRET || '',
  }

  const digested = Buffer.from(
    `${credentials.client_id}:${credentials.client_secret}`
  ).toString('base64')

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: `${code}`,
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

export const requestBitbucketUserAccount = (
  token: string
): Promise<BitbucketUserType> => {
  return fetch('https://api.bitbucket.org/2.0/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then<BitbucketUserType>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}

export const requestBitbucketUserEmail = (
  token: string
): Promise<BitbucketEmail> => {
  return fetch('https://api.bitbucket.org/2.0/user/emails', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then<BitbucketEmail>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}

export const refreshBitbucketToken = (
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

export const requestBitbucketUser = async (
  code: string
): Promise<ServiceUserResponse> => {
  const response = await requestBitbucketToken(code)
  const { access_token } = response

  if (!access_token) {
    throw new UserInputError('Invalid or expired Bitbucket code')
  }

  const bitbucketUser = await requestBitbucketUserAccount(access_token)
  const bitbucketUserEmail = await requestBitbucketUserEmail(access_token)

  const email = bitbucketUserEmail.values.find(
    (email) => email.is_primary
  )?.email

  if (!email) {
    throw new Error('Bitbucket email not found!')
  }

  const serviceUser: ServiceUser = {
    serviceName: 'bitbucket',
    username: bitbucketUser.username,
    email: email,
    reposurl: bitbucketUser.links.repositories.href,
  }

  return { serviceUser, response }
}
