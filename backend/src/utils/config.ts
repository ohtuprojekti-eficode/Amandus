import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

const GITHUB_CLIENT_ID = process.env.GH_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GH_CLIENT_SECRET
const GITHUB_CB_URL =
  process.env.GH_CB_URL || 'http://localhost:3000/auth/github/callback'

const BITBUCKET_CLIENT_ID = process.env.BB_CLIENT_ID
const BITBUCKET_CLIENT_SECRET = process.env.BB_CLIENT_SECRET
const BITBUCKET_CB_URL = process.env.BB_CB_URL || 'http://localhost:3000/auth/bitbucket/callback'

const DATABASE_URL =
  process.env.NODE_ENV == 'test'
    ? process.env.DATABASE_URL_TEST
    : process.env.DATABASE_URL

export default {
  PORT,
  JWT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CB_URL,
  BITBUCKET_CLIENT_ID,
  BITBUCKET_CLIENT_SECRET,
  BITBUCKET_CB_URL,
  DATABASE_URL,
}
