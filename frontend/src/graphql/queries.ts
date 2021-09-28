import { gql } from '@apollo/client'

export const REPO_STATE = gql`
  query {
    repoState: getRepoState(
      url: "https://github.com/Ohtu-project-Eficode/robot-test-files"
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

export const IS_BB_CONNECTED = gql`
  query {
    isBitbucketConnected
  }
`

export const IS_GL_CONNECTED = gql`
  query {
    isGitLabConnected
  }
`

export const CLONE_REPO = gql`
  query {
    cloneRepo: cloneRepository(
      url: "https://github.com/Ohtu-project-Eficode/robot-test-files"
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

export const GITLAB_LOGIN_URL = gql`
  query {
    gitLabLoginUrl
  }
`

export const ME = gql`
  query {
    me {
      username
      user_role
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
