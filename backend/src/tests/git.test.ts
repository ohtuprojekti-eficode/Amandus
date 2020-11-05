import simpleGit from 'simple-git'
import { mkdirSync, rmdirSync, appendFileSync } from 'fs'
import { join } from 'path'
import { getBranches } from '../services/git'

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

    const branches = await getBranches(repoPath)
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

    const branches = await getBranches(repoPath)
    expect(branches).toEqual(['master', 'secondBranch'])
  })
})
