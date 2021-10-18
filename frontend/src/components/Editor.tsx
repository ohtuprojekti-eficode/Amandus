import { makeStyles, createStyles } from '@material-ui/core'
import React from 'react'
import MonacoDiffEditor from './MonacoDiffEditor/'
import useMergeConflictDetector from './MonacoDiffEditor/useMergeConflictDetector'
import MonacoEditor from './MonacoEditor'

interface EditorProps {
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
  commitMessage,
  cloneUrl,
  onMergeError,
  currentBranch,
  currentService,
}: EditorProps) => {
  const mergeConflictExists = useMergeConflictDetector(fileContent)

  const classes = useStyles()

  if (mergeConflictExists) {
    return (
      <div className={classes.editor}>
        <MonacoDiffEditor
          original={fileContent}
          filename={filename}
          commitMessage={commitMessage}
          currentBranch={currentBranch}
          currentService={currentService}
          cloneUrl={cloneUrl}
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
