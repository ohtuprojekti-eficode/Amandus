export type ServiceName = 'github' | 'bitbucket' | 'gitlab'

export interface UserJWT {
  id: number
  username: string
  githubToken?: string
  bitbucketToken?: string
  gitlabToken?: string
}

export interface GetRequestContent {
  id: number
  serviceName: ServiceName
  amandusToken: string
}

export interface DeleteRequestContent {
  id: number
  serviceName?: ServiceName
  amandusToken: string
}

export interface PostRequestContent extends GetRequestContent {
  serviceToken: AccessTokenResponse
}

export type RequestBody = {
  serviceToken: AccessTokenResponse
}

export interface AccessTokenResponse {
  access_token: string
  token_type?: string
  refresh_token?: string
  expires_in?: number
  created_at?: number
}

export type TokenMap = Map<ServiceName, AccessTokenResponse>

export interface UserType {
  id: number
  username: string
  user_role: string
  email: string
  services?: ServiceUser[]
}

export interface ServiceUser {
  serviceName: ServiceName
  username: string
  email: string | null
  reposurl: string
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}
