import React from 'react'
import MonacoEditor from './MonacoEditor'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { RepoFile } from '../types/RepoFile'

interface Props {
    location: Location
}

interface Location {
    search: string
}

const EditView = ({ location }: Props) => {
    const filename = location.search.slice(3)
    const files = useSelector<RootState, RepoFile[]>(state => state.files.fileList)
    const content = files.find(e => e.filename === filename)?.content
    return (
        <div>
            <h1>{filename}</h1>
            <MonacoEditor content={content} />
        </div>
    )
}

export default EditView
