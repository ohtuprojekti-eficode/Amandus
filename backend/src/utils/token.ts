import { sign } from 'jsonwebtoken'
import { UserType } from '../types/user'
import config from './config'

export const createToken = (user: UserType | null): string => {
  const token = sign(
    {
      id: user?.id,
      username: user?.username,
    },
    config.JWT_SECRET
  )
  return token
}
