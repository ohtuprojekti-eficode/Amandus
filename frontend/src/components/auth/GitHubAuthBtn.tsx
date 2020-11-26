import React from 'react'
import GitHubIcon from '@material-ui/icons/GitHub'
import Button from '@material-ui/core/Button'
import { useQuery } from '@apollo/client'
import { GITHUB_LOGIN_URL } from '../../graphql/queries'

const GitHubAuthBtn = () => {
  const loginUrl = useQuery(GITHUB_LOGIN_URL)

  const btnClickHandler = (): void => {
    window.location.href = `${loginUrl.data.githubLoginUrl}`
  }

  if (loginUrl.error || !loginUrl) {
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
        Connect GitHub
      </Button>
    </div>
  )
}

export default GitHubAuthBtn
