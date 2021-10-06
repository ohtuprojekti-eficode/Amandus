import React from 'react'

const useMergeConflictDetector = (content: string | null | undefined) => {
  const mergeConflictExists = React.useMemo(() => {
    if (!content) {
      return false
    }

    const lines = content.split('\n')

    // maybe a suboptimal way to check for merge conflicts
    return (
      !!lines.find((line) => line.startsWith('<<<<<<<')) &&
      !!lines.find((line) => line.startsWith('=======')) &&
      !!lines.find((line) => line.startsWith('>>>>>>>'))
    )
  }, [content])

  return mergeConflictExists
}

export default useMergeConflictDetector
