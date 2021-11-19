import React, { ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Build, ErrorOutline } from '@material-ui/icons'
import { FileTree } from '../../types'
import { TreeItem } from '@material-ui/lab'

const stylesInUse = makeStyles((theme) =>
  createStyles({
    modifiedLabel: {
      color:
        theme.palette.type === 'light'
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
    },
    conflictedLabel: {
      color: 'red',
    },
  })
)

const StyledTreeItem = (props: { fileTree: FileTree; children: ReactNode }) => {
  const history = useHistory()
  const classes = stylesInUse()

  const handleClick = (path: string, type: string) => {
    if (type === 'folder') {
      return () => {}
    }
    return () => {
      history.push(`edit?q=${path}`)
    }
  }

  const attributes = (status: string | null, type: string) => {
    if (type === 'folder') return

    var attr = {}
    switch (status) {
      case 'M':
        attr = {
          endIcon: <Build />,
          classes: { label: classes.modifiedLabel },
        }
        break
      case 'U':
        attr = {
          endIcon: <ErrorOutline/>,
          classes: { label: classes.conflictedLabel },
        }
        break
      default:
        return
    }

    return attr
  }

  return (
    <TreeItem
      {...attributes(props.fileTree.status, props.fileTree.type)}
      nodeId={props.fileTree.path}
      onClick={handleClick(props.fileTree.path, props.fileTree.type)}
      label={props.fileTree.name}
    >
      {props.children}
    </TreeItem>
  )
}

export default StyledTreeItem
