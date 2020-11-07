import { UserType, GitHubUserType, LocalUser } from '../types/user'
import { pool } from '../db/connect'
import bcrypt from 'bcryptjs'

// temp user data
const users: UserType[] = [
  {
    id: '1',
    username: 'Maurice',
    emails: ['maurice@moss.com'],
    password: 'abcdefg',
    token: '',
    gitHubId: '123124124',
  },
  {
    id: '2',
    username: 'Roy',
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

interface RegisterProps {
  username: string
  email: string
  password: string
}

const registerUser = async ({
  username,
  email,
  password,
}: RegisterProps): Promise<LocalUser> => {
  const queryText =
    'INSERT INTO USERS(username, email, password) VALUES($1, $2, $3) RETURNING user_id, username, email'
  const cryptedPassword = bcrypt.hashSync(password, 10)
  const queryResult = await pool.query<LocalUser>(queryText, [
    username,
    email,
    cryptedPassword,
  ])
  return queryResult.rows[0]
}

export default {
  getUsers,
  getUserByGithubId,
  addUser,
  findOrCreateUserByGitHubUser,
  registerUser,
}
