import { useQuery } from '@apollo/client'
import React from 'react'
import { REPO_STATE } from '../../graphql/queries'
import { File, RepoStateQueryResult } from '../../types'

interface FileContext {
  files: File[]
  conflictedFiles: File[]
  modifiedFiles: File[]
  solvedConflicts: File[]
  allSolved: boolean
  conflictExists: boolean
}

const defaultValue: FileContext = {
  files: [],
  conflictedFiles: [],
  modifiedFiles: [],
  solvedConflicts: [],
  allSolved: false,
  conflictExists: false,
}

const FileContext = React.createContext<FileContext>(defaultValue)

export const useFiles = () => React.useContext(FileContext)

const FileProvider: React.FC<{ cloneUrl: string }> = ({
  cloneUrl,
  children,
}) => {
  const { data } = useQuery<RepoStateQueryResult>(REPO_STATE, {
    fetchPolicy: 'network-only',
    variables: { repoUrl: cloneUrl },
  })

  const returnValue = React.useMemo(() => {
    if (!data) {
      return defaultValue
    }

    const { files, gitStatus } = data.repoState

    const conflictedFiles = files.filter(
      (file) => !!gitStatus.conflicted?.find((f) => file.name.includes(f))
    )
    const modifiedFiles = files.filter(
      (file) => !!gitStatus.modified?.find((f) => file.name.includes(f))
    )
    const solvedConflicts = conflictedFiles.filter((file) => {
      const lines = file.content.split('\n')

      return (
        !lines.find((line) => line.startsWith('<<<<<<<')) ||
        !lines.find((line) => line.startsWith('=======')) ||
        !lines.find((line) => line.startsWith('>>>>>>>'))
      )
    })

    return {
      files,
      conflictedFiles,
      modifiedFiles,
      solvedConflicts,
      allSolved: conflictedFiles.length === solvedConflicts.length,
      conflictExists: conflictedFiles.length > 0,
    }
  }, [data])

  return (
    <FileContext.Provider value={returnValue}>{children}</FileContext.Provider>
  )
}

export default FileProvider
