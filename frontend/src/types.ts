export interface File {
  name: string
  content: string
}

export interface FileList {
  files: File[]
}

export interface Error {
  message: string
}
