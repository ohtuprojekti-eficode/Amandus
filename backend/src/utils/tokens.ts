import { sign } from 'jsonwebtoken'
import { Tokens } from '../types/tokens'
import { UserType } from '../types/user'
import config from './config'

export const createTokens = (
  user: UserType | null
): Tokens => {
  
  const accessToken = sign(
    {
      id: user?.id,
      username: user?.username
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
    config.JWT_SECRET,//!!! TODO: Should have different secret! 
    { expiresIn: '7 days' }
  )
  return {accessToken, refreshToken}
}
