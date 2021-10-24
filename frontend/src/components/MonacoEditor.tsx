import { useMutation } from '@apollo/client'
import { Button, createStyles, makeStyles, useTheme } from '@material-ui/core'
// import { GitHub } from '@material-ui/icons'
import Editor from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useRef, useState } from 'react'
import { PULL_REPO, SAVE_CHANGES } from '../graphql/mutations'
import { REPO_STATE } from '../graphql/queries'
import useUser from '../hooks/useUser'
import SaveDialog from './SaveDialog'
import ServiceConnected from './ServiceConnected'

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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [waitingToSave, setWaitingToSave] = useState(false)

  const [dialogError, setDialogError] = useState<DialogError | undefined>(
    undefined
  )

  const classes = stylesInUse()

  const { user, loading: userQueryLoading, error: userQueryError } = useUser()

  const [saveChanges, { loading: mutationSaveLoading }] = useMutation(
    SAVE_CHANGES,
    {
      refetchQueries: [
        {
          query: REPO_STATE,
          variables: { repoUrl: cloneUrl },
        },
      ],
    }
  )

  const [pullRepo, { loading: pullLoading }] = useMutation(PULL_REPO, {
    refetchQueries: [
      {
        query: REPO_STATE,
        variables: { repoUrl: cloneUrl },
      },
    ],
  })

  const theme = useTheme()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
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
        setDialogOpen(false)
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

  const handleSaveButton = () => {
    setDialogOpen(true)
  }

  const handlePull = async () => {
    try {
      await pullRepo({ variables: { repoUrl: cloneUrl } })
    } catch (error) {
      console.error('error pulling')
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
            disabled={
              pullLoading ||
              userQueryLoading ||
              !!userQueryError ||
              mutationSaveLoading ||
              !user?.me
            }
          >
            Pull
          </Button>
          <Button
            color="primary"
            variant="contained"
            disabled={
              pullLoading ||
              userQueryLoading ||
              !!userQueryError ||
              mutationSaveLoading ||
              !user?.me
            }
            onClick={handleSaveButton}
          >
            Save
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

export default MonacoEditor
