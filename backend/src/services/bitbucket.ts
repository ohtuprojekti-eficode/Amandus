import { AccessTokenResponse, BitbucketUserType, BitbucketEmail } from '../types/service'
import fetch from 'node-fetch'
import config from '../utils/config'

export const requestBitbucketToken = (
  code: string
): Promise<AccessTokenResponse> => {
  
  const credentials = {
    client_id: config.BITBUCKET_CLIENT_ID || '',
    client_secret: config.BITBUCKET_CLIENT_SECRET || '',
    code,
  }

  const digested = Buffer.from(`${credentials.client_id}:${credentials.client_secret}`).toString('base64')
  
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: `${code}`
  });
  

   return fetch('https://bitbucket.org/site/oauth2/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Basic ${digested}`
    },
    body: params
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
