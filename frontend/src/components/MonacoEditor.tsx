import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { useMutation, useQuery } from '@apollo/client'
import { ME, REPO_STATE } from '../graphql/queries'
import { SAVE_CHANGES } from '../graphql/mutations'
import { Button } from '@material-ui/core'
import SaveDialog from './SaveDialog'
import { RepoStateQueryResult } from '../types'

interface Props {
  content: string | undefined
  filename: string | undefined
}

interface Getter {
  (): string
}

const MonacoEditor = ({ content, filename }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const branchState = useQuery<RepoStateQueryResult>(REPO_STATE)
  const currentBranch = branchState.data?.repoState.currentBranch || ''

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

  const valueGetter = useRef<Getter | null>(null)

  const handleEditorDidMount = (_valueGetter: Getter) => {
    valueGetter.current = _valueGetter
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleDialogSubmit = (
    createNewBranch: boolean,
    newBranch: string,
    commitMessage: string
  ) => {
    if (valueGetter.current) {
      const branchName = createNewBranch ? newBranch : currentBranch
      saveChanges({
        variables: {
          file: {
            name: filename,
            content: valueGetter.current(),
          },
          branch: branchName,
          commitMessage: commitMessage,
        },
      })
    }
    setDialogOpen(false)
  }

  const handleSaveButton = () => {
    setDialogOpen(true)
  }

  return (
    <div style={{ border: '2px solid black', padding: '5px' }}>
      <Editor
        height="50vh"
        language="javascript"
        value={content}
        editorDidMount={handleEditorDidMount}
      />
      <div>
        <SaveDialog
          open={dialogOpen}
          handleClose={handleDialogClose}
          handleSubmit={handleDialogSubmit}
          currentBranch={currentBranch}
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

export default MonacoEditor
