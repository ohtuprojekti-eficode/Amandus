import React from 'react'
import { useDebouncedCallback } from 'use-debounce'
import useSave from './useSave'

/**
 * Autosaves when not moving the cursor for the set interval
 *
 * @param filename name of the file being edited
 * @param repoUrl repository url in backend
 * @returns tuple with a change handler function to pass to the editor and a boolean whether a save is ongoing
 */
const useAutoSave = (filename: string, repoUrl: string) => {
  const [save, saving] = useSave()

  const interval = 1000

  const debouncedAutoSave = useDebouncedCallback(save, interval)

  React.useEffect(
    // Cancels autosave when user changes the file that is being edited.
    // Without this the new file can get overwritten with the old file's content
    () => () => debouncedAutoSave.cancel(),
    [filename, debouncedAutoSave]
  )

  const onEditorContentChange = (value: string | undefined) => {
    // trigger the debounced autosave
    debouncedAutoSave(value ?? '', filename, repoUrl)
  }

  return [onEditorContentChange, saving] as const
}

export default useAutoSave
