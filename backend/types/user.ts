export interface LoginArgs {
    email: string,
    password: string
}

export interface GitHubCredentials {
    client_id: string,
    client_secret: string,
    code: string
}

export interface GitHubAuthCode {
    code: string
}

export interface GitHubAccessToken {
    access_token: string
}

export interface GitHubAccessTokenResponse {
    access_token: GitHubAccessToken,

}

export interface GitHubUserType {
    id?: string,
    login?: string,
    email?: string,
    repos_url?: string, 
    access_token?: string
}

export interface UserType {
    id?: string
    emails: string[]
    username: string
    password?: string,
    token?: string,
    gitHubid?: string,
    gitHubLogin?: string,
    gitHubEmail?: string,
    gitHubReposUrl?: string, 
    gitHubToken?: string
}
