import React from 'react'
import GitHubIcon from '@material-ui/icons/GitHub'
import Button from '@material-ui/core/Button'
import { useQuery } from '@apollo/client'
import { GITHUB_LOGIN_URL, ME } from '../../graphql/queries'

const GitHubAuthBtn = () => {
  const loginUrl = useQuery(GITHUB_LOGIN_URL)

  // example on how to get current user data
  const me = useQuery(ME)
  console.log('me', me.data)

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
        startIcon={<GitHubIcon />}
        onClick={btnClickHandler}
      >
        Connect GitHub
      </Button>
    </div>
  )
}

export default GitHubAuthBtn
