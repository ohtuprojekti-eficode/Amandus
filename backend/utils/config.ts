import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001
const DB_URI = process.env.DB_URI
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "Iv1.e8426b3c0727bfb5"
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CB_URL = 'http://localhost:3000/auth/github/callback'

export default {
  PORT,
  DB_URI,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CB_URL
}
