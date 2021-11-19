import simpleGit from 'simple-git'
import { mkdirSync, rmdirSync, appendFileSync } from 'fs'
import { join } from 'path'
import { cloneRepository, getLocalBranches } from '../services/git'
import user from '../model/user'
import { UserType } from '../types/user'
import { closePool } from '../db/connect'
import service from '../model/service'

import tokenService from '../services/token'

describe('Get branches', () => {
  const repoPath = join(__dirname, 'testRepo')

  beforeEach(() => {
    mkdirSync(repoPath)
  })

  afterEach(() => {
    rmdirSync(repoPath, { recursive: true })
  })

  it('returns empty list if no branches on repo', async () => {
    const testRepo = simpleGit(repoPath)
    await testRepo.init()

    const branches = await getLocalBranches(repoPath)
    expect(branches).toEqual([])
  })

  it('returns added local branches', async () => {
    appendFileSync(
      `${repoPath}/file.txt`,
      'Commit and add file to create master branch'
    )

    const testRepo = simpleGit(repoPath)
    await testRepo
      .init()
      .addConfig('user.name', 'Some One')
      .addConfig('user.email', 'some@one.com')
      .add('.')
      .commit('init commit')
      .branch(['secondBranch'])

    const branches = await getLocalBranches(repoPath)
    expect(branches).toEqual(['master', 'secondBranch'])
  })
})

describe('cloneRepository', () => {
  let testUser: UserType
  beforeEach(async () => {
    await user.deleteAll()
    testUser = await user.registerUser({
      username: 'testuser',
      password: 'mypAssword?45',
      email: 'test@test.fi',
    })
  })

  it('throws error if url is invalid', async () => {
    try {
      expect(await cloneRepository('https://sheetbucket.org/elvis/bbtestrepo1', testUser)).toThrow()
    } catch (e) {
      expect((e as Error).message).toContain('service')
    }
  })

  it('throws error if token does not exist', async () => {
    try {
      expect(await cloneRepository('https://bitbucket.org/elvis/bbtestrepo1', testUser)).toThrow()
    } catch (e) {
      expect((e as Error).message).toContain('token')
    }
  })

  it('calls cloneRepositoryToSpecificFolder the right way (bitbucket)', async () => {
    await user.addServiceUser({
      user_id: testUser.id,
      services_id: (await service.getServiceByName('bitbucket')).id,
      username: 'bloblob',
      email: 'bloblob@bloblob.blob',
      reposurl: 'reposurls.com/repositories',
    })

    tokenService.setToken(testUser.id, 'bitbucket', { access_token: 'bliblob' })
    testUser = await user.getUserById(testUser.id) || testUser
    const cloneRepositoryToSpecificFolderMock = jest.fn()
    await cloneRepository(
      'https://bitbucket.org/elvis/bbtestrepo1',
      testUser,
      cloneRepositoryToSpecificFolderMock
    )

    expect(cloneRepositoryToSpecificFolderMock).toHaveBeenCalledWith(
      'https://bloblob:bliblob@bitbucket.org/elvis/bbtestrepo1',
      './testRepositories/testuser/bitbucket/elvis/bbtestrepo1'
    )
  })

  it('calls cloneRepositoryToSpecificFolder the right way (github)', async () => {
    await user.addServiceUser({
      user_id: testUser.id,
      services_id: (await service.getServiceByName('github')).id,
      username: 'bloblob',
      email: 'bloblob@bloblob.blob',
      reposurl: 'reposurls.com/repositories',
    })

    tokenService.setToken(testUser.id, 'github', { access_token: 'bliblob' })
    testUser = await user.getUserById(testUser.id) || testUser
    const cloneRepositoryToSpecificFolderMock = jest.fn()

    await cloneRepository(
      'https://github.com/elvis/ghtestrepo1.git',
      testUser,
      cloneRepositoryToSpecificFolderMock
    )

    expect(cloneRepositoryToSpecificFolderMock).toHaveBeenCalledWith(
      'https://bloblob:bliblob@github.com/elvis/ghtestrepo1',
      './testRepositories/testuser/github/elvis/ghtestrepo1'
    )
  })

  it('calls cloneRepositoryToSpecificFolder the right way (gitlab)', async () => {
    await user.addServiceUser({
      user_id: testUser.id,
      services_id: (await service.getServiceByName('gitlab')).id,
      username: 'bloblob',
      email: 'bloblob@bloblob.blob',
      reposurl: 'reposurls.com/repositories',
    })

    tokenService.setToken(testUser.id, 'gitlab', { access_token: 'bliblob' })
    testUser = await user.getUserById(testUser.id) || testUser
    const cloneRepositoryToSpecificFolderMock = jest.fn()

    await cloneRepository(
      'https://gitlab.com/elvis/gltestrepo1.git',
      testUser,
      cloneRepositoryToSpecificFolderMock
    )

    expect(cloneRepositoryToSpecificFolderMock).toHaveBeenCalledWith(
      'https://oauth2:bliblob@gitlab.com/elvis/gltestrepo1',
      './testRepositories/testuser/gitlab/elvis/gltestrepo1'
    )
  })
})

afterAll(async () => {
  await closePool()
})
