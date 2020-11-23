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

export interface authorizeWithGHMutationResult {
  authorizeWithGithub: {
    serviceUser: ServiceUserType & { __typename: string}
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
  id: number
  username: string
  email: string
  services?: ServiceUserType[]
}
