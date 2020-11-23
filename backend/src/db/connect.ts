import { Pool } from 'pg'
import config from '../utils/config'

export const pool = new Pool({
  connectionString: config.DATABASE_URL,
})

export const closePool = async (): Promise<void> => {
  await pool.end()
}
