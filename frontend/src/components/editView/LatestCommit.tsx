import { makeStyles, createStyles } from '@material-ui/styles'
import React from 'react'
import useUser from '../../hooks/useUser'

const stylesInUse = makeStyles(() =>
  createStyles({
    commitMessage: {
      marginTop: 5,
    },
  })
)

const LatestCommit = ({ commitMessage }: { commitMessage: string }) => {
  const { user } = useUser()

  const classes = stylesInUse()
  return (
    <div className={classes.commitMessage}>
      {user?.me && commitMessage && `Latest commit: ${commitMessage}`}
    </div>
  )
}

export default LatestCommit
