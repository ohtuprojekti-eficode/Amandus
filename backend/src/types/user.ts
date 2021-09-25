import { Tokens } from "./tokens";

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

export interface BitbucketAuthCode {
  code: string
}

export interface BitbucketAccessTokenResponse {
  access_token: string
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

export interface GitLabAuthCode {
  code: string
}

export interface GitLabAccessTokenResponse {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  created_at: number
}

export interface GitLabUserType {
  id: string
  username: string
  email: string | null
  repos_url: string
  access_token: string
  refresh_token: string
}

export interface UserType {
  id: number
  username: string
  email: string
  services?: ServiceUserType[]
}

export interface ServiceAuthResponse {
  serviceUser: ServiceUserType
  token: Tokens
}

export interface AppContext {
  currentUser: UserType
  githubToken?: string
  bitbucketToken?: string
  gitlabToken?: string
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
  bitbucketToken?: string
  gitlabToken?: string
}

export interface ServiceUserType {
  serviceName: string
  username: string
  email: string | null
  reposurl: string
}
