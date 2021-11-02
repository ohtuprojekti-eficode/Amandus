export type ServiceName = 'github' | 'bitbucket' | 'gitlab'

export interface UserJWT {
  id: number
  username: string
  githubToken?: string
  bitbucketToken?: string
  gitlabToken?: string
}

export interface PostRequestParams {
  amandusToken: string
  serviceName: ServiceName
  serviceToken: AccessTokenResponse
}

export interface GetRequestParams {
  amandusToken: string
  serviceName: ServiceName
}

export interface AccessTokenResponse {
  access_token: string
  token_type?: string
  refresh_token?: string
  expires_in?: number
  created_at?: number
}