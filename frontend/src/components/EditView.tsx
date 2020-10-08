import React from 'react'
import MonacoEditor from './MonacoEditor'
import ListView from './ListView'
import { useLocation } from 'react-router-dom'
import { FileList } from '../types'

const EditView = ({ files }: FileList) => {
  let location = useLocation()
  const filename = location.search.slice(3)
  const content = files.find((e) => e.name === filename)?.content

  return (
    <div style={gridContainerStyle}>
      <div style={asideContainerStyle}>
        <ListView files={files}/>
      </div>
      <div style={mainContainerStyle}>
        <h2>{filename}</h2>
        <MonacoEditor content={content} filename={filename} />
      </div>
    </div>
  )
}

const gridContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
}

const asideContainerStyle = {
  width: '20%',
}

const mainContainerStyle = {
  width: '80%',
}

export default EditView