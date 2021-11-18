import { useMutation } from '@apollo/client'
import { useState, useCallback } from 'react'
import { SAVE_LOCALLY } from '../graphql/mutations'
import { REPO_STATE } from '../graphql/queries'
import { RepoStateQueryResult } from '../types'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const useSave = () => {
  const [saveLocally] = useMutation(SAVE_LOCALLY)
  const [saving, setSaving] = useState(false)

  const save = useCallback(
    async (content: string, filename: string, repoUrl: string) => {
      setSaving(true)

      const startedSavingAt = Date.now()

      try {
        await saveLocally({
          variables: {
            file: {
              name: filename,
              content,
            },
          },
          update: (cache) => {
            // update apollo cache

            const currentState = cache.readQuery<RepoStateQueryResult>({
              query: REPO_STATE,
              variables: {
                repoUrl,
              },
            })

            if (!currentState) {
              return
            }

            cache.writeQuery({
              query: REPO_STATE,
              variables: { repoUrl },
              data: {
                ...currentState,
                repoState: {
                  ...currentState.repoState,
                  files: currentState.repoState.files.map((file) =>
                    file.name === filename ? { ...file, content } : file
                  ),
                },
              },
            })
          },
        })
      } catch (e) {
        console.error('Error saving:', e)
      } finally {
        const timeElapsed = Date.now() - startedSavingAt

        // Delay setting "saving" to false slightly.
        // Without this the component indicating an ongoing save
        // just flashes very quickly on screen.
        // This makes it appear for at least 600 milliseconds
        await sleep(600 - timeElapsed)

        setSaving(false)
      }
    },
    [saveLocally]
  )

  return [save, saving] as const
}

export default useSave
