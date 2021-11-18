import { File } from './file'
import { StatusResult } from './gitTypes'

export interface RepoState {
  currentBranch: string
  files: File[]
  branches: string[]
  url: string
  commitMessage: string
  service: string
  gitStatus: StatusResult
}
