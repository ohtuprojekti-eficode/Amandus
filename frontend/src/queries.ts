import { gql } from '@apollo/client'

export const ALL_FILES = gql`
  query {
    files: cloneRepository(
      url: "https://github.com/ohtuprojekti-eficode/robot-test-files"
    ) {
      name
      content
    }
  }
`

export const GITHUB_LOGIN_URL = gql`
  query {
    githubLoginurl
  }
`