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
          height: '100%',
          background: `linear-gradient(135deg, hsla(307.46, 94.72%, 46.32%, 1) 0%, hsla(307.46, 94.72%, 46.32%, 0) 70%),
          linear-gradient(25deg, hsla(274.67, 92.84%, 45.16%, 1) 10%, hsla(274.67, 92.84%, 45.16%, 0) 80%),
          linear-gradient(315deg, hsla(256.77, 98.88%, 40.21%, 1) 15%, hsla(256.77, 98.88%, 40.21%, 0) 80%),
          linear-gradient(245deg, hsla(95.73, 93.7%, 43.15%, 1) 100%, hsla(95.73, 93.7%, 43.15%, 0) 70%)`
      }
    },
    intro: {
      color: '#ffffff',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1
    },
    heading: {
      fontSize: '7em',
      position: 'relative',
      fontWeight: 'bold',
      letterSpacing: -2,
      marginBottom: 0
    },
    introText: {
      fontSize: '1.6em',
      marginTop: 0
    }
  })
)

const Home = () => {

    const classes = stylesInUse()

    return (
        <div className={classes.root}>
          <div className={classes.intro}>
            <h1 className={classes.heading}>Test automation made easy</h1>
            <p className={classes.introText}>Amandus is an open source web based IDE with integrated version control and support for Robot Framework.</p>
          </div>
        </div>
    )
}

export default Home
