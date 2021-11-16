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

const GITLAB_CLIENT_ID = process.env.GL_CLIENT_ID
const GITLAB_CLIENT_SECRET = process.env.GL_CLIENT_SECRET
const GITLAB_CB_URL =
  process.env.GL_CB_URL || 'http://localhost:3000/auth/gitlab/callback'

const DATABASE_URL =
  process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'e2etest'
    ? process.env.DATABASE_URL_TEST
    : process.env.DATABASE_URL

const TOKEN_SERVICE_URL = 'http://localhost:3002'

// (() => {
//   if (process.env.NODE_ENV === 'test') {
//     return 'http://localhost:3002'
//   }

//   if (process.env.NODE_ENV === 'e2etest') {
//     return 'http://tokenservice:3002'
//   }

//   return process.env.TOKEN_SERVICE_URL
// })

export default {
  PORT,
  JWT_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CB_URL,
  BITBUCKET_CLIENT_ID,
  BITBUCKET_CLIENT_SECRET,
  BITBUCKET_CB_URL,
  GITLAB_CLIENT_ID,
  GITLAB_CLIENT_SECRET,
  GITLAB_CB_URL,
  DATABASE_URL,
  TOKEN_SERVICE_URL
}
