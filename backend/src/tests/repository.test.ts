/* eslint-disable @typescript-eslint/unbound-method */

import { gql } from 'apollo-server'
import { ApolloServer } from 'apollo-server-express'
import { createTestClient } from 'apollo-server-testing'
import { appendFileSync, mkdirSync, rmdirSync } from 'fs'
import { join } from 'path'
import simpleGit from 'simple-git'
import schema from '../schema/schema'

const GET_BRANCHES = gql`
  query branches($url: String!) {
    getRepoBranches(url: $url)
  }
`

describe('Getbranches query', () => {
  const repoPath = join('.', 'repositories', 'testRepo')

  beforeEach(async () => {
    mkdirSync(repoPath, { recursive: true })
    await simpleGit(repoPath).init()
  })

  afterEach(() => {
    rmdirSync(repoPath, { recursive: true })
  })

  it('return empty list if no branches', async () => {
    const server = new ApolloServer({
      schema,
    })

    const { query } = createTestClient(server)

    const res = await query({
      query: GET_BRANCHES,
      variables: {
        url: 'http://www.remote.org/testRepo',
      },
    })

    expect(res.data.getRepoBranches).toEqual([])
  })

  it('returns [master, secondbranch]', async () => {
    const server = new ApolloServer({
      schema,
    })

    appendFileSync(
      `${repoPath}/file.txt`,
      'Commit and add file to create master branch'
    )

    const testRepo = simpleGit(repoPath)
    await testRepo.add('.').commit('init commit').branch(['secondBranch'])

    const { query } = createTestClient(server)

    const res = await query({
      query: GET_BRANCHES,
      variables: {
        url: 'http://www.remote.org/testRepo',
      },
    })

    expect(res.data.getRepoBranches).toEqual(['master', 'secondBranch'])
  })
})
