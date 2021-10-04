import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  createStyles,
  makeStyles,
  Tooltip,
  useTheme,
} from '@material-ui/core'
import { GitHub } from '@material-ui/icons'
import { DiffEditor, loader, Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useEffect, useRef, useState } from 'react'
import { SAVE_CHANGES, SAVE_MERGE } from '../../graphql/mutations'
import { IS_GH_CONNECTED, ME, REPO_STATE } from '../../graphql/queries'
import VsCodeDarkTheme from '../../styles/editor-themes/vs-dark-plus-theme'
import VsCodeLightTheme from '../../styles/editor-themes/vs-light-plus-theme'
import {
  IsGithubConnectedResult,
  MeQueryResult,
  RepoStateQueryResult,
} from '../../types'
import { initMonaco } from '../../utils/monacoInitializer'
import { SimpleLanguageInfoProvider } from '../../utils/providers'
import AuthenticateDialog from '../AuthenticateDialog'
import SaveDialog from '../SaveDialog'
import useMergeCodeLens from './useMergeCodeLens'

interface Props {
  original: string
  modified: string
  filename: string | undefined
  commitMessage: string | undefined
  setMergeConflictState: (active: boolean) => void
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

const MonacoDiffEditor = ({
  setMergeConflictState,
  original,
  modified,
  filename,
  commitMessage,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [waitingToSave, setWaitingToSave] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const providerRef = useRef<SimpleLanguageInfoProvider>()
  const branchState = useQuery<RepoStateQueryResult>(REPO_STATE)
  const { data: GHConnectedQuery } =
    useQuery<IsGithubConnectedResult>(IS_GH_CONNECTED)
  const currentBranch = branchState.data?.repoState.currentBranch || ''
  const [dialogError, setDialogError] = useState<DialogError | undefined>(
    undefined
  )

  const { setupCodeLens, modifiedContent } = useMergeCodeLens(original)

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

  const [saveMergeEdit] = useMutation(SAVE_MERGE, {
    refetchQueries: [{ query: REPO_STATE }],
  })

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
              content: editorRef.current.getModifiedEditor().getValue(),
            },
            branch: branchName,
            commitMessage: newCommitMessage,
          },
        })
        setDialogOpen(false)
        setDialogError(undefined)
      } catch (error) {
        // @ts-ignore
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

  const handleMerge = async () => {
    if (editorRef.current) {
      try {
        await saveMergeEdit({
          variables: {
            file: {
              name: filename,
              content: editorRef.current.getModifiedEditor().getValue(),
            },
            commitMessage: 'merge test',
          },
        })

        setMergeConflictState(false)
      } catch (error) {
        // @ts-ignore
        console.log(error.message)
      }
    }
  }

  useEffect(() => {
    loader.init().then((monaco: Monaco) => {
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
          <Button color="primary" variant="contained" onClick={handleMerge}>
            Merge
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
