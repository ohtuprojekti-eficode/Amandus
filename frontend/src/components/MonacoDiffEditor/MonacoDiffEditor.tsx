import { useMutation } from '@apollo/client'
import { Button, createStyles, makeStyles, useTheme } from '@material-ui/core'
import { DiffEditor, Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useRef, useState } from 'react'
import { SAVE_MERGE } from '../../graphql/mutations'
import { REPO_STATE } from '../../graphql/queries'
import useUser from '../../hooks/useUser'
import MergeDialog from '../MergeDialog'
import ServiceConnected from '../ServiceConnected'
import useMergeCodeLens from './useMergeCodeLens'
import useMergeConflictDetector from './useMergeConflictDetector'

interface Props {
  original: string
  filename: string
  commitMessage: string
  cloneUrl: string
  currentBranch: string
  currentService: string
  updateTheme: () => void
}

interface DialogError {
  title: string
  message: string
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
    commitMessage: {
      marginTop: 5,
    },
    title: {
      height: '1rem',
      marginLeft: '20px',
      display: 'flex',
      alignItems: 'center',
    },
  })
)

const MonacoDiffEditor = ({
  original,
  filename,
  commitMessage,
  cloneUrl,
  currentBranch,
  currentService,
  updateTheme,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [waitingToMerge, setWaitingToMerge] = useState(false)

  const [dialogError, setDialogError] = useState<DialogError | undefined>(
    undefined
  )

  const { setupCodeLens, modifiedContent, cleanup } = useMergeCodeLens(original)

  const mergeConflictExists = useMergeConflictDetector(modifiedContent)

  const classes = stylesInUse()

  const { user, loading: userQueryLoading, error: userQueryError } = useUser()

  const [saveMergeEdit, { loading: mutationMergeLoading }] = useMutation(
    SAVE_MERGE,
    {
      onCompleted: cleanup,
      refetchQueries: [
        {
          query: REPO_STATE,
          variables: { repoUrl: cloneUrl },
        },
      ],
    }
  )

  const theme = useTheme()

  const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null)

  const handleEditorDidMount = (
    editor: editor.IStandaloneDiffEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor

    setupCodeLens(editor, monaco)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleDialogSubmit = async (newCommitMessage: string) => {
    if (editorRef.current) {
      try {
        setWaitingToMerge(true)
        await saveMergeEdit({
          variables: {
            file: {
              name: filename,
              content: editorRef.current.getModifiedEditor().getValue(),
            },
            commitMessage: newCommitMessage,
          },
        })
        setDialogOpen(false)
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
  }

  const handleSaveButton = () => {
    setDialogOpen(true)
  }

  const options: editor.IDiffEditorConstructionOptions = {
    // renderSideBySide: false,
  }

  return (
    <div>
      <h2 className={classes.title}>
        {filename?.substring(filename.lastIndexOf('/') + 1)}
      </h2>
      <DiffEditor
        height="78vh"
        language="robot"
        original={original}
        modified={modifiedContent}
        theme={theme.palette.type === 'dark' ? 'vs-dark' : 'vs-light'}
        onMount={handleEditorDidMount}
        options={options}
      />
      {
        // Updating the theme here so we override things set by <Editor>
        updateTheme()
      }
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
            disabled={
              userQueryLoading ||
              !!userQueryError ||
              mutationMergeLoading ||
              !user?.me ||
              mergeConflictExists
            }
            onClick={handleSaveButton}
          >
            Merge
          </Button>
          <ServiceConnected service={currentService} />
        </div>
        <div className={classes.commitMessage}>
          {user?.me && commitMessage && `Latest commit: ${commitMessage}`}
        </div>
      </div>
    </div>
  )
}

export default MonacoDiffEditor
