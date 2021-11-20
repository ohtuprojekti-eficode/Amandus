import {
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  makeStyles,
  TextField,
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'
import React, { useState } from 'react'
import FileSelector from '../../FileSelector'

interface Error {
  title: string
  message: string
}

interface Props {
  open: boolean
  handleClose: () => void
  handleSubmit: (message: string) => void
  error: Error | undefined
  currentBranch: string
  waitingToMerge: boolean
}

const stylesInUse = makeStyles((theme) =>
  createStyles({
    saveButton: {
      width: '4.3rem',
      '&:disabled': {
        backgroundColor: theme.palette.primary.main,
      },
    },
    saveProgress: {
      color: theme.palette.primary.contrastText,
    },
  })
)

const MergeDialog = ({
  open,
  handleClose,
  handleSubmit,
  error,
  waitingToMerge,
}: Props) => {
  const [commitMessage, setCommitMessage] = useState('')

  const classes = stylesInUse()

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
      <DialogTitle id="form-dialog-title">Merge changes</DialogTitle>
      {error && (
        <Alert severity="error">
          <AlertTitle>{error.title}</AlertTitle>
          {error.message}
        </Alert>
      )}
      <DialogContent>
        <FileSelector />
        <Divider />
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
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit(commitMessage)}
          className={classes.saveButton}
          disabled={waitingToMerge}
        >
          {waitingToMerge ? (
            <CircularProgress
              className={classes.saveProgress}
              size={'1.53rem'}
            />
          ) : (
            'Merge'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MergeDialog
