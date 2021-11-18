import { Button, createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import useEditor from './MonacoEditor/useMonacoEditor'

const ResetButtons = ({
  cloneUrl,
  filename,
}: {
  cloneUrl: string
  filename: string
}) => {
  const { mutationSaveLoading, pullLoading, resetAll, resetFile } =
    useEditor(cloneUrl)

  const classes = stylesInUse()

  const handleResetFile = async () => {
    await resetFile({
      variables: {
        url: cloneUrl,
        fileName: filename,
      },
    })
  }

  const handleReset = async () => {
    await resetAll({
      variables: {
        url: cloneUrl,
      },
    })
  }

  return (
    <>
      <Button
        style={{ marginLeft: 25 }}
        className={classes.resetButton}
        variant="outlined"
        size="small"
        disabled={pullLoading || mutationSaveLoading}
        onClick={handleResetFile}
      >
        Reset File
      </Button>
      <Button
        style={{ marginLeft: 25 }}
        className={classes.resetButton}
        variant="outlined"
        size="small"
        disabled={pullLoading || mutationSaveLoading}
        onClick={handleReset}
      >
        Reset Repo
      </Button>
    </>
  )
}

const stylesInUse = makeStyles(() =>
  createStyles({
    resetButton: {
      color: 'red',
    },
  })
)

export default ResetButtons
