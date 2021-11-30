import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core"


interface Props {
  open: boolean
  handleClose: () => void,
  handleResetAll: () => void
}

const ResetDialog = ({
  open,
  handleClose,
  handleResetAll,
}: Props) => {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        This will reset the repository to latest commit
      </DialogTitle>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleResetAll()}
        >
          Confirm
        </Button>
      </DialogActions>|
    </Dialog>
  )
}

export default ResetDialog