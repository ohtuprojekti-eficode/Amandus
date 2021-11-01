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
import useSaveDialog from '../../../hooks/useSaveDialog'
import LatestCommit from '../LatestCommit'
import SaveDialog from '../SaveDialog'
import ServiceConnected from '../ServiceConnected'
import useEditor from './useMonacoEditor'
import useAutoSave from '../../../hooks/useAutoSave'

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

  const classes = stylesInUse()

  const [onEditorChange, autosaving] = useAutoSave(content, filename, cloneUrl)

  const { saveChanges, pullRepo, mutationSaveLoading, pullLoading } =
    useEditor(cloneUrl)

  const theme = useTheme()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
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
            file: {
              name: filename,
              content: editorRef.current.getValue(),
            },
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
      if (error instanceof Error) {
        console.error('error pulling', error.message)
      }
    }
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
