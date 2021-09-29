import React, { useEffect, useRef, useState } from 'react'
import { monaco, DiffEditor } from '@monaco-editor/react'
import { useMutation, useQuery } from '@apollo/client'
import { IS_GH_CONNECTED, ME, REPO_STATE } from '../graphql/queries'
import { SAVE_CHANGES } from '../graphql/mutations'
import {
  Button,
  createStyles,
  makeStyles,
  Tooltip,
  useTheme,
} from '@material-ui/core'
import { GitHub } from '@material-ui/icons'
import SaveDialog from './SaveDialog'
import AuthenticateDialog from './AuthenticateDialog'
import {
  IsGithubConnectedResult,
  MeQueryResult,
  RepoStateQueryResult,
} from '../types'
import { initMonaco } from '../utils/monacoInitializer'
import { SimpleLanguageInfoProvider } from '../utils/providers'
import VsCodeDarkTheme from '../styles/editor-themes/vs-dark-plus-theme'
import VsCodeLightTheme from '../styles/editor-themes/vs-light-plus-theme'

interface Props {
  content: string | undefined
  filename: string | undefined
  commitMessage: string | undefined
  original: string
  modified: string
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
      }}
    >
      {isGithubConnected ? githubConnected() : 'GitHub is not connected'}
    </span>
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

const MonacoDiffEditor = ({ original, modified, filename, commitMessage }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [waitingToSave, setWaitingToSave] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const providerRef = useRef<SimpleLanguageInfoProvider>()
  const branchState = useQuery<RepoStateQueryResult>(REPO_STATE)
  const { data: GHConnectedQuery } = useQuery<IsGithubConnectedResult>(
    IS_GH_CONNECTED
  )
  const currentBranch = branchState.data?.repoState.currentBranch || ''
  const [dialogError, setDialogError] = useState<DialogError | undefined>(
    undefined
  )

  const classes = stylesInUse()

  const {
    loading: userQueryLoading,
    error: userQueryError,
    data: user,
  } = useQuery<MeQueryResult>(ME)

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
        setWaitingToSave(true)
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
      } finally {
        setWaitingToSave(false)
      }
    }
  }

  const handleSaveButton = () => {
    setDialogOpen(true)
  }

  useEffect(() => {
    monaco.init().then((monaco) => {
      providerRef.current = initMonaco(monaco, theme.palette.type)
      setEditorReady(true)
    })
    // Need to have an empty dependency array for this to work correctly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateTheme = () => {
    if (editorReady && providerRef.current) {
      const editorTheme =
        theme.palette.type === 'dark' ? VsCodeDarkTheme : VsCodeLightTheme
      providerRef.current.changeTheme(editorTheme)
      providerRef.current.injectCSS()
    }
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
        modified={modified}
        theme={theme.palette.type}
        editorDidMount={handleEditorDidMount}
      />
      {
        // Updating the theme here so we override things set by <Editor>
        updateTheme()
      }
      <AuthenticateDialog open={!user || !user.me} />
      <SaveDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleSubmit={handleDialogSubmit}
        currentBranch={currentBranch}
        error={dialogError}
        waitingToSave={waitingToSave}
      />

      <div className={classes.saveGroup}>
        <div className={classes.buttonAndStatus}>
          <Button
            color="primary"
            variant="contained"
            disabled={
              userQueryLoading ||
              !!userQueryError ||
              mutationSaveLoading ||
              !user?.me ||
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
        <div className={classes.commitMessage}>
          {user?.me && commitMessage && `Latest commit: ${commitMessage}`}
        </div>
      </div>
    </div>
  )
}

export default MonacoDiffEditor
