import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

interface Error {
  title: string
  message: string
}

interface Props {
  open: boolean
  handleClose: () => void,
  handleSubmit: (message: string) => void
  handleResetAll: () => void
  error: Error | undefined
}


const PullDialog = ({
  open,
  handleClose,
  handleSubmit,
  handleResetAll,
  error
}: Props) => {

  const [commitMessage, setCommitMessage] = useState('')

  const handleExit = () => {
    setCommitMessage('')
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onExit={handleExit}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Commit changes to resolve conflict
      </DialogTitle>
      {error &&
        <Alert severity="error">
          <AlertTitle>{error.title}</AlertTitle>
          {error.message}
        </Alert>}
      <DialogContent>
        <TextField
          margin="normal"
          label="Commit message"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={commitMessage}
          onChange={(event) => setCommitMessage(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          style={{ backgroundColor: "red" }}
          variant="contained"
          onClick={handleResetAll}
        >
          Discard Local Changes
        </Button>
        <Button
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit(commitMessage)}
        >
          Commit and Pull
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PullDialog