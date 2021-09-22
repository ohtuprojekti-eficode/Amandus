import { gql } from '@apollo/client'

export const REPO_STATE = gql`
  query {
    repoState: getRepoState(
      url: "https://github.com/ohtuprojekti-eficode/robot-test-files"
    ) {
      currentBranch
      files {
        name
        content
      }
      branches
      url
      commitMessage
    }
  }
`

export const IS_GH_CONNECTED = gql`
  query {
    isGithubConnected
  }
`

export const CLONE_REPO = gql`
  query {
    cloneRepo: cloneRepository(
      url: "https://github.com/ohtuprojekti-eficode/robot-test-files"
    )
  }
`

export const GITHUB_LOGIN_URL = gql`
  query {
    githubLoginUrl
  }
`

export const BITBUCKET_LOGIN_URL = gql`
  query {
    bitbucketLoginUrl
  }
`

export const ME = gql`
  query {
    me {
      username
      email
      services {
        serviceName
        username
        email
        reposurl
      }
    }
  }
`
