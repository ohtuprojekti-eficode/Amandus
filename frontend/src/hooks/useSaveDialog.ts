import { useState } from 'react'

interface DialogError {
  title: string
  message: string
}

const useSaveDialog = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [dialogError, setDialogError] = useState<DialogError | undefined>(
    undefined
  )

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  return {
    dialogOpen,
    dialogError,
    handleDialogClose,
    setDialogError,
    handleDialogOpen,
  }
}

export default useSaveDialog
