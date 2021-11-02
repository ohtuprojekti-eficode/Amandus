import React from "react"
import { 
    Button,
    Dialog, 
    DialogActions, 
    DialogTitle, 
} from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

interface Error {
    title: string
    message: string
  }
  
interface Props {
    open: boolean
    handleClose: () => void,
    handleSubmit: () => void
    error: Error | undefined
  }
  

const PullDialog = ({
    open,
    handleClose,
    handleSubmit,
    error    
}: Props) => {

    return (
        <Dialog 
        open={open}
        >
            <DialogTitle id="form-dialog-title">Save changes</DialogTitle>
            {error && <Alert severity="error">
            <AlertTitle>{error.title}</AlertTitle>
            {error.message}
          </Alert>}
          <DialogActions>
                <Button 
                    variant="outlined"
                    onClick={handleClose}
                    >
                    Cancel
                </Button>
                <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={handleSubmit}
                    >
                    Commit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PullDialog