import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Container, Grid } from '@material-ui/core/'
import GitHubAuthBtn from './auth/GitHubAuthBtn'
import GitLabAuthBtn from './auth/GitLabAuthBtn'
import BitbucketAuthBtn from './auth/BitbucketAuthBtn'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    gridWrapper: {
      display: 'flex',
      alignItems: 'center',
    }
  })
)

const Connections = () => {
  const classes = useStyles()

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
          <GitHubAuthBtn />
        </Grid>
        <Grid item>
          <GitLabAuthBtn />
        </Grid>
        <Grid item>
          <BitbucketAuthBtn />
        </Grid>
      </Grid>
    </Container>
  )
}

export default Connections
