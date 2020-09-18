import React from 'react'
import MonacoEditor from './MonacoEditor'
import { useParams } from 'react-router-dom'

interface RouteParams {
    filename: string
}

const EditView = ({ files }: any) => {
    const params = useParams<RouteParams>();
    const content = files.find((e: any) => e.filename === params.filename).content
    
    return (
        <div>
            <h1>{params.filename}</h1>
            <MonacoEditor content={content}/>
        </div>
    )
}

export default EditView
