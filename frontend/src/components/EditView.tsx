import React from 'react'
import MonacoEditor from './MonacoEditor'
import ListView from './ListView'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { RepoStateQueryResult } from '../types'
import { REPO_STATE } from '../graphql/queries'

const EditView = () => {
  const repoStateQuery = useQuery<RepoStateQueryResult>(REPO_STATE)
  const location = useLocation()

  if (repoStateQuery.loading) return <div>Loading repo files...</div>
  if (repoStateQuery.error) return <div>Error loading repo files...</div>

  const files = repoStateQuery.data ? repoStateQuery.data.repoState.files : []
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
