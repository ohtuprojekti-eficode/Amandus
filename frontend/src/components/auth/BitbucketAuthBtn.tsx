import React from 'react'
import Button from '@material-ui/core/Button'
import { useQuery } from '@apollo/client'
import { BITBUCKET_LOGIN_URL } from '../../graphql/queries'
import { BitbucketLoginURLQueryResult } from '../../types'

const BitbucketAuthBtn = () => {
  const { data, error } = useQuery<BitbucketLoginURLQueryResult>(BITBUCKET_LOGIN_URL)

  const btnClickHandler = (): void => {
    window.location.href = data!.bitbucketLoginUrl
  }

  if (error || !data) {
    return <></>
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={btnClickHandler}
      >
        Connect Bitbucket
      </Button>
    </div>
  )
}

export default BitbucketAuthBtn
