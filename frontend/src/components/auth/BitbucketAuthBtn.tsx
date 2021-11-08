import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery } from '@apollo/client'
import { BITBUCKET_LOGIN_URL } from '../../graphql/queries'
import { BitbucketLoginURLQueryResult } from '../../types'

interface AuthBtnProps {
  connected: boolean
}

const useStyles = makeStyles({
  imageIcon: {
    display: 'flex',
    width: '1em',
    height: '1em',
  },
})

const BitbucketAuthBtn = ({ connected }: AuthBtnProps) => {
  const { data, error } =
    useQuery<BitbucketLoginURLQueryResult>(BITBUCKET_LOGIN_URL)
  const classes = useStyles()

  const btnClickHandler = (): void => {
    window.location.href = data!.bitbucketLoginUrl
  }

  if (error || !data) {
    return <></>
  }

  const bitbucketIcon = (
    <img
      className={classes.imageIcon}
      alt="Bitbucket icon"
      src="/img/mark-gradient-blue-bitbucket.svg"
    />
  )

  return (
    <div>
      <Button
        id="bitbucketAuthButton"
        startIcon={bitbucketIcon}
        variant="contained"
        color="primary"
        onClick={btnClickHandler}
        disabled={connected}
      >
        {connected ? 'Bitbucket connected' : 'Connect Bitbucket'}
      </Button>
    </div>
  )
}

export default BitbucketAuthBtn
