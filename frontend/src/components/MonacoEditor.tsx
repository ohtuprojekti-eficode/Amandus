import React, { useRef } from 'react'
import Editor from '@monaco-editor/react'

interface Props {
  content: string | undefined
}

interface Getter {
  (): string
}

const MonacoEditor = ({ content }: Props) => {
  const valueGetter = useRef<Getter | null>(null)

  const handleEditorDidMount = (_valueGetter: Getter) => {
    valueGetter.current = _valueGetter
  }

  const handleSaveButton = () => {
    if (valueGetter.current) {
      alert(valueGetter.current())
      // do something here
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
      <button onClick={handleSaveButton}>Save</button>
    </div>
  )
}

export default MonacoEditor
