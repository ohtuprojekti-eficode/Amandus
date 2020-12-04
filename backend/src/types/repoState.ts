import { File } from './file'

export interface RepoState {
  currentBranch: string
  files: File[]
  branches: string[]
  url: string
  commitMessage: string
}
