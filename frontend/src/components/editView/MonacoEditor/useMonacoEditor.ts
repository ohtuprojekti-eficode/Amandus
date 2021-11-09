import { useMutation } from '@apollo/client'
import { COMMIT_CHANGES, PULL_REPO, SAVE_CHANGES } from '../../../graphql/mutations'
import { REPO_STATE } from '../../../graphql/queries'

const useEditor = (cloneUrl: string) => {
  const [saveChanges, { loading: mutationSaveLoading }] = useMutation(
    SAVE_CHANGES,
    {
      refetchQueries: [
        {
          query: REPO_STATE,
          variables: { repoUrl: cloneUrl },
        },
      ],
    }
  )

  const [pullRepo, { loading: pullLoading }] = useMutation(PULL_REPO, {
    refetchQueries: [
      {
        query: REPO_STATE,
        variables: { repoUrl: cloneUrl },
      },
    ],
  })

  const [commitChanges, { loading: commitLoading }] = useMutation(COMMIT_CHANGES, {
    refetchQueries: [
      {
        query: REPO_STATE,
        variables: { repoUrl: cloneUrl },
      },
    ],
  }) 
  
  return {
    saveChanges,
    mutationSaveLoading,
    pullRepo,
    pullLoading,
    commitChanges, 
    commitLoading
  }
}

export default useEditor
