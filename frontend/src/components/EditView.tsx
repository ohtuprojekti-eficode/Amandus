import React from 'react'
import MonacoEditor from './MonacoEditor'
import ListView from './ListView'
import { useLocation } from 'react-router-dom'
import { FileListQueryResult } from '../types'
import { ApolloError } from '@apollo/client'

interface PropsType {
  loading: boolean
  data: FileListQueryResult | undefined
  error: ApolloError | undefined
}

const EditView = ({ loading, data, error }: PropsType) => {
  const location = useLocation()

  if (loading) return <div>Loading files...</div>
  if (error) return <div>Error fetching files...</div>

  const files = data ? data.files : []
  const filename = location.search.slice(3)
  const content = files.find((e) => e.name === filename)?.content

  return (
    <div style={gridContainerStyle}>
      <div style={asideContainerStyle}>
        <ListView files={files} />
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
