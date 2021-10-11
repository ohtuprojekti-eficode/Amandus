export interface File {
  name: string
  content: string
}

export interface FileListQueryResult {
  files: File[]
}

export interface IsGithubConnectedResult {
  isGithubConnected: boolean
}

export interface GithubLoginURLQueryResult {
  githubLoginUrl: string
}

export interface IsBitbucketConnectedResult {
  isBitbucketConnected: boolean
}

export interface BitbucketLoginURLQueryResult {
  bitbucketLoginUrl: string
}

export interface IsGitLabConnectedResult {
  isGitLabConnected: boolean
}

export interface GitLabLoginURLQueryResult {
  gitLabLoginUrl: string
}

export interface MeQueryResult {
  me: UserType
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface RepoStateQueryResult {
  repoState: {
    currentBranch: string
    files: File[]
    branches: string[]
    url: string
    commitMessage: string
  }
}

export interface AuthorizeWithGHMutationResult {
  authorizeWithGithub: {
    serviceUser: ServiceUserType & { __typename: string }
    tokens: Tokens
  }
}

export interface AuthorizeWithBBMutationResult {
  authorizeWithBitbucket: {
    serviceUser: ServiceUserType & { __typename: string}
    tokens: Tokens
  }
}

export interface AuthorizeWithGLMutationResult {
  authorizeWithGitLab: {
    serviceUser: ServiceUserType & { __typename: string }
    tokens: Tokens
  }
}

export interface FileTree {
  name: string
  path: string
  type: 'folder' | 'file' | 'root'
  children: FileTree[]
}

export interface Error {
  message: string
}

export interface ServiceUserType {
  serviceName: string
  username: string
  email: string | null
  reposurl: string
}

export interface UserType {
  username: string
  user_role: string
  email: string
  services?: ServiceUserType[]
}

export type ServiceName = 'github' | 'bitbucket' | 'gitlab'

export interface Repo {
  id: string
  name: string
  full_name: string
  clone_url: string
  html_url: string
}
