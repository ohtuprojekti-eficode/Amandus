import { File } from './file'
import { ServiceName } from './service'
import { ServiceUserType } from './user'

export interface SaveArgs {
  file: File
  branch: string
  commitMessage: string
  usedService: ServiceName
}

export interface BranchSwitchArgs {
  url: string
  branch: string
}

export interface ServiceUserInput {
  user_id: number
  services_id: number
  username: string
  email: string | null
  reposurl: string
}

export interface RegisterUserInput {
  username: string
  email: string
  password: string
}

export interface LoginUserInput {
  username: string
  password: string
}

export interface AddServiceArgs {
  service: ServiceUserType
}
