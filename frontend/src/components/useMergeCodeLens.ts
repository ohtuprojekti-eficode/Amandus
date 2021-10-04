import { createStyles, makeStyles } from '@material-ui/core'
import { Monaco } from '@monaco-editor/react'
import {
  CancellationToken,
  // eslint-disable-next-line
  editor, // eslint incorrectly sees editor as unused (only used as a type)
  IDisposable,
  languages,
} from 'monaco-editor'
import React, { useEffect, useRef, useState } from 'react'

interface ChangeCommands {
  selectCurrentChanges: string
  selectIncomingChanges: string
  selectBothChanges: string
  cancel: string
}

interface ConflictBlock {
  currentStart: number // row with <<<<<<
  middle: number // row with ======
  incomingEnd: number // row with >>>>>>
  handled: null | 'current-changes' | 'incoming-changes' | 'both-changes'
}

const findConflictBlocks = (content: string): ConflictBlock[] => {
  const blocks: ConflictBlock[] = []

  const lines = content.split('\n')

  let block: ConflictBlock

  lines.forEach((line, index) => {
    if (line.startsWith('<<<<<<<')) {
      block = {
        currentStart: index + 1, // +1 since monaco starts counting from one
        middle: -1,
        incomingEnd: -1,
        handled: null,
      }
    } else if (line.startsWith('=======')) {
      block.middle = index + 1
    } else if (line.startsWith('>>>>>>>')) {
      block.incomingEnd = index + 1

      blocks.push(block)
    }
  })

  return blocks
}

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

