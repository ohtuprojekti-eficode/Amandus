import { verify } from 'jsonwebtoken'
import { UserJWT } from '../types'
import { ServiceName, AccessTokenResponse } from '../types'
import { hasExpired } from '../utils/token'
import config from '../utils/config'

type TokenMap = Map<ServiceName, AccessTokenResponse>

const tokenStorage = new Map<number, TokenMap>()

const setToken = (
  /*TODO:
  Handle amandusToken decryption in a reasonable way;
  for example in getAccessToken, it gets already decrypted,
  but get sent again crypted as parameter for setToken function,
  where it is again decrypted*/
  amandusToken: string,
  service: ServiceName,
  token: AccessTokenResponse
): void => {

  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  const tokenMap: TokenMap =
    tokenStorage.get(decodedToken.id) ?? new Map<ServiceName, AccessTokenResponse>()

  tokenMap.set(service, token)

  tokenStorage.set(decodedToken.id, tokenMap)
}

const getTokenMap = (amandusToken: string): TokenMap | null => {
  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  return tokenStorage.get(decodedToken.id) ?? null
}

const getTokenMapById = (userId: number): TokenMap | null => {
  return tokenStorage.get(userId) ?? null
}

const getAccessToken = async (
  amandusToken: string,
  service: ServiceName
): Promise<string | null> => {
  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  const data = getServiceDetails(decodedToken.id, service)

  if (data) {
    if (hasExpired(data) && data.refresh_token) {
      try {
        const newData = await refreshToken(service, data.refresh_token)
        setToken(amandusToken, service, newData)

        return newData.access_token
      } catch (e) {
        console.log(e)
        removeToken(amandusToken, service)
        return null
      }
    }

    return data.access_token
  }

  return null
}

const removeToken = (
  amandusToken: string,
  service: ServiceName
): void => {
  const tokenMap = getTokenMap(amandusToken)

  const result = tokenMap?.delete(service)

  if (!result) {
    throw new Error('removal unsuccessful: token or service not found')
  }

}

const refreshToken = async (
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


const getServiceDetails = (
  userId: number,
  service: ServiceName
): AccessTokenResponse | null => {
  const tokenMap = getTokenMapById(userId)

  if (tokenMap) {
    const serviceData = tokenMap.get(service)
    return serviceData ?? null
  }

  return null
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

const removeUser = (
  amandusToken: string
): void => {
  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  const result = tokenStorage.delete(decodedToken.id)

  if (!result) {
    throw new Error(`User removal unsuccessful: user not found`)
  }
}


export default {
  setToken,
  getAccessToken,
  removeToken,
  removeUser
}
