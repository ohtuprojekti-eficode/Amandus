import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core'
// import { GitHub } from '@material-ui/icons'
import Editor, { loader } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useEffect, useRef, useState } from 'react'
import { PULL_REPO, SAVE_CHANGES } from '../graphql/mutations'
import { IS_BB_CONNECTED, IS_GH_CONNECTED, IS_GL_CONNECTED, ME, REPO_STATE } from '../graphql/queries'
import VsCodeDarkTheme from '../styles/editor-themes/vs-dark-plus-theme'
import VsCodeLightTheme from '../styles/editor-themes/vs-light-plus-theme'
import {
  IsBitbucketConnectedResult,
  IsGithubConnectedResult,
  IsGitLabConnectedResult,
  MeQueryResult,
  RepoStateQueryResult,
} from '../types'
import { initMonaco } from '../utils/monacoInitializer'
import { SimpleLanguageInfoProvider } from '../utils/providers'
import SaveDialog from './SaveDialog'

interface Props {
  content: string | undefined
  filename: string | undefined
  commitMessage: string | undefined
  onMergeError: () => void
  cloneUrl: string | undefined
}

interface Getter {
  (): string
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

const MonacoEditor = ({
  onMergeError,
  content,
  filename,
  commitMessage,
  cloneUrl
}: Props) => {

  const [dialogOpen, setDialogOpen] = useState(false)
  const [waitingToSave, setWaitingToSave] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const providerRef = useRef<SimpleLanguageInfoProvider>()
  const branchState = useQuery<RepoStateQueryResult>(
    REPO_STATE,
    {
      variables: { repoUrl: cloneUrl },
      skip: !cloneUrl,
    }
  )

  const currentService = branchState.data?.repoState.service
  if (!currentService) {
    throw new Error('no selected version control service')
  }

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
      refetchQueries: [{
        query: REPO_STATE,
        variables: { repoUrl: cloneUrl }
      }],
    }
  )

  const [pullRepo, { loading: pullLoading }] = useMutation(PULL_REPO, {
    refetchQueries: [{
      query: REPO_STATE,
      variables: { repoUrl: cloneUrl }
    }],
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
      await pullRepo()
    } catch (error) {
      console.error('error pulling')
    }
  }

  useEffect(() => {
    loader.init().then((monaco) => {
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
              !user?.me ||
              branchState.loading
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
              !user?.me ||
              branchState.loading
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
