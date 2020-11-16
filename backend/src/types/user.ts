export interface GitHubAccessToken {
  access_token: string
}

export interface GitHubAccessTokenResponse {
  access_token: GitHubAccessToken
}

export interface GitHubUserType {
  id?: string
  login?: string
  email?: string
  repos_url?: string
  access_token?: string
}

export interface UserType {
  id: number
  username: string
  email: string
  services?: ServiceUserType[]
}

export interface AuthResponse {
  user?: UserType
  token?: string
}

export interface AppContext {
  gitHubId?: string
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
}

export interface ServiceUserType {
  serviceName: string
  username: string
  email: string
  token: string
  reposurl: string
}
