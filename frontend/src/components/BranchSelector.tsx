import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { SWITCH_BRANCH } from '../graphql/mutations'
import { REPO_STATE } from '../graphql/queries'
import { useMutation } from '@apollo/client'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },

    dropdownHeader: {
      textAlign: 'right' as 'right',
      textAlignLast: 'right' as 'right',
    },

    dropdown: {
      border: '2px solid black',
      padding: '0',
      margin: '0',
    },

    onBranch: {
      marginRight: '15%',
    },

    branchWrapper: {
      maxHeight: '10vh',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  })
)

interface PropsType {
  branches: string[]
  repoUrl: string
}

const BranchSelector = ({ repoUrl, branches }: PropsType) => {
  const classes = useStyles()
  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(
    null
  )
  const [selectedBranch, setSelectedBranch] = React.useState('master')

  const [switchBranch, { loading: mutationLoading }] = useMutation(
    SWITCH_BRANCH,
    {
      refetchQueries: [{ query: REPO_STATE }],
    }
  )

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleMenuItemClick = async (branch: string) => {
    setSelectedBranch(branch)
    setAnchorElement(null)
    console.log('RepoURL:', repoUrl)
    console.log('branch:', selectedBranch)
    try {
      await switchBranch({
        variables: {
          url: { repoUrl },
          branch: { branch },
        },
      })
    } catch (error) {
      console.log('ERROR:', error)
    }
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
          className={classes.branchWrapper}
          disabled={mutationLoading}
        >
          <ListItemText className={classes.onBranch}>on branch:</ListItemText>
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
