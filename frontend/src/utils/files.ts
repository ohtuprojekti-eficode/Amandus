import { File, FileTree } from '../types'

export const parseToFileTree = (files: File[], rootOffset: number = 2) => {
  if (files.length === 0) {
    return undefined
  }
  const rootName = files[0].name.split('/').slice(0, rootOffset).join('/')
  const root: FileTree = {
    name: rootName,
    path: rootName,
    type: 'root',
    children: [],
    status: null,
  }
  files.forEach((file) => {
    addToFileTree(root, file.name, rootOffset, file.status)
  })
  return root
}

export const addToFileTree = (
  root: FileTree,
  path: string,
  rootOffset: number = 2,
  status: string | null
) => {
  const sections = path.split('/')
  const maxDepth = sections.length
  let parent = root
  for (let i = rootOffset; i < maxDepth; i++) {
    const section = sections[i]
    const child = parent.children.find((e) => e.name === section)
    if (child) {
      parent = child
    } else {
      const newNode: FileTree = {
        name: section,
        path: sections.slice(0, i + 1).join('/'),
        type: i === maxDepth - 1 ? 'file' : 'folder',
        children: [],
        status: status,
      }
      parent.children = parent.children.concat(newNode).sort(comparator)
      parent = newNode
    }
  }
}

const comparator = (a: FileTree, b: FileTree) => {
  if (a.type !== b.type) {
    return a.type === 'folder' ? -1 : 1
  }
  return a.name.localeCompare(b.name)
}
