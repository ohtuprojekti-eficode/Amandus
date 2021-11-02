import { AccessTokenResponse } from "../types"

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