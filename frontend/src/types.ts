export interface File {
  name: string
  content: string
}

export interface FileListQueryResult {
  files: File[]
}

export interface RepoStateQueryResult {
  repoState: {
    currentBranch: string
    files: File[]
    branches: string[]
  }
}

export interface Error {
  message: string
}

export interface UserType {
  id?: string
  emails: string[]
  username: string
  password?: string
  token?: string
  gitHubid?: string
  gitHubLogin?: string
  gitHubEmail?: string
  gitHubReposUrl?: string
  gitHubToken?: string
}
