import { File } from './file'

export interface SaveArgs {
    file: File,
    branch: string,
    commitMessage: string,
}