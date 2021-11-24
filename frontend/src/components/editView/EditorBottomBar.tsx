import {
  Button,
  CircularProgress,
  createStyles,
  makeStyles,
} from '@material-ui/core'
import React, { useState } from 'react'
import useSaveDialog from '../../hooks/useSaveDialog'
import { useNotification } from '../NotificationProvider'
import { useFiles } from './FileProvider'
import LatestCommit from './LatestCommit'
import useEditor from './MonacoEditor/useMonacoEditor'
import ResetButtons from './ResetButtons'
import PullDialog from './saveDialogs/PullDialog'
import SaveDialog from './saveDialogs/SaveDialog'
import ServiceConnected from './ServiceConnected'

interface Props {
  cloneUrl: string
  currentBranch: string
  filename: string
  currentService: string
  commitMessage: string
  autosaving: boolean
  onMergeError: () => void
}

const EditorBottomBar = ({
  cloneUrl,
  currentBranch,
  filename,
  onMergeError,
  currentService,
  commitMessage,
  autosaving,
}: Props) => {
  const [waitingToSave, setWaitingToSave] = useState(false)

  const classes = stylesInUse()

  const { notify } = useNotification()

  const { files, selected } = useFiles()

  const pullProps = useSaveDialog()

  const {
    dialogOpen,
    dialogError,
    handleDialogClose,
    setDialogError,
    handleDialogOpen,
  } = useSaveDialog()

  const {
    saveChanges,
    pullRepo,
    mutationSaveLoading,
    pullLoading,
    commitChanges,
    resetAll,
  } = useEditor(cloneUrl)

  const handleDialogSubmit = async (
    createNewBranch: boolean,
    newBranch: string,
    newCommitMessage: string
  ) => {
    const branchName = createNewBranch ? newBranch : currentBranch
    try {
      setWaitingToSave(true)
      await saveChanges({
        variables: {
          files: files // only include selected files
            .filter((f) => selected.includes(f.name))
            .map(({ name, content }) => ({
              name,
              content,
            })),
          branch: branchName,
          commitMessage: newCommitMessage,
        },
      })

      notify('Push succesful')

      handleDialogClose()
      setDialogError(undefined)
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Merge conflict detected'
      ) {
        setDialogError({
          title: `Merge conflict on branch ${branchName}`,
          message:
            'Cannot push to selected branch. Create a new one or resolve the conflicts.',
        })
      }
    } finally {
      setWaitingToSave(false)
    }
  }

  const handlePull = async () => {
    try {
      await pullRepo({ variables: { repoUrl: cloneUrl } })
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes(
          'Please commit your changes or stash them before you merge'
        )
      ) {
        pullProps.setDialogError({
          title: 'Error Pulling',
          message: error.message,
        })
        pullProps.handleDialogOpen()
      }
    }
  }

  const handleCommitAndPull = async (commitMessage: string) => {
    await commitChanges({
      variables: {
        url: cloneUrl,
        commitMessage: commitMessage,
        fileName: filename,
      },
    })
    await handlePull()
    pullProps.handleDialogClose()
  }

  const handleReset = async () => {
    await resetAll({
      variables: {
        url: cloneUrl,
      },
    })
  }

  const handleResetAndPull = async () => {
    await handleReset()
    await handlePull()
    pullProps.handleDialogClose()
  }

  return (
    <>
      <SaveDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleSubmit={handleDialogSubmit}
        onResolve={onMergeError}
        currentBranch={currentBranch}
        error={dialogError}
        waitingToSave={waitingToSave}
      />
      <PullDialog
        open={pullProps.dialogOpen}
        handleClose={pullProps.handleDialogClose}
        handleSubmit={handleCommitAndPull}
        handleResetAll={handleResetAndPull}
        error={pullProps.dialogError}
      />
      <div className={classes.saveGroup}>
        <div className={classes.buttonAndStatus}>
          <Button
            style={{ marginRight: 5 }}
            color="secondary"
            variant="contained"
            onClick={handlePull}
            disabled={pullLoading || mutationSaveLoading}
          >
            Pull
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={pullLoading || mutationSaveLoading}
            onClick={handleDialogOpen}
          >
            Save
          </Button>
          <ServiceConnected service={currentService} />
          <ResetButtons cloneUrl={cloneUrl} filename={filename} />
        </div>
        <LatestCommit commitMessage={commitMessage} />
        {autosaving && (
          <div>
            <CircularProgress size={10} />
            <span> Saving...</span>
          </div>
        )}
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

export default EditorBottomBar
