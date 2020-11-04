import { Pool } from 'pg'
import config from '../utils/config'

export const connect = () => {
  return new Pool({
    user: config.POSTGRES_USER,
    host: config.POSTGRES_HOST,
    database: config.POSTGRES_DB,
    password: config.POSTGRES_PASSWORD,
    port: config.POSTGRES_PORT,
  })
}
