import React from 'react'
import MonacoEditor from './MonacoEditor'
import { useParams } from 'react-router-dom'


const EditView = ({content}: any) => {
    let { filename }: any = useParams()
    return (
        <div>
            <h1>{filename}</h1>
            <MonacoEditor content={content}/>
        </div>
    )
}

export default EditView
