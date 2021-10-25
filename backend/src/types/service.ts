import { Tokens } from "./tokens";

export type ServiceName = 'github' | 'bitbucket' | 'gitlab'

export type ServiceTokenType = `${ServiceName}Token`

export interface Service {
  id: number
  name: ServiceName
}

export interface AuthCode {
  code: string
}

export interface AccessTokenResponse {
  access_token: string
  token_type?: string
  refresh_token?: string
  expires_in?: number
  created_at?: number
}

export interface GitHubUserType {
  id: string
  login: string
  email: string | null
  repos_url: string
  access_token: string
}

export interface GitLabUserType {
  id: string
  username: string
  email: string | null
  repos_url: string
  access_token: string
  refresh_token: string
}

export interface BitbucketUserType {
  username: string,
  account_id: string,
  links: {
    repositories: {
      href: string
    }
  },
  access_Token: string
}

export interface BitbucketEmail {
  values: [
    {
      is_primary: boolean
      email: string
    }
  ]
}

export interface ServiceUserType {
  serviceName: string
  username: string
  email: string | null
  reposurl: string
}

export interface ServiceAuthResponse {
  serviceUser: ServiceUserType
  tokens: Tokens
}

