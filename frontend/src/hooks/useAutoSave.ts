import React from 'react'
import { useDebouncedCallback } from 'use-debounce'
import useSave from './useSave'

/**
 * Autosaves changes when
 *
 * 1) not moving the cursor for the set interval
 * 2) changing the file that is being edited
 * 3) closing the tab or browser
 *
 * @param cacheContent content found in Apollo cache (not the editor!)
 * @param filename name of the file being edited
 * @param repoUrl repository url in backend
 * @returns tuple with a change handler function to pass to the editor and a boolean whether a save is ongoing
 */
const useAutoSave = (
  cacheContent: string,
  filename: string,
  repoUrl: string
) => {
  const [save, saving] = useSave()

  const interval = 1000

  const debouncedAutoSave = useDebouncedCallback(save, interval)

  // this keeps track of the current content in the editor
  const contentRef = React.useRef(cacheContent)

  React.useEffect(() => {
    // this is necessary to update the ref when changing the edited file
    contentRef.current = cacheContent

    return () => {
      // here we save when changing the edited file (if the content of the cache differs from the ref)
      if (cacheContent !== contentRef.current) {
        save(contentRef.current, filename, repoUrl)
      }
    }
  }, [filename, cacheContent, repoUrl, save])

  React.useEffect(
    // Cancels autosave when user changes the file that is being edited.
    // Without this the new file can get overwritten with the old file's content
    () => () => debouncedAutoSave.cancel(),
    [filename, debouncedAutoSave]
  )

  React.useEffect(() => {
    // saves when user closes the tab / browser

    const handler = () => save(contentRef.current, filename, repoUrl)

    window.addEventListener('beforeunload', handler)

    return () => {
      window.removeEventListener('beforeunload', handler)
    }
  }, [save, filename, repoUrl])

  const onEditorContentChange = (value: string | undefined) => {
    if (value) {
      // trigger the debounced autosave and update the ref
      debouncedAutoSave(value, filename, repoUrl)
      contentRef.current = value
    }
  }

  return [onEditorContentChange, saving] as const
}

export default useAutoSave
