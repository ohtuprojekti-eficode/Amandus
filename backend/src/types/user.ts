import { ServiceTokenType } from './service'

export interface GitHubAuthCode {
  code: string
}

export interface GitHubAccessTokenResponse {
  access_token: string
}

export interface GitHubUserType {
  id: string
  login: string
  email: string | null
  repos_url: string
  access_token: string
}

export interface UserType {
  id: number
  username: string
  email: string
  services?: ServiceUserType[]
}

export interface ServiceAuthResponse {
  serviceUser: ServiceUserType
  token: string
}

export type ContextTokens = {
  [key in ServiceTokenType]?: string
}

export interface AppContext extends ContextTokens {
  currentUser: UserType
}

export interface UserRecord {
  id: number
  username: string
  email: string
  password: string
  created_on: string
  last_login: string
}

export interface UserJWT {
  id: number
  username: string
  githubToken?: string
}

export interface ServiceUserType {
  serviceName: string
  username: string
  email: string | null
  reposurl: string
}
