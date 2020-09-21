import React from 'react'
import MonacoEditor from './MonacoEditor'
import ListView from './ListView'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

interface RepoFile {
    filename: string,
    content: string,
}

const EditView = ({ location }: any) => {
    const filename = location.search.slice(3)
    const files = useSelector<RootState, RepoFile[]>(state => state.files.fileList)
    const content = files.find(e => e.filename === filename)?.content
    return (
        <div style={gridContainerStyle}>
            <div style={asideContainerStyle}>
                <ListView />
            </div>
            <div style={mainContainerStyle}>
                <h2>{filename}</h2>
                <MonacoEditor content={content} />
            </div>
        </div>
    )
}

const gridContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between'
}

const asideContainerStyle = {
    width: '20%'
}

const mainContainerStyle = {
    width: '80%'
}

export default EditView
