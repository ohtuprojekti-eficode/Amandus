import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { monaco } from '@monaco-editor/react'
import { useMutation, useQuery } from '@apollo/client'
import { IS_GH_CONNECTED, ME, REPO_STATE } from '../graphql/queries'
import { SAVE_CHANGES } from '../graphql/mutations'
import { Button, Tooltip, useTheme } from '@material-ui/core'
import SaveDialog from './SaveDialog'
import AuthenticateDialog from './AuthenticateDialog'
import { isGithubConnectedResult, RepoStateQueryResult } from '../types'
import { initMonaco } from '../utils/monacoInitializer'
import { GitHub } from '@material-ui/icons'

interface Props {
  content: string | undefined
  filename: string | undefined
  commitMessage: string | undefined
}

interface Getter {
  (): string
}

interface DialogError {
  title: string
  message: string
}

const GHConnected = ({ isGithubConnected }: { isGithubConnected: boolean }) => {
  const githubConnected = () => {
    return (
      <Tooltip title="GitHub is connected. Saving will push to GitHub">
        <GitHub />
      </Tooltip>
    )
  }

  return (
    <span
      style={{
        marginLeft: '1rem',
        verticalAlign: 'middle',
      }}
    >
      {isGithubConnected ? githubConnected() : 'GitHub is not connected'}
    </span>
  )
}

const MonacoEditor = ({ content, filename, commitMessage }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const branchState = useQuery<RepoStateQueryResult>(REPO_STATE)
  const { data: GHConnectedQuery } = useQuery<isGithubConnectedResult>(
    IS_GH_CONNECTED
  )
  const currentBranch = branchState.data?.repoState.currentBranch || ''
  const [dialogError, setDialogError] = useState<DialogError | undefined>(
    undefined
  )

  const {
    loading: userQueryLoading,
    error: userQueryError,
    data: user,
  } = useQuery(ME)

  const [saveChanges, { loading: mutationSaveLoading }] = useMutation(
    SAVE_CHANGES,
    {
      refetchQueries: [{ query: REPO_STATE }],
    }
  )

  const theme = useTheme()

  const valueGetter = useRef<Getter | null>(null)

  const handleEditorDidMount = (_valueGetter: Getter) => {
    valueGetter.current = _valueGetter
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleDialogSubmit = async (
    createNewBranch: boolean,
    newBranch: string,
    newCommitMessage: string
  ) => {
    if (valueGetter.current) {
      const branchName = createNewBranch ? newBranch : currentBranch
      try {
        await saveChanges({
          variables: {
            file: {
              name: filename,
              content: valueGetter.current(),
            },
            branch: branchName,
            commitMessage: newCommitMessage,
          },
        })
        setDialogOpen(false)
        setDialogError(undefined)
      } catch (error) {
        if (error.message === 'Merge conflict detected') {
          setDialogError({
            title: `Merge conflict on branch ${branchName}`,
            message: 'Cannot push to selected branch. Create a new one.',
          })
        }
      }
    }
  }

  const handleSaveButton = () => {
    setDialogOpen(true)
  }

  monaco.init().then(async (monaco) => {
    initMonaco(monaco)
  })

  return (
    <div>
      <h2>{filename?.substring(filename.lastIndexOf('/') + 1)}</h2>
      <Editor
        height="75vh"
        language="robot"
        theme={theme.palette.type}
        value={content}
        editorDidMount={handleEditorDidMount}
      />
      <div>
        <AuthenticateDialog open={!user || !user.me} />

        <SaveDialog
          open={dialogOpen}
          handleClose={handleDialogClose}
          handleSubmit={handleDialogSubmit}
          currentBranch={currentBranch}
          error={dialogError}
        />

        <div>
          <Button
            color="primary"
            variant="contained"
            disabled={
              userQueryLoading ||
              !!userQueryError ||
              mutationSaveLoading ||
              !user.me ||
              branchState.loading
            }
            onClick={handleSaveButton}
          >
            Save
          </Button>
          {GHConnectedQuery && (
            <GHConnected
              isGithubConnected={GHConnectedQuery.isGithubConnected}
            />
          )}
        </div>
      </div>
      <div style={{ fontSize: 14, marginTop: 5, marginBottom: 5 }}>
        {user?.me && commitMessage && `Latest commit: ${commitMessage}`}
      </div>
    </div>
  )
}

export default MonacoEditor
