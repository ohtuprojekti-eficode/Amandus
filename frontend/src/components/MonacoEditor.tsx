import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { monaco } from '@monaco-editor/react'
import { useMutation, useQuery } from '@apollo/client'
import { ME, REPO_STATE } from '../graphql/queries'
import { SAVE_CHANGES } from '../graphql/mutations'
import { Button, useTheme } from '@material-ui/core'
import SaveDialog from './SaveDialog'
import AuthenticateDialog from './AuthenticateDialog'
import { RepoStateQueryResult } from '../types'

// import { loadVSCodeOnigurumWASM } from '../utils/monacoUtils'

import type { LanguageId } from '../utils/languages'
import type {
  ScopeName,
  TextMateGrammar,
  ScopeNameInfo,
} from '../utils/providers'
import { createOnigScanner, createOnigString } from 'vscode-oniguruma'
import { SimpleLanguageInfoProvider } from '../utils/providers'
import { registerLanguages } from '../utils/languages'
import { rehydrateRegexps } from '../utils/configuration'
import VsCodeDarkTheme from '../themes/vs-dark-plus-theme'
import { IOnigLib } from 'vscode-textmate'
import { grammar } from '../grammars/robot'
import { robotConfiguration } from '../grammars/robotConfiguration'

interface Props {
  content: string | undefined
  filename: string | undefined
}

interface Getter {
  (): string
}

interface DialogError {
  title: string
  message: string
}

interface DemoScopeNameInfo extends ScopeNameInfo {
  path: string
}

const MonacoEditor = ({ content, filename }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const branchState = useQuery<RepoStateQueryResult>(REPO_STATE)
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
    commitMessage: string
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
            commitMessage: commitMessage,
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

  interface Language {
    id: string
    extensions: string[]
  }

  monaco.init().then(async (monaco) => {
    const languages = [
      {
        id: 'robot',
        extensions: ['.robot'],
      },
    ]

    const grammars: { [scopeName: string]: DemoScopeNameInfo } = {
      'source.robot': {
        language: 'robot',
        path: 'robotframework.tmLanguage.json',
      },
    }

    const fetchGrammar = async (): Promise<any> => {
      const type = 'json'
      const json = JSON.stringify(grammar)
      return { type, grammar: json }
    }

    const fetchConfiguration = async (): Promise<any> => {
      const rawConfiguration = JSON.stringify(robotConfiguration)
      return rehydrateRegexps(rawConfiguration)
    }

    const onigLib = Promise.resolve({
      createOnigScanner,
      createOnigString,
    })

    const provider = new SimpleLanguageInfoProvider({
      grammars,
      fetchGrammar,
      configurations: languages.map((language: any) => language.id),
      fetchConfiguration,
      theme: VsCodeDarkTheme,
      onigLib,
      monaco,
    })
    registerLanguages(
      languages,
      (language: LanguageId) => provider.fetchLanguageInfo(language),
      monaco
    )

    monaco.editor.setTheme('vs-dark')

    provider.injectCSS()
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
      </div>
      <div style={{ fontSize: 14, marginTop: 5, marginBottom: 5 }}>
        {(!user || !user.me) && 'Please login to enable saving'}
        {user?.me && currentBranch && `On branch ${currentBranch}`}
      </div>
    </div>
  )
}

function getSampleCodeForLanguage(language: LanguageId): string {
  if (language === 'robot') {
    return `\
*** Settings ***
Documentation     A test suite with a single test for valid login.
...
...               This test has a workflow that is created using keywords in
...               the imported resource file.
Resource          resource.txt

*** Test Cases ***
Valid Login
    Open Browser To Login Page
    Input Username    demo
    Input Password    mode
    Submit Credentials
    Welcome Page Should Be Open
    [Teardown]    Close Browser
`
  }

  throw Error(`unsupported language: ${language}`)
}

export default MonacoEditor
