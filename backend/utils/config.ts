import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001
const DB_URI = process.env.DB_URI
const GITHUB_CLIENT_ID = process.env.GH_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GH_CLIENT_SECRET
const GITHUB_CB_URL = '/auth/github/callback'

export default {
  PORT,
  DB_URI,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CB_URL,
}
