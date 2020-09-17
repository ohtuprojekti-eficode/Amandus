import React from 'react'
import Editor from '@monaco-editor/react'

const MonacoEditor = ({content} :any) => {
    return (
        <div>
            <Editor height="90vh" language="javascript" value={content}/>
        </div>
    )
}

export default MonacoEditor
