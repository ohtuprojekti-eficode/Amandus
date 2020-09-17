import React from 'react'
import Editor from '@monaco-editor/react'

const EditView = ({ files }: any) => {
    return (
        <div>
            <h1>Edit View</h1>
            <Editor />
        </div>
    )
}

export default EditView
