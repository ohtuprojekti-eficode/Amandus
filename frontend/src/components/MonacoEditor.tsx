import React, { useRef } from 'react'
import Editor from '@monaco-editor/react'

import { useMutation, useQuery } from '@apollo/client'

import { ME } from '../graphql/queries'
import { SAVE_CHANGES } from '../graphql/mutations'

interface Props {
  content: string | undefined,
  filename: string | undefined
}

interface Getter {
    (): string
}

const MonacoEditor = ({ content, filename }: Props) => {

    const { loading: userQueryLoading, error: userQueryError, data: user } = useQuery(ME)
    
    const [
        saveChanges, 
        { loading: mutationSaveLoading, error: mutationSaveError }
    ] = useMutation(SAVE_CHANGES)
    
    console.log('data', user, userQueryLoading, userQueryError)

    const valueGetter = useRef<Getter | null>(null)

    const handleEditorDidMount = (_valueGetter: Getter) => {
        valueGetter.current = _valueGetter
    }

    const handleSaveButton = () => {
        if (valueGetter.current) {
            saveChanges({ variables: { 
                    file: {
                        name: filename,
                        content: valueGetter.current(),
                    },  
                    username: user.me.username,
                    email: user.me.gitHubEmail,
                    token: user.me.gitHubToken
                } 
            });        
            
            console.log(valueGetter.current(), user.me.username, user.me.gitHubEmail, user.me.gitHubToken)
        }
    }

    
    
    return (
        <div style={{ border: '2px solid black', padding: '5px' }}>
            <Editor
                height="50vh"
                language="javascript"
                value={content}
                editorDidMount={handleEditorDidMount}
            />
            <button
                disabled={
                    userQueryLoading || 
                    !!userQueryError ||
                    mutationSaveLoading ||
                    !user.me
                } 
                onClick={handleSaveButton}
                >Save
            </button>
        </div>
    )
}

export default MonacoEditor