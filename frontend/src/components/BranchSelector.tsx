import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },

    dropdownHeader: {
      textAlignLast: 'right' as 'right',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    dropdown: {
      border: '2px solid black',
    },
  })
)

interface PropsType {
  branches: string[]
}

const BranchSelector = ({ branches }: PropsType) => {
  const classes = useStyles()
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  )
  const [selectedBranch, setSelectedBranch] = React.useState('master')

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleMenuItemClick = (branch: string) => {
    setSelectedBranch(branch)
    setAnchorElement(null)
  }

  const handleClose = () => {
    setAnchorElement(null)
  }

  return (
    <div className={classes.root}>
      <List component="nav" className={classes.dropdown}>
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={handleClickListItem}
        >
          <ListItemText>on branch:</ListItemText>
          <ListItemText
            className={classes.dropdownHeader}
            primary={selectedBranch}
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorElement}
        keepMounted
        open={Boolean(anchorElement)}
        onClose={handleClose}
      >
        {branches.map((branch) => (
          <MenuItem
            key={branch}
            selected={branch === selectedBranch}
            onClick={() => handleMenuItemClick(branch)}
          >
            {branch}
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}

export default BranchSelector
