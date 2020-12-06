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

export interface MeQueryResult {
  me: UserType
}

export interface RepoStateQueryResult {
  repoState: {
    currentBranch: string
    files: File[]
    branches: string[]
    url: string
  }
}

export interface AuthorizeWithGHMutationResult {
  authorizeWithGithub: {
    serviceUser: ServiceUserType & { __typename: string }
    token: string
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
  email: string
  services?: ServiceUserType[]
}
