// https://github.com/apollographql/apollo-server/issues/1593
import { IncomingMessage } from 'http'

export type Req = { req: IncomingMessage }

export interface AddServiceArgs {
  serviceName: string
  username: string
  email: string
  token: string
  reposurl: string
}
