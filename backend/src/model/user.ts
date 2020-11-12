import { 
  UserType, 
  GitHubUserType, 
  RegisterUserInput,
  UserRecord,
} from '../types/user'
import { pool } from '../db/connect'
import bcrypt from 'bcryptjs'

// temp user data
const users: UserType[] = [
  {
    id: '1',
    username: 'Maurice',
    email: 'mau@mau.fi',
    emails: ['maurice@moss.com'],
    password: 'abcdefg',
    token: '',
    gitHubId: '123124124',
  },
  {
    id: '2',
    username: 'Roy',
    email: 'roy@roy.fi',
    emails: ['roy@trenneman.com'],
    password: 'imroy',
    token: '',
    gitHubId: '124214124',
  },
]

const addUser = (user: UserType): UserType => {
  users.push(user)
  return user
}

const getUsers = (): UserType[] => {
  return users
}

const getUserByGithubId = (id: string): UserType | undefined => {
  return users.find((user) => user.gitHubId === id)
}

const findOrCreateUserByGitHubUser = (gitHubUser: GitHubUserType): UserType => {
  const gitHubId = gitHubUser.id?.toString()

  let match = users.find((user) => user.gitHubId === gitHubId)
  if (!match) {
    match = {
      username: gitHubUser.login || '',
      emails: [gitHubUser.email || ''],
      gitHubId: gitHubId,
      gitHubLogin: gitHubUser.login,
      gitHubEmail: gitHubUser.email,
      gitHubReposUrl: gitHubUser.repos_url,
      gitHubToken: gitHubUser.access_token,
    }

    users.push(match)
  }

  return match
}

const registerUser = async ({
  username,
  email,
  password,
}: RegisterUserInput): Promise<UserType|null> => {
  const queryText =
    'INSERT INTO USERS(username, email, password) VALUES($1, $2, $3) RETURNING user_id, username, email'
  const cryptedPassword = bcrypt.hashSync(password, 10)
  const queryResult = await pool.query<UserRecord>(queryText, [
    username,
    email,
    cryptedPassword,
  ])

  if (queryResult.rows.length === 0) {
    return null
  }

  const user = {
    id: queryResult.rows[0].user_id,
    username: queryResult.rows[0].username,
    email: queryResult.rows[0].email,
  }

  return user
}

const findUserByUsername = async (username: string): Promise<UserType|null> => {
  const queryText =
    'SELECT * FROM USERS WHERE username = $1'
  const queryResult = await pool.query<UserRecord>(queryText, [
    username,
  ])
  
  if (queryResult.rows.length === 0) {
    return null
  }

  const user = {
    id: queryResult.rows[0].user_id,
    username: queryResult.rows[0].username,
    email: queryResult.rows[0].email,
    password: queryResult.rows[0].password,
  }

  return user
}

const deleteAll = async (): Promise<void> => {
  const queryText = 'DELETE FROM USERS'
  await pool.query(queryText)
}

export default {
  getUsers,
  getUserByGithubId,
  addUser,
  findOrCreateUserByGitHubUser,
  registerUser,
  findUserByUsername,
  deleteAll,
}
