import React from 'react'
import {
  Grid,
  TextField,
  Button,
  makeStyles,
  createStyles,
} from '@material-ui/core'


const stylesInUse = makeStyles((theme) =>
  createStyles({
    root: {
      backgroundColor: '#6200EE',
      backgroundImage: `url(${process.env.PUBLIC_URL}/img/cool-background.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      display: 'flex',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'calc(100vh - 64px)',
      '&::after': {
          content: '""',
          display: 'block',
          position: 'absolute',
          width: '100%',
          height: '100%'
      }
    },
  })
)

const Home = () => {

    const classes = stylesInUse()

    return (
        <div className={classes.root}>
            <p>JEee</p>
        </div>
    )
}

export default Home
