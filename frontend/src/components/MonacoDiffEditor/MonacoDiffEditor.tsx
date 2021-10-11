import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core'
import { DiffEditor, loader, Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useEffect, useRef, useState } from 'react'
import { SAVE_MERGE } from '../../graphql/mutations'
import { IS_GH_CONNECTED, IS_GL_CONNECTED, IS_BB_CONNECTED, ME, REPO_STATE } from '../../graphql/queries'
import VsCodeDarkTheme from '../../styles/editor-themes/vs-dark-plus-theme'
import VsCodeLightTheme from '../../styles/editor-themes/vs-light-plus-theme'
import {
  IsGithubConnectedResult,
  IsGitLabConnectedResult,
  IsBitbucketConnectedResult,
  MeQueryResult,
  RepoStateQueryResult,
} from '../../types'
import { initMonaco } from '../../utils/monacoInitializer'
import { SimpleLanguageInfoProvider } from '../../utils/providers'
import MergeDialog from '../MergeDialog'
import useMergeCodeLens from './useMergeCodeLens'
import useMergeConflictDetector from './useMergeConflictDetector'

interface Props {
  original: string
  filename: string | undefined
  commitMessage: string | undefined
  cloneUrl: string | undefined
}

interface DialogError {
  title: string
  message: string
}

const ServiceConnected = ({ service }: { service: string }) => {
  let connected = false
  let serviceCapitalized = ''

  const { data: GHConnectedQuery } = useQuery<IsGithubConnectedResult>(IS_GH_CONNECTED)
  const { data: GLConnectedQuery } = useQuery<IsGitLabConnectedResult>(IS_GL_CONNECTED)
  const { data: BBConnectedQuery } = useQuery<IsBitbucketConnectedResult>(IS_BB_CONNECTED)

  if (service === 'github') {
    connected = GHConnectedQuery ? GHConnectedQuery.isGithubConnected : false
    serviceCapitalized = 'GitHub'
  }

  if (service === 'gitlab') {
    connected = GLConnectedQuery ? GLConnectedQuery.isGitLabConnected : false
    serviceCapitalized = 'GitLab'
  }

  if (service === 'bitbucket') {
    connected = BBConnectedQuery ? BBConnectedQuery.isBitbucketConnected : false
    serviceCapitalized = 'Bitbucket'
  }

  return (
    <span
      style={{
        marginLeft: '1rem',
      }}
    >
      {connected ? `${serviceCapitalized} is connected. Saving will push to ${serviceCapitalized}` : `${serviceCapitalized} is not connected.`}
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

const MonacoDiffEditor = ({ original, filename, commitMessage, cloneUrl }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [waitingToMerge, setWaitingToMerge] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const providerRef = useRef<SimpleLanguageInfoProvider>()
  const branchState = useQuery<RepoStateQueryResult>(
    REPO_STATE,
    {
      variables: { repoUrl: cloneUrl },
      skip: !cloneUrl,
    }
  )

  const currentBranch = branchState.data?.repoState.currentBranch || ''
  const [dialogError, setDialogError] = useState<DialogError | undefined>(
    undefined
  )

  const currentService = branchState.data?.repoState.service
  if (!currentService) {
    throw new Error('no selected version control service')
  }

  const { setupCodeLens, modifiedContent, cleanup } = useMergeCodeLens(original)

  const mergeConflictExists = useMergeConflictDetector(modifiedContent)

  const classes = stylesInUse()

  const {
    loading: userQueryLoading,
    error: userQueryError,
    data: user,
  } = useQuery<MeQueryResult>(ME)

  const [saveMergeEdit, { loading: mutationMergeLoading }] = useMutation(
    SAVE_MERGE,
    {
      onCompleted: cleanup,
      refetchQueries: [{
        query: REPO_STATE,
        variables: { repoUrl: cloneUrl }
      }],
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
              branchState.loading ||
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
