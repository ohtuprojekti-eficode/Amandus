import React from 'react'
import GitHubIcon from '@material-ui/icons/GitHub'
import Button from '@material-ui/core/Button'
import { useQuery } from '@apollo/client'
import { GITHUB_LOGIN_URL } from '../../graphql/queries'
import { GithubLoginURLQueryResult } from '../../types'

interface AuthBtnProps {
  connected: boolean
}

const GitHubAuthBtn = ({ connected }: AuthBtnProps) => {
  const { data, error } = useQuery<GithubLoginURLQueryResult>(GITHUB_LOGIN_URL)

  const btnClickHandler = (): void => {
    window.location.href = data!.githubLoginUrl
  }

  if (error || !data) {
    return <></>
  }

  return (
    <div>
      <Button
        id="githubAuthButton"
        variant="contained"
        color="primary"
        startIcon={<GitHubIcon />}
        onClick={btnClickHandler}
        disabled={connected}
      >
        {connected ? 'Github connected' : 'Connect GitHub'}
      </Button>
    </div>
  )
}

export default GitHubAuthBtn
