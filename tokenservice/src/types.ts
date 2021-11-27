export type ServiceName = 'github' | 'bitbucket' | 'gitlab'
export type QueryType = 'state' | 'token'

export interface UserJWT {
  id: number
  username: string
  githubToken?: string
  bitbucketToken?: string
  gitlabToken?: string
}

export interface RequestContent {
  id: number
  amandusToken: string
}

export interface GetRequestContent extends RequestContent {
  serviceName: ServiceName
  queryType: QueryType
}

export interface DeleteRequestContent extends RequestContent {
  serviceName: ServiceName
}

export interface PostRequestContent extends RequestContent {
  serviceName: ServiceName
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
