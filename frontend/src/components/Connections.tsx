import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Container, Grid } from '@material-ui/core/'
import GitHubAuthBtn from './auth/GitHubAuthBtn'
import GitLabAuthBtn from './auth/GitLabAuthBtn'
import BitbucketAuthBtn from './auth/BitbucketAuthBtn'
import { useQuery } from '@apollo/client'
import {
  IS_BB_CONNECTED,
  IS_GH_CONNECTED,
  IS_GL_CONNECTED,
} from '../graphql/queries'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    gridWrapper: {
      display: 'flex',
      alignItems: 'center',
    },
  })
)

const useConnectionStatuses = () => {
  const { data: ghData } = useQuery(IS_GH_CONNECTED)
  const { data: glData } = useQuery(IS_GL_CONNECTED)
  const { data: bbData } = useQuery(IS_BB_CONNECTED)

  return {
    githubConnected: ghData?.isGithubConnected ?? false,
    gitlabConnected: glData?.isGitLabConnected ?? false,
    bitbucketConnected: bbData?.isBitbucketConnected ?? false,
  }
}

const Connections = () => {
  const classes = useStyles()

  const { githubConnected, gitlabConnected, bitbucketConnected } =
    useConnectionStatuses()

  return (
    <Container className={classes.root}>
      <Grid
        container
        className={classes.gridWrapper}
        direction="column"
        spacing={2}
      >
        <Grid item>
          <h1>Connections</h1>
        </Grid>
        <Grid item>
          <GitHubAuthBtn connected={githubConnected} />
        </Grid>
        <Grid item>
          <GitLabAuthBtn connected={gitlabConnected} />
        </Grid>
        <Grid item>
          <BitbucketAuthBtn connected={bitbucketConnected} />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Connections
