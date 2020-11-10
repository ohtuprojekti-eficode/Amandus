import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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
        <Button onClick={() => console.log('Hello Auth Modal')}>
          <div>
            <Link to="/login">Take me to login</Link>
          </div>
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AuthenticateDialog
