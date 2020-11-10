export interface LoginArgs {
  email: string
  password: string
}

export interface GitHubAuthCode {
  code: string
}

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
  id: string
  email: string,
  password?: string
  emails?: string[]
  username: string
  token?: string
  gitHubId?: string
  gitHubLogin?: string
  gitHubEmail?: string
  gitHubReposUrl?: string
  gitHubToken?: string
}

export interface AuthResponse {
  user?: UserType
  token?: string
}

export interface AppContext {
  gitHubId?: string
  currentUser: UserType
}

export interface LocalUser {
  user_id: number
  username: string
  email: string
}

export interface RegisterUserInput {
  username: string
  email: string
  password: string
}

export interface LoginUserInput {
  username: string
  password: string
}

export interface UserRecord {
  user_id: string,
  username: string,
  email: string,
  password: string,
  created_on: string,
  last_login: string
}