const useHighlight = () => {
  const classes = stylesInUse()

  const decorationRef = useRef<string[][]>([])

  const updateHighlights = React.useCallback(
    (
      editor: editor.IStandaloneDiffEditor,
      monaco: Monaco,
      conflictBlocks: ConflictBlock[]
    ) => {
      conflictBlocks.forEach((block, index) => {
        const oldDecorations = decorationRef.current[index]

        if (!oldDecorations?.length && !block.handled) {
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

        if (block.handled) {
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

const selectCurrentChanges = (content: string, block: ConflictBlock) => {
  const lines = content.split('\n')

  // start splicing from end of the array to avoid problems with indices
  // we need -1 since monaco starts counting from 1

  lines.splice(block.middle - 1, block.incomingEnd - block.middle + 1)

  lines.splice(block.currentStart - 1, 1)

  return lines.join('\n')
}

const selectIncomingChanges = (content: string, block: ConflictBlock) => {
  const lines = content.split('\n')

  // start splicing from end of the array to avoid problems with indices
  // we need -1 since monaco starts counting from 1

  lines.splice(block.incomingEnd - 1, 1)

  lines.splice(block.currentStart - 1, block.middle - block.currentStart + 1)
  return lines.join('\n')
}

const selectBothChanges = (content: string, block: ConflictBlock) => {
  const lines = content.split('\n')

  // start splicing from end of the array to avoid problems with indices
  // we need -1 since monaco starts counting from 1

  lines.splice(block.incomingEnd - 1, 1)

  lines.splice(block.middle - 1, 1)

  lines.splice(block.currentStart - 1, 1)

  return lines.join('\n')
}

const useMergeCodeLens = (original: string) => {
  const [modifiedContent, setModifiedContent] = useState(original)
  const [conflictBlocks, setInitialBlocks] = useState(() =>
    findConflictBlocks(original)
  )
  const updateHighlights = useHighlight()
  const codeLensHandle = useRef<IDisposable | null>(null)
  const [monaco, setMonaco] = useState<Monaco | null>(null)
  const [editor, setEditor] = useState<editor.IStandaloneDiffEditor | null>(
    null
  )

  useEffect(() => {
    // reverse the blocks to avoid trouble with indices when slicing

    const reversedBlocks = conflictBlocks.slice().reverse() // reversing mutates, so slice first

    let content = original

    reversedBlocks.forEach((block) => {
      switch (block.handled) {
        case 'current-changes':
          content = selectCurrentChanges(content, block)

          break
        case 'incoming-changes':
          content = selectIncomingChanges(content, block)

          break
        case 'both-changes':
          content = selectBothChanges(content, block)

          break
      }
    })

    setModifiedContent(content)
  }, [conflictBlocks, original])

  useEffect(() => {
    if (monaco && editor) {
      codeLensHandle.current && codeLensHandle.current.dispose()

      updateHighlights(editor, monaco, conflictBlocks)

      const getHandler = (
        status: null | 'current-changes' | 'incoming-changes' | 'both-changes',
        index: number
      ) => {
        return () => {
          setInitialBlocks((blocks) => {
            return blocks.map((block, i) =>
              i === index ? { ...block, handled: status } : block
            )
          })
        }
      }

      const commands: ChangeCommands[] = conflictBlocks.map((block, index) => {
        return {
          selectCurrentChanges: editor.addCommand(
            0,
            getHandler('current-changes', index)
          ) as string,
          selectIncomingChanges: editor.addCommand(
            0,
            getHandler('incoming-changes', index)
          ) as string,
          selectBothChanges: editor.addCommand(
            0,
            getHandler('both-changes', index)
          ) as string,
          cancel: editor.addCommand(0, getHandler(null, index)) as string,
        }
      })

      codeLensHandle.current = monaco.languages.registerCodeLensProvider(
        'robot',
        {
          provideCodeLenses: function (
            model: editor.ITextModel,
            _token: CancellationToken
          ) {
            if (model.id === '$model2') {
              // this hides the codelens in the right section of the diff editor
              return
            }

            return {
              lenses: conflictBlocks.reduce(
                (
                  allLenses: languages.CodeLens[],
                  currentBlock: ConflictBlock,
                  index: number
                ) => {
                  return currentBlock.handled
                    ? [
                        ...allLenses,
                        {
                          range: {
                            startLineNumber: currentBlock.currentStart,
                            endLineNumber: currentBlock.incomingEnd,
                            startColumn: 0,
                            endColumn: 0,
                          },
                          command: {
                            id: commands[index].cancel,
                            title: 'Cancel',
                          },
                        },
                      ]
                    : [
                        ...allLenses,
                        {
                          range: {
                            startLineNumber: currentBlock.currentStart,
                            endLineNumber: currentBlock.incomingEnd,
                            startColumn: 0,
                            endColumn: 0,
                          },
                          command: {
                            id: commands[index].selectCurrentChanges,
                            title: 'Accept Current Changes',
                          },
                        },
                        {
                          range: {
                            startLineNumber: currentBlock.currentStart,
                            endLineNumber: currentBlock.incomingEnd,
                            startColumn: 0,
                            endColumn: 0,
                          },
                          command: {
                            id: commands[index].selectIncomingChanges,
                            title: 'Accept Incoming Changes',
                          },
                        },
                        {
                          range: {
                            startLineNumber: currentBlock.currentStart,
                            endLineNumber: currentBlock.incomingEnd,
                            startColumn: 0,
                            endColumn: 0,
                          },
                          command: {
                            id: commands[index].selectBothChanges,
                            title: 'Accept Both Changes',
                          },
                        },
                      ]
                },
                []
              ),
              dispose: () => {},
            }
          },
          resolveCodeLens: function (_model, codeLens, _token) {
            return codeLens
          },
        }
      )
    }
  }, [conflictBlocks, monaco, editor, updateHighlights])

  const setupCodeLens = React.useCallback(
    (editorInstance: editor.IStandaloneDiffEditor, monacoInstance: Monaco) => {
      editorInstance.updateOptions({
        diffCodeLens: true, // codelens wont appear without this
      } as editor.IDiffEditorConstructionOptions)

      setMonaco(monacoInstance)
      setEditor(editorInstance)
    },
    []
  )

  return { setupCodeLens, modifiedContent }
}

export default useMergeCodeLens
