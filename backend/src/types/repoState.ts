import { File } from './file'

export interface RepoState {
  currentBranch: string
  files: File[]
  url: string
  localBranches: string[]
}
