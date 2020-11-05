import React from 'react'
import MonacoEditor from './MonacoEditor'
import ListView from './ListView'
import { useLocation } from 'react-router-dom'
import { useLazyQuery, useQuery } from '@apollo/client'
import { RepoStateQueryResult } from '../types'
import { REPO_STATE, CLONE_REPO } from '../graphql/queries'

const EditView = () => {
  const location = useLocation()
  const [repoStateQuery, { data: repoStateData }] = useLazyQuery<
    RepoStateQueryResult
  >(REPO_STATE)
  const cloneRepoQuery = useQuery(CLONE_REPO, {
    onCompleted: () => repoStateQuery(),
  })

  if (cloneRepoQuery.loading) return <div>Cloning repo...</div>
  if (cloneRepoQuery.error) return <div>Error cloning repo...</div>

  // TODO: "can't perform react state update on unmounted component "
  // if (repoStateLoading) return <div>Fetching repo state...</div>
  // if (repoStateError) return <div>Error fetching repo state...</div>

  const files = repoStateData ? repoStateData.repoState.files : []
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
