import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

const GITHUB_CLIENT_ID = process.env.GH_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GH_CLIENT_SECRET
const GITHUB_CB_URL =
  process.env.GH_CB_URL || 'http://localhost:3000/auth/github/callback'

const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432
const POSTGRES_USER = process.env.POSTGRES_USER
const POSTGRES_HOST = process.env.POSTGRES_HOST
const POSTGRES_DB = process.env.POSTGRES_DB
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

export default {
  PORT,
  JWT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CB_URL,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
}
