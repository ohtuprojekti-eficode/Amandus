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
    height: '1em'
  }
})

const GitLabAuthBtn = () => {
  const { data, error } = useQuery<GitLabLoginURLQueryResult>(GITLAB_LOGIN_URL)
  const classes = useStyles()

  const btnClickHandler = (): void => {
    window.location.href = data!.gitLabLoginUrl
  }

  const gitLabIcon = (
    <img 
      className={classes.imageIcon} 
      alt="GitLab icon" 
      src="/img/gitlab-icon-rgb.svg" />
  )

  if (error || !data) {
    return <></>
  }

  return (
    <div>
      <Button
        startIcon={gitLabIcon}
        variant="contained"
        color="primary"
        onClick={btnClickHandler}
      >
        Connect GitLab
      </Button>
    </div>
  )
}

export default GitLabAuthBtn
