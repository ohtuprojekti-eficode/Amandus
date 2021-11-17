import { Button, createStyles, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import useSaveDialog from '../../hooks/useSaveDialog'
import LatestCommit from './LatestCommit'
import useDiffEditor from './MonacoDiffEditor/useDiffEditor'
import MergeDialog from './saveDialogs/MergeDialog'
import ServiceConnected from './ServiceConnected'

interface Props {
  cloneUrl: string
  currentBranch: string
  original: string
  currentService: string
  commitMessage: string
}

const ConflictedEditorBottomBar = ({
  commitMessage,
  currentBranch,
  currentService,
  cloneUrl,
  original,
}: Props) => {
  const {
    dialogOpen,
    dialogError,
    handleDialogClose,
    setDialogError,
    handleDialogOpen,
  } = useSaveDialog()

  const [waitingToMerge, setWaitingToMerge] = useState(false)

  const classes = stylesInUse()

  const { mergeConflictExists, saveMergeEdit, mutationMergeLoading } =
    useDiffEditor(original, cloneUrl)

  const handleDialogSubmit = async (newCommitMessage: string) => {
    try {
      setWaitingToMerge(true)
      await saveMergeEdit({
        variables: {
          files: [],
          commitMessage: newCommitMessage,
        },
      })
      handleDialogClose()
      setDialogError(undefined)
    } catch (error) {
      const dialogError = {
        title: `An error occurred while merging`,
        message: '',
      }

      if (error instanceof Error) {
        dialogError.message = `More info: ${error.message}`
      }

      setDialogError(dialogError)
    } finally {
      setWaitingToMerge(false)
    }
  }

  return (
    <>
      <MergeDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleSubmit={handleDialogSubmit}
        currentBranch={currentBranch}
        error={dialogError}
        waitingToMerge={waitingToMerge}
      />

      <div className={classes.saveGroup}>
        <div className={classes.buttonAndStatus}>
          <Button
            color="primary"
            variant="contained"
            disabled={mutationMergeLoading || mergeConflictExists}
            onClick={handleDialogOpen}
          >
            Merge
          </Button>
          <ServiceConnected service={currentService} />
        </div>
        <LatestCommit commitMessage={commitMessage} />
      </div>
    </>
  )
}

const stylesInUse = makeStyles(() =>
  createStyles({
    saveGroup: {
      margin: '10px 20px',
    },
    buttonAndStatus: {
      display: 'flex',
      alignItems: 'center',
    },
  })
)

export default ConflictedEditorBottomBar
