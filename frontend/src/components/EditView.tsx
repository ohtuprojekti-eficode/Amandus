import React, { useState, useEffect } from 'react'
import MonacoEditor from './MonacoEditor'
import MonacoDiffEditor from './MonacoDiffEditor/'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'
import { useLazyQuery, useQuery } from '@apollo/client'
import { RepoStateQueryResult } from '../types'
import { REPO_STATE, CLONE_REPO } from '../graphql/queries'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const EditView = () => {
  const location = useLocation()
  const classes = useStyles()
  const [hasRefetched, setHasRefetched] = useState(false)
  const [mergeConflictExists, setMergeConflictExists] = useState(false)

  const [repoStateQuery, { data: repoStateData }] =
    useLazyQuery<RepoStateQueryResult>(REPO_STATE, {
      fetchPolicy: 'network-only',
    })

  const cloneRepoQuery = useQuery(CLONE_REPO, {
    onCompleted: () => repoStateQuery(),
  })

  if (cloneRepoQuery.error) {
    console.log(`Clone error: ${cloneRepoQuery.error}`)
  }

  useEffect(() => {
    if (!hasRefetched && mergeConflictExists) {
      repoStateQuery()
      setHasRefetched(true)
    }
  }, [hasRefetched, mergeConflictExists, repoStateQuery])

  const files = repoStateData ? repoStateData.repoState.files : []
  const filename = location.search.slice(3)
  const content = files.find((e) => e.name === filename)?.content
  const commitMessage = repoStateData
    ? repoStateData.repoState.commitMessage
    : ''

  useEffect(() => {
    if (!mergeConflictExists && content) {
      const lines = content?.split('\n')

      console.log('here', lines)

      if (
        // maybe a suboptimal way to check for merge conflicts
        lines.find((line) => line.startsWith('<<<<<<<')) &&
        lines.find((line) => line.startsWith('=======')) &&
        lines.find((line) => line.startsWith('>>>>>>>'))
      ) {
        setMergeConflictExists(true)
      }
    }
  }, [content, mergeConflictExists])

  if (cloneRepoQuery.loading) return <div>Cloning repo...</div>
  if (cloneRepoQuery.error) return <div>Error cloning repo...</div>

  // TODO: "can't perform react state update on unmounted component "
  // if (repoStateLoading) return <div>Fetching repo state...</div>
  // if (repoStateError) return <div>Error fetching repo state...</div>

  const renderEditor = () => {
    if (mergeConflictExists) {
      return (
        <div className={classes.editor}>
          {content && (
            <MonacoDiffEditor
              setMergeConflictState={setMergeConflictExists}
              original={content}
              modified={content}
              filename={filename}
              commitMessage={commitMessage}
            />
          )}
        </div>
      )
    }

    return (
      <div className={classes.editor}>
        <MonacoEditor
          setMergeConflictState={setMergeConflictExists}
          content={content}
          filename={filename}
          commitMessage={commitMessage}
        />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <Sidebar files={files} />
      </div>
      <div className={classes.editor}>{renderEditor()}</div>
    </div>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
    },
    sidebar: {
      flexShrink: 0,
      width: '20%',
    },
    editor: {
      flexGrow: 1,
    },
  })
)

export default EditView
