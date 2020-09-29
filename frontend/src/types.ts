export interface RepoFile {
  filename: string
  content: string
}

export interface Error {
  message: string
}

export interface FilesState {
  fetching: boolean
  error: boolean
  fileList: RepoFile[]
}

export interface RootState {
  files: FilesState
}
