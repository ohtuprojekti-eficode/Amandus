import { parseToFileTree, addToFileTree } from '../utils/files'
import { File, FileTree } from '../types'

describe('Add to file tree', () => {
  const expectedTree: FileTree = {
    name: 'src',
    path: 'src',
    type: 'root',
    children: [
      {
        name: 'folder1',
        path: 'src/folder1',
        type: 'folder',
        children: [
          {
            name: 'new_file.txt',
            path: 'src/folder1/new_file.txt',
            type: 'file',
            children: [],
          },
        ],
      },
      { name: 'folder2', path: 'src/folder2', type: 'folder', children: [] },
      { name: 'index.ts', path: 'src/index.ts', type: 'file', children: [] },
    ],
  }
  it('adds a file to the tree', () => {
    const tree: FileTree = {
      name: 'src',
      path: 'src',
      type: 'root',
      children: [
        { name: 'folder1', path: 'src/folder1', type: 'folder', children: [] },
        { name: 'folder2', path: 'src/folder2', type: 'folder', children: [] },
        { name: 'index.ts', path: 'src/index.ts', type: 'file', children: [] },
      ],
    }
    addToFileTree(tree, 'src/folder1/new_file.txt', 1)
    expect(tree).toEqual(expectedTree)
  })
  it('adds file and required folders to tree', () => {
    const tree: FileTree = {
      name: 'src',
      path: 'src',
      type: 'root',
      children: [
        { name: 'index.ts', path: 'src/index.ts', type: 'file', children: [] },
        { name: 'folder2', path: 'src/folder2', type: 'folder', children: [] },
      ],
    }
    addToFileTree(tree, 'src/folder1/new_file.txt', 1)
    expect(tree).toEqual(expectedTree)
  })
})

describe('Parse to file tree', () => {
  const files: File[] = [
    { name: 'project/src/index.js', content: 'a' },
    { name: 'project/src/index/test.txt', content: 'b' },
    { name: 'project/src/tests/test2.ts', content: 'c' },
    { name: 'project/src/tests/test.js', content: 'd' },
  ]

  it('returns a tree describing the directory structure', () => {
    const tree: FileTree = {
      name: 'project/src',
      path: 'project/src',
      type: 'root',
      children: [
        {
          name: 'index',
          path: 'project/src/index',
          type: 'folder',
          children: [
            {
              name: 'test.txt',
              path: 'project/src/index/test.txt',
              type: 'file',
              children: [],
            },
          ],
        },
        {
          name: 'tests',
          path: 'project/src/tests',
          type: 'folder',
          children: [
            {
              name: 'test.js',
              path: 'project/src/tests/test.js',
              type: 'file',
              children: [],
            },
            {
              name: 'test2.ts',
              path: 'project/src/tests/test2.ts',
              type: 'file',
              children: [],
            },
          ],
        },
        {
          name: 'index.js',
          path: 'project/src/index.js',
          type: 'file',
          children: [],
        },
      ],
    }
    expect(parseToFileTree(files)).toEqual(tree)
  })
  it('returns a different tree when root offset is changed', () => {
    const tree: FileTree = {
      name: 'project',
      path: 'project',
      type: 'root',
      children: [
        {
          name: 'src',
          path: 'project/src',
          type: 'folder',
          children: [
            {
              name: 'index',
              path: 'project/src/index',
              type: 'folder',
              children: [
                {
                  name: 'test.txt',
                  path: 'project/src/index/test.txt',
                  type: 'file',
                  children: [],
                },
              ],
            },
            {
              name: 'tests',
              path: 'project/src/tests',
              type: 'folder',
              children: [
                {
                  name: 'test.js',
                  path: 'project/src/tests/test.js',
                  type: 'file',
                  children: [],
                },
                {
                  name: 'test2.ts',
                  path: 'project/src/tests/test2.ts',
                  type: 'file',
                  children: [],
                },
              ],
            },
            {
              name: 'index.js',
              path: 'project/src/index.js',
              type: 'file',
              children: [],
            },
          ],
        },
      ],
    }
    expect(parseToFileTree(files, 1)).toEqual(tree)
  })
})
