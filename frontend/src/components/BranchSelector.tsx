import React, { useState } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import { SWITCH_BRANCH } from '../graphql/mutations'
import { REPO_STATE } from '../graphql/queries'
import { useMutation, useQuery } from '@apollo/client'
import { RepoStateQueryResult } from '../types'

const useStyles = makeStyles(() =>
  createStyles({
    dropdownHeader: {
      textAlign: 'right',
      textAlignLast: 'right',
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

interface Props {
  currentUrl: string
}

const BranchSelector = ({currentUrl}: Props) => {
  const classes = useStyles()
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)

  const branchState = useQuery<RepoStateQueryResult>(REPO_STATE, {
    variables: { repoUrl: currentUrl }
  })

  const selectedBranch = branchState.data?.repoState.currentBranch || ''
  const branches = branchState.data?.repoState.branches || ['']
  const repoUrl = branchState.data?.repoState.url || ''

  const [switchBranch, { loading: mutationLoading }] = useMutation(
    SWITCH_BRANCH,
    {
      refetchQueries: [{ 
        query: REPO_STATE,
        variables: {repoUrl} 
      }],
    }
  )

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget)
  }

  const handleMenuItemClick = async (branch: string) => {
    setAnchorElement(null)
    try {
      await switchBranch({
        variables: {
          url: repoUrl,
          branch: branch,
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
    <div>
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
