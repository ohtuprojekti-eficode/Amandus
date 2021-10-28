import { sign } from 'jsonwebtoken'
import { Tokens } from '../types/tokens'
import { UserType } from '../types/user'
import { AccessTokenResponse } from '../types/service'
import config from './config'

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

export const formatData = (data: AccessTokenResponse): AccessTokenResponse => {
  if (data.created_at || data.expires_in) {
    data.created_at = data.created_at || Math.floor(+new Date() / 1000)
    data.expires_in = data.expires_in || 7200
  }

  return data
}
