import { ConflictBlock } from './types'

export const findConflictBlocks = (content: string): ConflictBlock[] => {
  const blocks: ConflictBlock[] = []

  const lines = content.split('\n')

  let block: ConflictBlock

  lines.forEach((line, index) => {
    if (line.startsWith('<<<<<<<')) {
      block = {
        currentStart: index + 1, // +1 since monaco starts counting from one
        middle: -1,
        incomingEnd: -1,
        handleStatus: null,
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

export const selectCurrentChanges = (content: string, block: ConflictBlock) => {
  const lines = content.split('\n')

  // start splicing from end of the array to avoid problems with indices
  // we need -1 since monaco starts counting from 1

  lines.splice(block.middle - 1, block.incomingEnd - block.middle + 1)

  lines.splice(block.currentStart - 1, 1)

  return lines.join('\n')
}

export const selectIncomingChanges = (
  content: string,
  block: ConflictBlock
) => {
  const lines = content.split('\n')

  // start splicing from end of the array to avoid problems with indices
  // we need -1 since monaco starts counting from 1

  lines.splice(block.incomingEnd - 1, 1)

  lines.splice(block.currentStart - 1, block.middle - block.currentStart + 1)
  return lines.join('\n')
}

export const selectBothChanges = (content: string, block: ConflictBlock) => {
  const lines = content.split('\n')

  // start splicing from end of the array to avoid problems with indices
  // we need -1 since monaco starts counting from 1

  lines.splice(block.incomingEnd - 1, 1)

  lines.splice(block.middle - 1, 1)

  lines.splice(block.currentStart - 1, 1)

  return lines.join('\n')
}
