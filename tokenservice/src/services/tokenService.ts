import { verify } from 'jsonwebtoken'
import { UserJWT } from '../types'
import { ServiceName, AccessTokenResponse, TokenMap } from '../types'
import { hasExpired, refreshToken } from '../utils/token'
import config from '../utils/config'

const tokenStorage = new Map<number, TokenMap>()

const setToken = (
  amandusToken: string,
  service: ServiceName,
  token: AccessTokenResponse,
  id: number
): void => {
  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  if (id !== decodedToken.id) {
    throw new Error(`token and id mismatch`)
  }

  const tokenMap: TokenMap =
    tokenStorage.get(decodedToken.id) ?? new Map<ServiceName, AccessTokenResponse>()

  tokenMap.set(service, token)

  tokenStorage.set(decodedToken.id, tokenMap)
}

const getAccessToken = async (
  amandusToken: string,
  service: ServiceName,
  id: number
): Promise<string | null> => {
  const data = getServiceDetails(amandusToken, service, id)

  if (data) {
    if (hasExpired(data) && data.refresh_token) {
      try {
        const newData = await refreshToken(service, data.refresh_token)
        setToken(amandusToken, service, newData, id)

        return newData.access_token
      } catch (e) {
        console.log(e)
        removeToken(amandusToken, service, id)
        return null
      }
    }

    return data.access_token
  }

  return null
}

const removeToken = (
  amandusToken: string,
  service: ServiceName,
  id: number
): void => {
  const tokenMap = getTokenMap(amandusToken, id)

  const result = tokenMap?.delete(service)

  if (!result) {
    throw new Error('removal unsuccessful: token or service not found')
  }

}

const removeUser = (
  amandusToken: string,
  id: number
): void => {
  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  if (id !== decodedToken.id) {
    throw new Error('token and id mismatch')
  }
  const result = tokenStorage.delete(decodedToken.id)

  if (!result) {
    throw new Error(`User removal unsuccessful: user not found`)
  }
}

const getServiceDetails = (
  amandusToken: string,
  service: ServiceName,
  id: number
): AccessTokenResponse | null => {
  const tokenMap = getTokenMap(amandusToken, id)

  if (tokenMap) {
    const serviceData = tokenMap.get(service)
    return serviceData ?? null
  }

  return null
}

const getTokenMap = (amandusToken: string, id: number): TokenMap | null => {
  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  if (id !== decodedToken.id) {
    throw new Error('token and id mismatch')
  }

  return tokenStorage.get(decodedToken.id) ?? null
}

export default {
  setToken,
  getAccessToken,
  removeToken,
  removeUser
}
