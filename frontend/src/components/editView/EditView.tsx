import { useLazyQuery, useQuery } from '@apollo/client'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { CLONE_REPO, ME, REPO_STATE } from '../../graphql/queries'
import { MeQueryResult, RepoStateQueryResult } from '../../types'
import AuthenticateDialog from '../AuthenticateDialog'
import Editor from './Editor'
import Sidebar from './Sidebar'

interface LocationState {
  cloneUrl: string
}

interface Props {
  cloneUrl: string | undefined
}

const EditView = ({ cloneUrl }: Props) => {
  const location = useLocation<LocationState>()
  const classes = useStyles()

  const { data: user } = useQuery<MeQueryResult>(ME)

  const [repoStateQuery, { data: repoStateData }] =
    useLazyQuery<RepoStateQueryResult>(REPO_STATE, {
      fetchPolicy: 'network-only',
      variables: { repoUrl: cloneUrl },
    })

  const cloneRepoQuery = useQuery(CLONE_REPO, {
    variables: { cloneUrl },
    skip: !cloneUrl,
    onCompleted: () => repoStateQuery(),
  })

  if (cloneRepoQuery.error) {
    console.log(`Clone error: ${cloneRepoQuery.error}`)
    return <div>Error cloning repo...</div>
  }

  if (cloneRepoQuery.loading) return <div>Cloning repo...</div>

  // TODO: "can't perform react state update on unmounted component "
  // if (repoStateLoading) return <div>Fetching repo state...</div>
  // if (repoStateError) return <div>Error fetching repo state...</div>

  const renderEditor = () => {
    const urlToClone = cloneUrl ?? location.state?.cloneUrl

    if (!urlToClone)
      return !user || !user.me ? null : (
        <div>Please select repository first</div>
      )

    if (!repoStateData?.repoState) {
      return null
    }

    const currentService = repoStateData.repoState.service
    const files = repoStateData.repoState.files
    const filename = location.search.slice(3)
    const isConflicted =
      repoStateData.repoState.gitStatus.conflicted?.some((name) =>
        filename.includes(name)
      ) ?? false

    const file = files.find((e) => e.name === filename)

    if (!file || !currentService) {
      return null
    }
    const currentBranch = repoStateData.repoState.currentBranch
    const fileContent = file.content
    const commitMessage = repoStateData.repoState.commitMessage

    return (
      <Editor
        fileContent={fileContent}
        isConflicted={isConflicted}
        filename={filename}
        commitMessage={commitMessage}
        cloneUrl={urlToClone}
        currentBranch={currentBranch}
        currentService={currentService}
        onMergeError={repoStateQuery}
      />
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <Sidebar
          files={repoStateData?.repoState.files ?? []}
          currentUrl={cloneUrl}
        />
        <AuthenticateDialog open={!user || !user.me} />
      </div>
      {renderEditor()}
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
