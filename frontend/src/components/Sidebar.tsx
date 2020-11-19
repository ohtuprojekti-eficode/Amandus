import React from 'react'
import { Drawer, Toolbar } from '@material-ui/core'
import FileTreeView from './FileTreeView'
import { File } from '../types'
import BranchSelector from './BranchSelector'

interface Props {
  files: File[]
  branches: string[]
}

const Sidebar = ({ files, branches }: Props) => {
  return (
    <Drawer variant="permanent" PaperProps={{ style: { width: '20%' } }}>
      <Toolbar />
      <BranchSelector branches={branches} />
      <FileTreeView files={files} />
    </Drawer>
  )
}

export default Sidebar
