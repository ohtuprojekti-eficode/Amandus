import { sign } from 'jsonwebtoken'
import { UserType } from '../types/user'
import config from './config'

export const createToken = (
  user: UserType | null,
  githubToken?: string,
  bitbucketToken?: string,
  gitlabToken?: string,
): string => {
  
  const token = sign(
    {
      id: user?.id,
      username: user?.username,
      githubToken: githubToken,
      bitbucketToken: bitbucketToken,
      gitlabToken: gitlabToken,
    },
    config.JWT_SECRET
  )
  return token
}
