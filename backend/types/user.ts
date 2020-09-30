export interface LoginArgs {
    email: string,
    password: string
}

export interface UserType {
    id?: string
    emails: string[]
    username: string
    password?: string,
    token?: string,
    githubid?: string
}

const users:UserType[] = [
    {
      id: '1',
      username: 'Maurice',
      emails: ['maurice@moss.com'],
      password: 'abcdefg',
      token: '',
      githubid: ''
    },
    {
      id: '2',
      username: 'Roy',
      emails: ['roy@trenneman.com'],
      password: 'imroy',
      token: '',
      githubid: ''
    }
];

const addUser = (user:UserType):UserType => {
    users.push(user)
    return user
}

const getUsers = ():UserType[] => {
    return users
}

const getUserByGithubId = (id:string):UserType|undefined => {
    return users.find(user => user.githubid === id)
}
  
export default {
    getUsers,
    getUserByGithubId,
    addUser,
}