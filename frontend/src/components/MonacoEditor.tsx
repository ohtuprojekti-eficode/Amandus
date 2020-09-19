import React from 'react'
import Editor from '@monaco-editor/react'

const MonacoEditor = ({ content }: any) => {
    
    return (
        <div style={{ border: "2px solid black", padding: "5px" }}>
            <Editor height="50vh" language="javascript" value={content}/>
        </div>
    )
}

export default MonacoEditor
