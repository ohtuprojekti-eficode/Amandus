import { Button, createStyles, makeStyles, useTheme } from '@material-ui/core'
import { DiffEditor, Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'
import React, { useRef, useState } from 'react'
import useSaveDialog from '../../../hooks/useSaveDialog'
import LatestCommit from '../LatestCommit'
import MergeDialog from '../saveDialogs/MergeDialog'
import ServiceConnected from '../ServiceConnected'
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
    saveGroup: {
      margin: '10px 20px',
    },
    buttonAndStatus: {
      display: 'flex',
      alignItems: 'center',
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
  original,
  filename,
  commitMessage,
  cloneUrl,
  currentBranch,
  currentService,
  updateTheme,
}: Props) => {
  const {
    dialogOpen,
    dialogError,
    handleDialogClose,
    setDialogError,
    handleDialogOpen,
  } = useSaveDialog()

  const [waitingToMerge, setWaitingToMerge] = useState(false)

  const classes = stylesInUse()

  const {
    setupCodeLens,
    mergeConflictExists,
    saveMergeEdit,
    modifiedContent,
    mutationMergeLoading,
  } = useDiffEditor(original, cloneUrl)

  const theme = useTheme()

  const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null)

  const handleEditorDidMount = (
    editor: editor.IStandaloneDiffEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor

    setupCodeLens(editor, monaco)
  }

  const handleDialogSubmit = async (newCommitMessage: string) => {
    if (editorRef.current) {
      try {
        setWaitingToMerge(true)
        await saveMergeEdit({
          variables: {
            files: [
              {
                name: filename,
                content: editorRef.current.getModifiedEditor().getValue(),
              },
            ],
            commitMessage: newCommitMessage,
          },
        })
        handleDialogClose()
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
            disabled={mutationMergeLoading || mergeConflictExists}
            onClick={handleDialogOpen}
          >
            Merge
          </Button>
          <ServiceConnected service={currentService} />
          <LatestCommit commitMessage={commitMessage} />
        </div>
      </div>
    </div>
  )
}

export default MonacoDiffEditor
