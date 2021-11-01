import { ContextTokens } from './../types/user'
import { ServiceTokenType, ServiceName } from './../types/service'
import { verify } from 'jsonwebtoken'
import config from '../utils/config'
import { UserJWT } from '../types/user'

type TokenMap = Map<ServiceName, string>

const tokenStorage = new Map<number, TokenMap>()

const setToken = (
  userId: number,
  service: ServiceName,
  token: string
): void => {
  const tokenMap: TokenMap =
    tokenStorage.get(userId) ?? new Map<ServiceName, string>()

  tokenMap.set(service, token)

  tokenStorage.set(userId, tokenMap)
}

const getTokenMap = (amandusToken: string): TokenMap | null => {
  // if refactored as an idependent service, this version should be used.
  // for now it is ok to allow fetching with user id
  const decodedToken = <UserJWT>verify(amandusToken, config.JWT_SECRET)

  return tokenStorage.get(decodedToken.id) ?? null
}

const getTokensForApolloContext = (amandusToken: string): ContextTokens => {
  const tokenMap = getTokenMap(amandusToken)

  const contextTokens: ContextTokens = {}

  if (tokenMap) {
    for (const [service, token] of tokenMap) {
      contextTokens[`${service}Token` as ServiceTokenType] = token
    }
  }

  return contextTokens
}

const getTokenMapById = (userId: number): TokenMap | null => {
  // this should NOT be used, if refactored as an independent service
  return tokenStorage.get(userId) ?? null
}

const deleteTokenByUserId = (userId: number): void => {
  // this should probably not be used, if refactored as an independent service
  tokenStorage.delete(userId)
}

const getTokensForApolloContextById = (userId: number): ContextTokens => {
  // this should NOT be used, if refactored as an independent service
  const tokenMap = getTokenMapById(userId)

  const contextTokens: ContextTokens = {}

  if (tokenMap) {
    for (const [service, token] of tokenMap) {
      contextTokens[`${service}Token` as ServiceTokenType] = token
    }
  }

  return contextTokens
}

const clearStorage = (): void => {
  tokenStorage.clear()
}

export default {
  setToken,
  getTokenMap,
  getTokenMapById,
  getTokensForApolloContext,
  getTokensForApolloContextById,
  clearStorage,
  deleteTokenByUserId
}
