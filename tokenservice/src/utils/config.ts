import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3002

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

const GITLAB_CLIENT_ID = 'glcid'
const GITLAB_CLIENT_SECRET = 'glcsec'
const GITLAB_CB_URL = 'gl_cb_url'

const BITBUCKET_CLIENT_ID = 'bbcid'
const BITBUCKET_CLIENT_SECRET = 'bbcsec'
const BITBUCKET_CB_URL = 'bb_cb_url'

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