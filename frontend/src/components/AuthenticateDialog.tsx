import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
  makeStyles,
} from '@material-ui/core'

interface Props {
  open: boolean
}

const stylesInUse = makeStyles((theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.light,
    },
  })
)

const AuthenticateDialog = ({ open }: Props) => {
  const classes = stylesInUse()

  return (
    <Dialog open={open} aria-labelledby="auth-modal-title">
      <DialogTitle id="form-dialog-title">Please log in!</DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <Grid item>
            <p>You will need to log in in order to use this service.</p>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button>
          <Link component={RouterLink} className={classes.link} to="/login">
            Take me to login
          </Link>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AuthenticateDialog
