import {
  Button,
  CircularProgress,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core'
// import { GitHub } from '@material-ui/icons'
import Editor from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useRef, useState } from 'react'
import useAutoSave from '../../../hooks/useAutoSave'
import useSaveDialog from '../../../hooks/useSaveDialog'
import LatestCommit from '../LatestCommit'
import PullDialog from '../saveDialogs/PullDialog'
import SaveDialog from '../saveDialogs/SaveDialog'
import ServiceConnected from '../ServiceConnected'
import useEditor from './useMonacoEditor'

interface Props {
  content: string
  filename: string
  commitMessage: string
  onMergeError: () => void
  cloneUrl: string
  currentService: string
  currentBranch: string
  updateTheme: () => void
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
    title: {
      height: '1rem',
      marginLeft: '20px',
      display: 'flex',
      alignItems: 'center',
    },
  })
)

const MonacoEditor = ({
  onMergeError,
  content,
  filename,
  commitMessage,
  cloneUrl,
  currentBranch,
  currentService,
  updateTheme,
}: Props) => {
  const [waitingToSave, setWaitingToSave] = useState(false)

  const {
    dialogOpen,
    dialogError,
    handleDialogClose,
    setDialogError,
    handleDialogOpen,
  } = useSaveDialog()

  const pullProps = useSaveDialog()

  const classes = stylesInUse()

  const [onEditorChange, autosaving] = useAutoSave(filename, cloneUrl)

  const {
    saveChanges,
    pullRepo,
    mutationSaveLoading,
    pullLoading,
    commitChanges,
    resetAll
  } = useEditor(cloneUrl)

  const theme = useTheme()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    console.log('mounted')
    editorRef.current = editor
  }

  const handleDialogSubmit = async (
    createNewBranch: boolean,
    newBranch: string,
    newCommitMessage: string
  ) => {
    if (editorRef.current) {
      const branchName = createNewBranch ? newBranch : currentBranch
      try {
        setWaitingToSave(true)
        await saveChanges({
          variables: {
            files: [
              {
                name: filename,
                content: editorRef.current.getValue(),
              },
            ],
            branch: branchName,
            commitMessage: newCommitMessage,
          },
        })
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

  const handleCommit = async (commitMessage: string) => {
    await commitChanges({
      variables: {
        url: cloneUrl,
        commitMessage: commitMessage,
      },
    })
    await handlePull()
    pullProps.handleDialogClose()
  }

  const handleReset = async () => {
    await resetAll({
      variables: {
        url: cloneUrl
      },
    })
  }

  return (
    <div>
      <h2 className={classes.title}>
        {filename?.substring(filename.lastIndexOf('/') + 1)}
      </h2>
      <Editor
        height="78vh"
        language="robot"
        theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
        value={content}
        onMount={handleEditorDidMount}
        onChange={onEditorChange}
      />
      {
        // Updating the theme here so we override things set by <Editor>
        updateTheme()
      }
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
        handleSubmit={handleCommit}
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
          <Button
            style={{ marginLeft: 25 }}
            color="primary"
            variant="outlined"
            size="small"
            disabled={pullLoading || mutationSaveLoading}
            onClick={handleReset}
          >
            Discrad Changes
          </Button>
        </div>
        <LatestCommit commitMessage={commitMessage} />
        {autosaving && (
          <div>
            <CircularProgress size={10} />
            <span> Saving...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MonacoEditor
