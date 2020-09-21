export interface File {
  filename: string,
  content: string,
}

export interface Error {
  message: string
}

export const INIT_GET_FILES = 'INIT_GET_FILES'
export const GET_FILES_SUCCESS = 'GET_FILES_SUCCESS'
export const GET_FILES_FAIL = 'GET_FILES_FAIL'

interface InitGetFiles {
  type: typeof INIT_GET_FILES
}

interface GetFilesSuccessAction {
  type: typeof GET_FILES_SUCCESS,
  payload: File[]
}

interface GetFilesFailAction {
  type: typeof GET_FILES_FAIL
}

export type FileActionTypes = InitGetFiles | GetFilesSuccessAction | GetFilesFailAction