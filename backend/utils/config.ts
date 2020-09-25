import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001
const DB_URI = process.env.DB_URI

export default {
  PORT,
  DB_URI,
}
