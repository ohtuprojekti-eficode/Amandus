import { closePool } from '../db/connect'
import User from '../model/user'
import { UserType } from '../types/user'

describe('getUser query return right user data', () => {
  beforeEach(async () => {
    await User.deleteAll()
  })
  it('user with single service query works', async () => {
    const user = await User.registerUser({
      username: 'pentti',
      email: 'rix@rax.com',
      password: 'salainen',
    })

    await User.addServiceUser({
      user_id: user.id,
      services_id: 1,
      username: 'githubUser',
      email: 'githubemail@first.com',
      reposurl: 'repourli.com',
    })

    const expectedObject: UserType = {
      id: user.id,
      username: 'pentti',
      user_role: 'non-admin',
      email: 'rix@rax.com',
      services: [
        {
          serviceName: 'github',
          email: 'githubemail@first.com',
          reposurl: 'repourli.com',
          username: 'githubUser',
        },
      ],
    }

    const useri = await User.getUserById(user.id)
    expect(useri).toEqual(expectedObject)
  })

  it('user with two services query works', async () => {
    const user = await User.registerUser({
      username: 'pentti',
      email: 'rix@rax.com',
      password: 'salainen',
    })

    await User.addServiceUser({
      user_id: user.id,
      services_id: 1,
      username: 'githubUser',
      email: 'githubemail@first.com',
      reposurl: 'repourli.com',
    })

    await User.addServiceUser({
      user_id: user.id,
      services_id: 2,
      username: 'bitbucketUser',
      email: 'bitbucketUser@email.com',
      reposurl: 'repo2.com',
    })

    const expectedObject: UserType = {
      id: user.id,
      username: 'pentti',
      user_role: 'non-admin',
      email: 'rix@rax.com',
      services: [
        {
          serviceName: 'github',
          email: 'githubemail@first.com',
          reposurl: 'repourli.com',
          username: 'githubUser',
        },
        {
          serviceName: 'bitbucket',
          email: 'bitbucketUser@email.com',
          username: 'bitbucketUser',
          reposurl: 'repo2.com',
        },
      ],
    }

    const useri = await User.getUserById(user.id)
    expect(useri).toEqual(expectedObject)
  })
})

describe('deleting user works', () => {
  beforeEach(async () => {
    await User.deleteAll()
  })
  it('user is deleted from db', async () => {
    const user = await User.registerUser({
      username: 'pentti',
      email: 'rix@rax.com',
      password: 'salainen',
    })

    await User.deleteUser(user.username)
    

    const useri = await User.getUserById(user.id)
    expect(useri).toEqual(null)
  })
})

afterAll(async () => {
  await closePool()
})
