import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { useMutation, useQuery } from '@apollo/client'
import { ME } from '../graphql/queries'
import { SAVE_CHANGES } from '../graphql/mutations'
import SaveDialog from './SaveDialog'

interface Props {
  content: string | undefined
  filename: string | undefined
}

interface Getter {
  (): string
}

const MonacoEditor = ({ content, filename }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const currentBranch = 'master' // get this from somewhere

  const {
    loading: userQueryLoading,
    error: userQueryError,
    data: user,
  } = useQuery(ME)

  const [saveChanges, { loading: mutationSaveLoading }] = useMutation(
    SAVE_CHANGES
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
      console.log(branchName, commitMessage)
      saveChanges({
        variables: {
          file: {
            name: filename,
            content: valueGetter.current(),
          },
          username: user.me.username,
          email: user.me.gitHubEmail,
          token: user.me.gitHubToken,
          branch: 'master', // change this to branchName after backend is updated
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
        <button
          disabled={
            userQueryLoading ||
            !!userQueryError ||
            mutationSaveLoading ||
            !user.me
          }
          onClick={handleSaveButton}
        >
          Save
        </button>
      </div>
      <div style={{ fontSize: 14, marginTop: 5, marginBottom: 5 }}>
        {(!user || !user.me) && 'Please login to enable saving'}
      </div>
    </div>
  )
}

export default MonacoEditor
