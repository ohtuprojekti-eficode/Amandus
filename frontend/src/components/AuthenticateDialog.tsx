import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
} from '@material-ui/core'

interface Props {
  open: boolean
}

const AuthenticateDialog = ({ open }: Props) => {
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
          <Link component={RouterLink} to="/login">
            Take me to login
          </Link>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AuthenticateDialog
