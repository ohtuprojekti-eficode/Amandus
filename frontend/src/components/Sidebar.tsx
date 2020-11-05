import React from 'react'
import { Drawer, Toolbar } from '@material-ui/core'
import ListView from './ListView'
import { File } from '../types'

interface Props {
  files: File[]
}

const Sidebar = ({ files }: Props) => {
  return (
    <Drawer variant="permanent" PaperProps={{ style: { width: 400 } }}>
      <Toolbar />
      <ListView files={files} />
    </Drawer>
  )
}

export default Sidebar
