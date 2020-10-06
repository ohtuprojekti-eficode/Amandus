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


const users:UserType[] = [
    {
      id: '1',
      username: 'Maurice',
      emails: ['maurice@moss.com'],
      password: 'abcdefg',
      token: '',
      gitHubid: ''
    },
    {
      id: '2',
      username: 'Roy',
      emails: ['roy@trenneman.com'],
      password: 'imroy',
      token: '',
      gitHubid: ''
    }
];

const addUser = (user:UserType):UserType => {
    users.push(user)
    return user
}

const getUsers = ():UserType[] => {
    return users
}

const getUserByGithubId = (id:string):UserType|undefined => {
    return users.find(user => user.gitHubid === id)
}
  
export default {
    getUsers,
    getUserByGithubId,
    addUser,
}