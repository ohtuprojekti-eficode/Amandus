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
      services_id: 1,
      username: 'githubUser2',
      email: 'githubUser2@email.com',
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
          serviceName: 'github',
          email: 'githubUser2@email.com',
          username: 'githubUser2',
          reposurl: 'repo2.com',
        },
      ],
    }

    const useri = await User.getUserById(user.id)
    expect(useri).toEqual(expectedObject)
  })
})

afterAll(async () => {
  await closePool()
})
