import React from 'react'
import { Button, makeStyles, createStyles } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const stylesInUse = makeStyles(() =>
  createStyles({
    root: {
      background: `linear-gradient(135deg, hsla(307.46, 94.72%, 46.32%, 1) 0%, hsla(307.46, 94.72%, 46.32%, 0) 70%),
          linear-gradient(25deg, hsla(274.67, 92.84%, 45.16%, 1) 10%, hsla(274.67, 92.84%, 45.16%, 0) 80%),
          linear-gradient(315deg, hsla(256.77, 98.88%, 40.21%, 1) 15%, hsla(256.77, 98.88%, 40.21%, 0) 80%),
          linear-gradient(245deg, hsla(95.73, 93.7%, 43.15%, 1) 100%, hsla(95.73, 93.7%, 43.15%, 0) 70%)`,
      display: 'flex',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      height: 'calc(100vh - 64px)',
    },
    intro: {
      color: '#ffffff',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
    },
    heading: {
      fontSize: '5rem',
      position: 'relative',
      fontWeight: 'bold',
      letterSpacing: -2,
      marginBottom: 0,
    },
    introText: {
      fontSize: '1.6rem',
      marginTop: 0,
    },
    containedBtn: {
      backgroundColor: '#df0cc4',
      padding: '12px 0',
      fontWeight: 'bold',
      margin: '0 0.5em',
      width: 180,
    },
    outlinedBtn: {
      padding: '12px 0',
      fontWeight: 'bold',
      color: '#ffffff',
      margin: '0 0.5em',
      width: 180,
      borderColor: 'rgba(255,255,255,0.5)',
      '&:hover': {
        borderColor: '#fff',
      },
    },
  })
)

const Home = () => {
  const classes = stylesInUse()
  const history = useHistory()

  const handleClick = (path: string) => {
    return () => {
      history.push(path)
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.intro}>
        <h1 className={classes.heading}>Test automation made easy</h1>
        <p className={classes.introText}>
          Amandus is an open source web based IDE with integrated version
          control and support for Robot Framework.
        </p>

        <Button
          color="primary"
          className={classes.containedBtn}
          variant="contained"
          size="large"
          onClick={handleClick('/register')}
          disableElevation
        >
          Register
        </Button>
        <Button
          color="secondary"
          className={classes.outlinedBtn}
          variant="outlined"
          size="large"
          onClick={handleClick('/login')}
          disableElevation
        >
          Login
        </Button>
      </div>
    </div>
  )
}

export default Home
