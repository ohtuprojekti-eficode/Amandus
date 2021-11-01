import { useMutation } from '@apollo/client'
import { SAVE_MERGE } from '../../../graphql/mutations'
import { REPO_STATE } from '../../../graphql/queries'
import useMergeCodeLens from './useMergeCodeLens'
import useMergeConflictDetector from './useMergeConflictDetector'

const useDiffEditor = (original: string, cloneUrl: string) => {
  const { setupCodeLens, modifiedContent, cleanup } = useMergeCodeLens(original)

  const mergeConflictExists = useMergeConflictDetector(modifiedContent)

  const [saveMergeEdit, { loading: mutationMergeLoading }] = useMutation(
    SAVE_MERGE,
    {
      onCompleted: cleanup,
      refetchQueries: [
        {
          query: REPO_STATE,
          variables: { repoUrl: cloneUrl },
        },
      ],
    }
  )

  return {
    setupCodeLens,
    modifiedContent,
    saveMergeEdit,
    mergeConflictExists,
    mutationMergeLoading,
  }
}

export default useDiffEditor
