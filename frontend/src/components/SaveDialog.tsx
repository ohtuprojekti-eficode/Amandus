import React, { useState } from 'react'
import {
  Button,
  CircularProgress,
  Collapse,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'
import { Alert, AlertTitle } from '@material-ui/lab'

interface Error {
  title: string
  message: string
}

interface Props {
  open: boolean
  handleClose: () => void
  handleSubmit: (newBranch: boolean, name: string, message: string) => void
  error: Error | undefined
  currentBranch: string
  waitingToSave: boolean
  onResolve: () => void
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

const SaveDialog = ({
  open,
  handleClose,
  handleSubmit,
  currentBranch,
  error,
  waitingToSave,
  onResolve,
}: Props) => {
  const [createNewBranch, setCreateNewBranch] = useState(false)
  const [branchName, setBranchName] = useState('')
  const [commitMessage, setCommitMessage] = useState('')
  const [showBranchSelector, setShowBranchSelector] = useState(false)

  const classes = stylesInUse()

  const handleExit = () => {
    setCreateNewBranch(false)
    setBranchName('')
    setCommitMessage('')
  }

  const BranchSelector = () => {
    return (
      <>
        <DialogContent>
          <Grid container direction="column">
            <Grid item>
              <FormControl component="fieldset">
                <FormLabel component="legend">Select branch</FormLabel>
                <RadioGroup
                  aria-label="branch selection"
                  value={createNewBranch}
                  onChange={(event) =>
                    setCreateNewBranch(event.target.value === 'true')
                  }
                >
                  {
                    <FormControlLabel
                      value={false}
                      control={<Radio color="primary" />}
                      label={`Current: ${currentBranch}`}
                    />
                  }
                  <FormControlLabel
                    value={true}
                    control={<Radio color="primary" />}
                    label="New"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item>
              <Collapse in={createNewBranch}>
                <TextField
                  label="Branch name"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  value={branchName}
                  onChange={(event) => setBranchName(event.target.value)}
                ></TextField>
              </Collapse>
            </Grid>
          </Grid>
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
      </>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onExit={handleExit}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Save changes</DialogTitle>
      {error && (
        <>
          <Alert severity="error">
            <AlertTitle>{error.title}</AlertTitle>
            {error.message}
          </Alert>
          {!showBranchSelector && (
            <>
              <Button
                style={{ margin: 10 }}
                color="secondary"
                variant="contained"
                onClick={onResolve}
              >
                Resolve conflicts
              </Button>
              <Button
                style={{ margin: 10 }}
                color="primary"
                variant="contained"
                onClick={() => setShowBranchSelector(true)}
              >
                Push to a different branch
              </Button>
            </>
          )}
        </>
      )}

      {(!error || showBranchSelector) && BranchSelector()}
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        {(!error || showBranchSelector) && (
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              handleSubmit(createNewBranch, branchName, commitMessage)
            }
            className={classes.saveButton}
            disabled={waitingToSave}
          >
            {waitingToSave ? (
              <CircularProgress
                className={classes.saveProgress}
                size={'1.53rem'}
              />
            ) : (
              'Save'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default SaveDialog
