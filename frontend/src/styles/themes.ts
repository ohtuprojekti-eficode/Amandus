import { ThemeOptions } from '@material-ui/core'

// Currently using some of the baseline colors from https://material.io/design/color/dark-theme.html

export const lightTheme: ThemeOptions = {
  palette: {
    type: 'light',
    primary: { main: '#6200EE' },
    secondary: { main: '#03DAC6' },
    error: { main: '#B00020' },
  },
}

export const darkTheme: ThemeOptions = {
  palette: {
    type: 'dark',
    primary: { main: '#BB86FC' },
    secondary: { main: '#03DAC6' },
    error: { main: '#CF6679' },
  },
}
