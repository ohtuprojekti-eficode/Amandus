import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3002

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

const GITLAB_CLIENT_ID = process.env.GL_CLIENT_ID
const GITLAB_CLIENT_SECRET = process.env.GL_CLIENT_SECRET
const GITLAB_CB_URL = process.env.GL_CB_URL || 'http://localhost:3000/auth/gitlab/callback'

const BITBUCKET_CLIENT_ID = process.env.BB_CLIENT_ID
const BITBUCKET_CLIENT_SECRET = process.env.BB_CLIENT_SECRET
const BITBUCKET_CB_URL = process.env.BB_CB_URL || 'http://localhost:3000/auth/bitbucket/callback'

export default {
  PORT,
  JWT_SECRET,
  GITLAB_CLIENT_ID,
  GITLAB_CLIENT_SECRET,
  GITLAB_CB_URL,
  BITBUCKET_CLIENT_ID,
  BITBUCKET_CLIENT_SECRET,
  BITBUCKET_CB_URL
}