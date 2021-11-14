import React from 'react'
import { Drawer, Toolbar } from '@material-ui/core'
import FileTreeView from './FileTreeView'
import { File } from '../../types'
import BranchSelector from './BranchSelector'

interface Props {
  files: File[]
  currentUrl: string | undefined
}

const Sidebar = ({ files, currentUrl }: Props) => {
  if (!currentUrl) return null

  return (
    <Drawer variant="permanent" PaperProps={{ style: { width: '20%' } }}>
      <Toolbar />
      <BranchSelector currentUrl={currentUrl}/>
      <FileTreeView files={files} />
    </Drawer>
  )
}

export default Sidebar
