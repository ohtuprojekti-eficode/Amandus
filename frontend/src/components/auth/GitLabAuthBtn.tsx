import React from 'react'
import Button from '@material-ui/core/Button'
import GitHubIcon from '@material-ui/icons/GitHub'
import { useQuery } from '@apollo/client'
import { GITLAB_LOGIN_URL } from '../../graphql/queries'
import { GitLabLoginURLQueryResult } from '../../types'

const GitLabAuthBtn = () => {
  const { data, error } = useQuery<GitLabLoginURLQueryResult>(GITLAB_LOGIN_URL)

  const btnClickHandler = (): void => {
    window.location.href = data!.gitLabLoginUrl
  }

  if (error || !data) {
    return <></>
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<GitHubIcon />}
        onClick={btnClickHandler}
      >
        Connect GitLab
      </Button>
    </div>
  )
}

export default GitLabAuthBtn
