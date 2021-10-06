import { useLazyQuery, useQuery } from '@apollo/client'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { CLONE_REPO, ME, REPO_STATE } from '../graphql/queries'
import { MeQueryResult, RepoStateQueryResult } from '../types'
import AuthenticateDialog from './AuthenticateDialog'
import MonacoDiffEditor from './MonacoDiffEditor/'
import useMergeConflictDetector from './MonacoDiffEditor/useMergeConflictDetector'
import MonacoEditor from './MonacoEditor'
import Sidebar from './Sidebar'

const EditView = () => {
  const location = useLocation()
  const classes = useStyles()

  const { data: user } = useQuery<MeQueryResult>(ME)

  const [repoStateQuery, { data: repoStateData }] =
    useLazyQuery<RepoStateQueryResult>(REPO_STATE, {
      fetchPolicy: 'network-only',
    })

  const cloneRepoQuery = useQuery(CLONE_REPO, {
    onCompleted: () => repoStateQuery(),
  })

  const files = repoStateData ? repoStateData.repoState.files : []
  const filename = location.search.slice(3)
  const content = files.find((e) => e.name === filename)?.content
  const commitMessage = repoStateData
    ? repoStateData.repoState.commitMessage
    : ''

  const mergeConflictExists = useMergeConflictDetector(content)

  if (cloneRepoQuery.loading) return <div>Cloning repo...</div>
  if (cloneRepoQuery.error) return <div>Error cloning repo...</div>

  // TODO: "can't perform react state update on unmounted component "
  // if (repoStateLoading) return <div>Fetching repo state...</div>
  // if (repoStateError) return <div>Error fetching repo state...</div>

  const renderEditor = () => {
    if (!content) {
      return null
    }

    if (mergeConflictExists) {
      return (
        <div className={classes.editor}>
          <MonacoDiffEditor
            original={content}
            filename={filename}
            commitMessage={commitMessage}
          />
        </div>
      )
    }

    return (
      <div className={classes.editor}>
        <MonacoEditor
          content={content}
          filename={filename}
          commitMessage={commitMessage}
          onMergeError={repoStateQuery}
        />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <Sidebar files={files} />
        <AuthenticateDialog open={!user || !user.me} />
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
