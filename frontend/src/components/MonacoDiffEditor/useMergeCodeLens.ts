import { Monaco } from '@monaco-editor/react'
import {
  CancellationToken,
  // eslint-disable-next-line
  editor,
  IDisposable,
  languages,
} from 'monaco-editor'
import React, { useEffect, useRef, useState } from 'react'
import {
  findConflictBlocks,
  selectBothChanges,
  selectCurrentChanges,
  selectIncomingChanges,
} from './helpers'
import { ChangeCommands, ConflictBlock, HandleStatus } from './types'
import useHighlights from './useHighlights'

const useMergeCodeLens = (original: string, language = 'robot') => {
  const [modifiedContent, setModifiedContent] = useState(original)
  const [conflictBlocks, setInitialBlocks] = useState(() =>
    findConflictBlocks(original)
  )
  const updateHighlights = useHighlights()
  const codeLensHandle = useRef<IDisposable | null>(null)
  const [monaco, setMonaco] = useState<Monaco | null>(null)
  const [editor, setEditor] = useState<editor.IStandaloneDiffEditor | null>(
    null
  )

  useEffect(() => {
    // handles updating the right side of the editor

    // reverse the blocks to avoid trouble with indices when slicing
    const reversedBlocks = conflictBlocks.slice().reverse() // reversing mutates, so slice first

    let content = original

    reversedBlocks.forEach((block) => {
      switch (block.handleStatus) {
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
    // handles updating the codelens commands and buttons, as well as highlighting
    if (monaco && editor) {
      // get rid of old codelenses
      codeLensHandle.current && codeLensHandle.current.dispose()

      updateHighlights(editor, monaco, conflictBlocks)

      const getHandler = (status: HandleStatus, index: number) => {
        return () => {
          setInitialBlocks((blocks) => {
            return blocks.map((block, i) =>
              i === index ? { ...block, handleStatus: status } : block
            )
          })
        }
      }

      // commands triggered by the codelens buttons
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

      const modifiedModelId = editor.getModel()?.modified.id

      codeLensHandle.current = monaco.languages.registerCodeLensProvider(
        language, // needs to match the language passed to the DiffEditor -component for the codelens to show up
        {
          provideCodeLenses: function (
            model: editor.ITextModel,
            _token: CancellationToken
          ) {
            if (model.id === modifiedModelId) {
              // hides the codelens in the right section of the diff editor
              return
            }

            return {
              lenses: conflictBlocks.reduce(
                (
                  allLenses: languages.CodeLens[],
                  currentBlock: ConflictBlock,
                  index: number
                ) => {
                  // if the block's conflict has been handled, return cancel -button
                  // otherwise return action buttons
                  return currentBlock.handleStatus
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
  }, [conflictBlocks, monaco, editor, updateHighlights, language])

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
