import { makeStyles, createStyles } from '@material-ui/core'
import { Monaco } from '@monaco-editor/react'
// eslint-disable-next-line
import { editor } from 'monaco-editor'
import React, { useRef } from 'react'
import { ConflictBlock } from './types'

const stylesInUse = makeStyles(() =>
  createStyles({
    incomingHighLight: {
      backgroundColor: 'pink',
      opacity: 0.2,
    },
    currentHighLight: {
      backgroundColor: 'lightblue',
      opacity: 0.2,
    },
  })
)
/**
 * Handles merge conflict editor highlighting
 * @returns function to update highlights
 */
const useHighlights = () => {
  const classes = stylesInUse()

  const decorationRef = useRef<string[][]>([]) // keeps track of current decorations

  const updateHighlights = React.useCallback(
    (
      editor: editor.IStandaloneDiffEditor,
      monaco: Monaco,
      conflictBlocks: ConflictBlock[]
    ) => {
      conflictBlocks.forEach((block, index) => {
        const oldDecorations = decorationRef.current[index]

        if (!oldDecorations?.length && !block.handleStatus) {
          // set merge conflict decorations if not set
          const decos = editor.getOriginalEditor().deltaDecorations(
            [],
            [
              {
                range: new monaco.Range(block.currentStart, 0, block.middle, 0),
                options: {
                  isWholeLine: true,
                  className: classes.currentHighLight,
                },
              },
              {
                range: new monaco.Range(block.middle, 0, block.incomingEnd, 0),
                options: {
                  isWholeLine: true,
                  className: classes.incomingHighLight,
                },
              },
            ]
          )

          decorationRef.current[index] = decos
        }

        if (block.handleStatus) {
          // remove decorations from handled blocks
          const decos = editor
            .getOriginalEditor()
            .deltaDecorations(oldDecorations, [])

          decorationRef.current[index] = decos
        }
      })
    },
    [classes.currentHighLight, classes.incomingHighLight]
  )

  return updateHighlights
}

export default useHighlights
