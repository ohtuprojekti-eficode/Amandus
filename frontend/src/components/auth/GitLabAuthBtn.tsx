import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { useQuery } from '@apollo/client'
import { GITLAB_LOGIN_URL } from '../../graphql/queries'
import { GitLabLoginURLQueryResult } from '../../types'

const useStyles = makeStyles({
  imageIcon: {
    display: 'flex',
    width: '1em',
    height: '1em',
  },
})

interface AuthBtnProps {
  connected: boolean
}

const GitLabAuthBtn = ({ connected }: AuthBtnProps) => {
  const { data, error } = useQuery<GitLabLoginURLQueryResult>(GITLAB_LOGIN_URL)
  const classes = useStyles()

  const btnClickHandler = (): void => {
    window.location.href = data!.gitLabLoginUrl
  }

  const gitLabIcon = (
    <img
      className={classes.imageIcon}
      alt="GitLab icon"
      src="/img/gitlab-icon-rgb.svg"
    />
  )

  if (error) return <p>{error.message}</p>
  if (!data) return <p>no data in response</p>

  return (
    <div>
      <Button
        id="gitlabAuthButton"
        startIcon={gitLabIcon}
        variant="contained"
        color="primary"
        onClick={btnClickHandler}
        disabled={connected}
      >
        {connected ? 'Gitlab connected' : 'Connect GitLab'}
      </Button>
    </div>
  )
}

export default GitLabAuthBtn
