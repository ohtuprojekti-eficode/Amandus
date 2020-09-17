import React from 'react'
import MonacoEditor from './MonacoEditor'

const EditView = ({content}: any) => {
    return (
        <div>
            <h1>Edit View</h1>
            <MonacoEditor content={content}/>
        </div>
    )
}

export default EditView
