import { sign } from 'jsonwebtoken'
import { UserType } from '../types/user'
import config from './config'

export const createToken = (
  user: UserType | null,
  githubToken?: string,
  gitlabToken?: string,
): string => {
  
  const token = sign(
    {
      id: user?.id,
      username: user?.username,
      githubToken: githubToken,
      gitlabToken: gitlabToken,
    },
    config.JWT_SECRET
  )
  return token
}
