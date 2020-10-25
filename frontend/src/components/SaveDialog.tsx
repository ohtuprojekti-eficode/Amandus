import React, { useState } from 'react'
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'

interface Props {
  open: boolean
  handleClose: () => void
  handleSubmit: (newBranch: boolean, name: string, message: string) => void
  currentBranch: string
}

const SaveDialog = ({
  open,
  handleClose,
  handleSubmit,
  currentBranch,
}: Props) => {
  const [createNewBranch, setCreateNewBranch] = useState(false)
  const [branchName, setBranchName] = useState('')
  const [commitMessage, setCommitMessage] = useState('')

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Save changes</DialogTitle>
      <DialogContent>
        <Grid container direction="column">
          <Grid item>
            <FormControl component="fieldset">
              <FormLabel component="legend">Select branch</FormLabel>
              <RadioGroup
                aria-label="branch selection"
                value={createNewBranch}
                onChange={(event) =>
                  setCreateNewBranch(
                    (event.target as HTMLInputElement).value === 'true'
                  )
                }
              >
                <FormControlLabel
                  value={false}
                  control={<Radio color="primary" />}
                  label={`Current: ${currentBranch}`}
                />
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
                onChange={(event) =>
                  setBranchName((event.target as HTMLInputElement).value)
                }
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
          onChange={(event) =>
            setCommitMessage((event.target as HTMLInputElement).value)
          }
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleSubmit(createNewBranch, branchName, commitMessage)
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaveDialog
