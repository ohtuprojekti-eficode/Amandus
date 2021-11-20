import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@material-ui/core'
import React from 'react'
import { File } from '../types'
import { useFiles } from './editView/FileProvider'

const formatName = (name: string) => {
  return name.split('/').slice(4).join('/')
}

const FileSelector = () => {
  const { files, selected, setSelected } = useFiles()

  const handleChange = (file: File) => {
    setSelected((selected: string[]) => {
      const currentlySelected = selected.find(
        (fileName) => fileName === file.name
      )

      if (currentlySelected) {
        return selected.filter((fileName) => fileName !== file.name)
      } else {
        return selected.concat(file.name)
      }
    })
  }

  return (
    <div>
      <FormLabel>Select files</FormLabel>
      <FormGroup>
        {files
          .filter((f) => !!f.status)
          .map((f) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!selected?.includes(f.name)}
                  onChange={() => handleChange(f)}
                  disabled={f.status === 'U'}
                />
              }
              label={formatName(f.name)}
              key={f.name}
            />
          ))}
      </FormGroup>
    </div>
  )
}

export default FileSelector
