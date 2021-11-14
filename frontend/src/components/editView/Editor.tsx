import { makeStyles, createStyles, useTheme } from '@material-ui/core'
import { loader } from '@monaco-editor/react'
import React, { useEffect } from 'react'
import { initMonaco, initLanguageClient } from '../../utils/monacoInitializer'
import MonacoDiffEditor from './MonacoDiffEditor'
import MonacoEditor from './MonacoEditor/MonacoEditor'

import VsCodeDarkTheme from '../../styles/editor-themes/vs-dark-plus-theme'
import VsCodeLightTheme from '../../styles/editor-themes/vs-light-plus-theme'

import { SimpleLanguageInfoProvider } from '../../utils/providers'

interface EditorProps {
  isConflicted: boolean
  fileContent: string
  filename: string
  commitMessage: string
  currentBranch: string
  currentService: string
  cloneUrl: string
  onMergeError: () => void
}

const Editor = ({
  fileContent,
  filename,
  isConflicted,
  commitMessage,
  cloneUrl,
  onMergeError,
  currentBranch,
  currentService,
}: EditorProps) => {
  const classes = useStyles()

  const providerRef = React.useRef<SimpleLanguageInfoProvider | null>(null)

  const theme = useTheme()

  useEffect(() => {
    loader.init().then((monaco) => {
      providerRef.current = initMonaco(monaco, theme.palette.type)

      initLanguageClient(monaco)
    })
    // Need to have an empty dependency array for this to work correctly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateTheme = () => {
    if (providerRef.current) {
      const editorTheme =
        theme.palette.type === 'dark' ? VsCodeDarkTheme : VsCodeLightTheme

      providerRef.current.changeTheme(editorTheme)
      providerRef.current.injectCSS()
    }
  }

  if (isConflicted) {
    return (
      <div className={classes.editor}>
        <MonacoDiffEditor
          original={fileContent}
          filename={filename}
          commitMessage={commitMessage}
          currentBranch={currentBranch}
          currentService={currentService}
          cloneUrl={cloneUrl}
          updateTheme={updateTheme}
        />
      </div>
    )
  }

  return (
    <div className={classes.editor}>
      <MonacoEditor
        content={fileContent}
        filename={filename}
        commitMessage={commitMessage}
        onMergeError={onMergeError}
        cloneUrl={cloneUrl}
        currentBranch={currentBranch}
        currentService={currentService}
        updateTheme={updateTheme}
      />
    </div>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    editor: {
      flexGrow: 1,
    },
  })
)

export default Editor
