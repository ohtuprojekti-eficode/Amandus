export interface Service {
  id: number
  name: ServiceName
}

export type ServiceName = 'github' | 'bitbucket' | 'gitlab'

export type ServiceTokenType = `${ServiceName}Token`
