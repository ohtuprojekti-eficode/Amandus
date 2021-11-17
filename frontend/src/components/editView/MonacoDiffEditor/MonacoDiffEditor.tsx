import { createStyles, makeStyles, useTheme } from '@material-ui/core'
import { DiffEditor, Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useRef } from 'react'
import ConflictedEditorBottomBar from '../ConflictedBottomBar'
import useDiffEditor from './useDiffEditor'

interface Props {
  original: string
  filename: string
  commitMessage: string
  cloneUrl: string
  currentBranch: string
  currentService: string
  updateTheme: () => void
}

const stylesInUse = makeStyles(() =>
  createStyles({
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
  const classes = stylesInUse()

  const { setupCodeLens, modifiedContent } = useDiffEditor(original, cloneUrl)

  const theme = useTheme()

  const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null)

  const handleEditorDidMount = (
    editor: editor.IStandaloneDiffEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor

    setupCodeLens(editor, monaco)
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
      <ConflictedEditorBottomBar
        filename={filename}
        cloneUrl={cloneUrl}
        original={original}
        modified={modifiedContent}
        currentBranch={currentBranch}
        currentService={currentService}
        commitMessage={commitMessage}
      />
    </div>
  )
}

export default MonacoDiffEditor
