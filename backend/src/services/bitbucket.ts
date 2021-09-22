import { BitbucketAccessTokenResponse, BitbucketUserType, BitbucketEmail } from '../types/user'
import fetch from 'node-fetch'
import config from '../utils/config'

export const requestBitbucketToken = (
  code: string
): Promise<BitbucketAccessTokenResponse> => {
  const credentials = {
    client_id: config.BITBUCKET_CLIENT_ID || '',
    //client_secret: config.BITBUCKET_CLIENT_SECRET || '',
    code,
  }

  return fetch('https://bitbucket.org/site/oauth2/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then<BitbucketAccessTokenResponse>((res) => res.json())
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}

export const requestBitbucketUserAccount = (
  token: string
): Promise<BitbucketUserType> => {
  return fetch('https://api.bitbucket.org/2.0/user', {
    headers: {
      Authorization: `token ${token}`,
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
      Authorization: `token ${token}`,
    },
  })
  .then<BitbucketEmail>((res) => res.json())
  .catch((error: Error) => {
    throw new Error(error.message)
  })
}
