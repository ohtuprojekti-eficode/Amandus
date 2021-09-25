import { sign } from 'jsonwebtoken'
import { Tokens } from '../types/tokens'
import { UserType } from '../types/user'
import config from './config'

export const createTokens = (
  user: UserType | null,
  githubToken?: string,
  bitbucketToken?: string,
  gitlabToken?: string,
): Tokens => {
  
  const accessToken = sign(
    {
      id: user?.id,
      username: user?.username,
      githubToken: githubToken,
      bitbucketToken: bitbucketToken,
      gitlabToken: gitlabToken,
    },
    config.JWT_SECRET,
    { expiresIn: '15 min' }
  )

  const refreshToken = sign(
    {
      id: user?.id,
      username: user?.username,
      githubToken: githubToken,
      bitbucketToken: bitbucketToken,
      gitlabToken: gitlabToken
      // todo: should have "count"
    },    
    config.JWT_SECRET,//!!! TODO: Should have different secret! 
    { expiresIn: '7 days' }
  )
  return {accessToken, refreshToken}
}
