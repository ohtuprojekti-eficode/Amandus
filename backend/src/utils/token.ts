import { sign } from 'jsonwebtoken'
import { Tokens } from '../types/tokens'
import { UserType } from '../types/user'
import config from './config'

export const createToken = (
  user: UserType | null,
  githubToken?: string
): Tokens => {
  
  const accessToken = sign(
    {
      id: user?.id,
      username: user?.username,
      githubToken,
    },
    config.JWT_SECRET,
    { expiresIn: '15m' }
  )

  const refreshToken = sign(
    {
      id: user?.id,
      username: user?.username,
      githubToken,
    },    
    config.JWT_SECRET,//!!! TODO: Should have different secret!
    { expiresIn: '7 days' }
  )
  return {accessToken, refreshToken}
}
