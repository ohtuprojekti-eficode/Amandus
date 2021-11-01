import { verify } from 'jsonwebtoken'
import { UserJWT } from '../types'
import { ServiceName } from '../types'
import config from '../utils/config'

type TokenMap = Map<ServiceName, string>

const tokenStorage = new Map<number, TokenMap>()

const setToken = (
  amandusToken: string,
  service: ServiceName,
  token: string
): void => {

  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  const tokenMap: TokenMap =
    tokenStorage.get(decodedToken.id) ?? new Map<ServiceName, string>()

  tokenMap.set(service, token)

  tokenStorage.set(decodedToken.id, tokenMap)
}

const getTokenMap = (amandusToken: string): TokenMap | null => {
  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)
  return tokenStorage.get(decodedToken.id) ?? null
}


export default {
  setToken,
  getTokenMap
}
