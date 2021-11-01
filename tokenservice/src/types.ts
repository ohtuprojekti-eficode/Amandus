export type ServiceName = 'github' | 'bitbucket' | 'gitlab' 

export interface UserJWT {
  id: number
  username: string
  githubToken?: string
  bitbucketToken?: string
  gitlabToken?: string
}

export interface RequestParams {
  amandusToken: string
  serviceName: ServiceName
  serviceToken: string
}