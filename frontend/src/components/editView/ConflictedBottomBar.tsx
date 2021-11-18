import { Button, createStyles, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import useSave from '../../hooks/useSave'
import useSaveDialog from '../../hooks/useSaveDialog'
import { useFiles } from './FileProvider'
import LatestCommit from './LatestCommit'
import useDiffEditor from './MonacoDiffEditor/useDiffEditor'
import useMergeConflictDetector from './MonacoDiffEditor/useMergeConflictDetector'
import ResetButtons from './ResetButtons'
import MergeDialog from './saveDialogs/MergeDialog'
import ServiceConnected from './ServiceConnected'

interface Props {
  cloneUrl: string
  currentBranch: string
  original: string
  modified: string
  currentService: string
  commitMessage: string
  filename: string
}

const ConflictedEditorBottomBar = ({
  commitMessage,
  filename,
  currentBranch,
  currentService,
  cloneUrl,
  original,
  modified,
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

  const [save] = useSave()

  const { allSolved, conflictedFiles, solvedConflicts } = useFiles()

  const { saveMergeEdit, mutationMergeLoading } = useDiffEditor(
    original,
    cloneUrl
  )

  const mergeConflictExists = useMergeConflictDetector(modified)

  const handleDialogSubmit = async (newCommitMessage: string) => {
    try {
      setWaitingToMerge(true)
      await saveMergeEdit({
        variables: {
          files: conflictedFiles.map(({ name, content }) => ({
            name,
            content,
          })),
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

  const handleSave = async () => {
    try {
      await save(modified, filename, cloneUrl)
    } catch (e) {
      console.log('error saving:', e)
    }
  }

  const isConflicted = !!conflictedFiles.find((f) => f.name === filename)
  const isSolved = !!solvedConflicts.find((f) => f.name === filename)

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
            disabled={mutationMergeLoading || !allSolved}
            onClick={handleDialogOpen}
          >
            Merge
          </Button>
          {isConflicted && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSave}
              disabled={mergeConflictExists}
            >
              {isSolved ? 'Save changes' : 'Mark solved'}
            </Button>
          )}
          <ServiceConnected service={currentService} />
          <ResetButtons cloneUrl={cloneUrl} filename={filename} />
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
