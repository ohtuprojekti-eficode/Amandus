export interface File {
  name: string
  content: string
  status: string | null
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

export interface SettingsObject {
  settings: {
    misc: MiscSettingObject[];
    plugins: PluginSettingObject[];
  }
}

export interface MiscSettingObject {
  name: string
  value: number
  unit: string 
  active: boolean
}

export interface PluginSettingObject {
  name: string
  active: boolean
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
    service: string | undefined
    gitStatus: StatusResult
  }
}

export interface StatusResult {
  not_added?: string[]
  conflicted?: string[]
  created?: string[]
  deleted?: string[]
  modified?: string[]
  renamed?: StatusResultRenamed[]
  staged?: string[]
  files?: FileStatusResult[]
  ahead?: number
  behind?: number
  current?: string
  tracking?: string
}

export interface FileStatusResult {
  from?: string
  path: string
  index: string
  working_dir: string
}

export interface StatusResultRenamed {
  from: string
  to: string
}

export interface AuthorizeWithServiceMutationResult {
  authorizeWithService: {
    serviceUser: ServiceUser & { __typename: string }
    tokens: Tokens
  }
}

export interface FileTree {
  name: string
  path: string
  type: 'folder' | 'file' | 'root'
  children: FileTree[]
  status: string | null
}

export interface Error {
  message: string
}

export interface ServiceUser {
  serviceName: ServiceName
  username: string
  email: string | null
  reposurl: string
}

export interface UserType {
  username: string
  user_role: string
  email: string
  services?: ServiceUser[]
}

export type ServiceName = 'github' | 'bitbucket' | 'gitlab'

export interface Repository {
  id: string
  name: string
  full_name: string
  clone_url: string
  html_url: string
}
