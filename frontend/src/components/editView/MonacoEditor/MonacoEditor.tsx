import { createStyles, makeStyles, useTheme } from '@material-ui/core'
import Editor from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useRef } from 'react'
import useAutoSave from '../../../hooks/useAutoSave'
import EditorBottomBar from '../EditorBottomBar'

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
  const classes = stylesInUse()

  const [onEditorChange, autosaving] = useAutoSave(filename, cloneUrl)

  const theme = useTheme()

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
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
        onChange={onEditorChange}
      />
      {
        // Updating the theme here so we override things set by <Editor>
        updateTheme()
      }
      <EditorBottomBar
        cloneUrl={cloneUrl}
        currentBranch={currentBranch}
        filename={filename}
        currentService={currentService}
        autosaving={autosaving}
        onMergeError={onMergeError}
        commitMessage={commitMessage}
      />
    </div>
  )
}

export default MonacoEditor
