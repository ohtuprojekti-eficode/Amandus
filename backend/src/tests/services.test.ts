import { requestBitbucketUser } from "../services/bitbucket"
import { requestGithubUser } from "../services/gitHub"
import { requestGitLabUser } from "../services/gitLab"
import nodeFetchMock from './mocks/fetch'

describe('Bitbucket API', () => {
  it('requestBitbucketUser returns correct access_token, refresh_token, username, reposurl and email from mock', async () => {
    const bitbucketUser = await requestBitbucketUser('123code321', nodeFetchMock)
    expect(bitbucketUser.response.access_token).toBe('immatokenlol')
    expect(bitbucketUser.response.refresh_token).toBe('immarefreshtokenlol')
    expect(bitbucketUser.serviceUser.username).toBe('elvis')
    expect(bitbucketUser.serviceUser.reposurl).toBe('https://api.bitbucket.org/2.0/repositories/elvis')
    expect(bitbucketUser.serviceUser.email).toBe('elvis@detroit.us')
  })
})

describe('Gitlab API', () => {
  it('requestGitlabUser returns correct access_token, refresh_token username and email from mock', async () => {
    const gitlabUser = await requestGitLabUser('123code321', nodeFetchMock)
    expect(gitlabUser.response.access_token).toBe('immatokenlol')
    expect(gitlabUser.response.refresh_token).toBe('immarefreshtokenlol')
    expect(gitlabUser.serviceUser.username).toBe('elvis')
    expect(gitlabUser.serviceUser.email).toBe('elvis@detroit.us')
  })

  it('requestGitlabUser returns correct reposurl', async () => {
    const gitlabUser = await requestGitLabUser('123code321', nodeFetchMock)
    expect(gitlabUser.serviceUser.reposurl).toBe('https://gitlab.com/api/v4/projects?simple=true&min_access_level=30')  
  })
})

describe('Github API', () => {
  it('requestGithubUser returns correct access_token, username, reposurl and email from mock', async () => {
    const githubUser = await requestGithubUser('123code321', nodeFetchMock)
    expect(githubUser.response.access_token).toBe('immatokenlol')
    expect(githubUser.serviceUser.username).toBe('elvis')
    expect(githubUser.serviceUser.email).toBe('elvis@detroit.us')
    expect(githubUser.serviceUser.reposurl).toBe('https://api.github.com/user/repos')
  })
})
