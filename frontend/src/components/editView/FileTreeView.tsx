import React, { useEffect, useState } from 'react'
import { ChevronRight, ExpandMore } from '@material-ui/icons'
import { TreeView } from '@material-ui/lab'
import { File, FileTree } from '../../types'
import { makeStyles } from '@material-ui/core/styles'
import { parseToFileTree } from '../../utils/files'
import StyledTreeItem from './StyledTreeItem'

interface PropsType {
  files: File[]
}

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
    marginLeft: '2px',
  },
})

const FileTreeView = ({ files }: PropsType) => {
  const [fileTree, setFileTree] = useState<FileTree>()

  const classes = useStyles()

  useEffect(() => {
    setFileTree(parseToFileTree(files))
  }, [files])

  const renderTree = (fileTree: FileTree) => {
    return fileTree.children.map((node) => buildTree(node))
  }

  const buildTree = (fileTree: FileTree) => {
    return (
      <StyledTreeItem fileTree={fileTree} key={fileTree.path}>
        {fileTree.children.length !== 0
          ? fileTree.children.map((node) => buildTree(node))
          : null}
      </StyledTreeItem>
    )
  }

  if (!fileTree) {
    return <div>No files...</div>
  }

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
    >
      {renderTree(fileTree)}
    </TreeView>
  )
}

export default FileTreeView
