import { RepoStateQueryResult } from './../types'
import { REPO_STATE } from './../graphql/queries'
import { useMutation } from '@apollo/client/react/hooks/useMutation'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { SAVE_LOCALLY } from '../graphql/mutations'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const useAutoSave = (filename: string, repoUrl: string) => {
  // need to fetch debounce interval from useSettings here once merged, e.g
  // const { interval } = useSettings()

  const [saveLocally] = useMutation(SAVE_LOCALLY)
  const [saving, setSaving] = useState(false)

  const interval = 1000

  const callback = async (content: string | undefined) => {
    if (content) {
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
        console.error('Error autosaving:', e)
      } finally {
        const timeElapsed = Date.now() - startedSavingAt

        // Delay setting "saving" to false slightly.
        // Without this the component indicating an ongoing save
        // just flashes very quickly on screen.
        // This makes it appear for at least 600 milliseconds
        await sleep(600 - timeElapsed)

        setSaving(false)
      }
    }
  }

  const debouncedAutoSave = useDebouncedCallback(callback, interval)

  return [debouncedAutoSave, saving] as const
}

export default useAutoSave
