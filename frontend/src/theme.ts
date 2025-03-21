import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#888888',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
    h1: {
      fontWeight: 300,
      letterSpacing: '0.05em',
    },
    h2: {
      fontWeight: 300,
      letterSpacing: '0.05em',
    },
    h3: {
      fontWeight: 300,
      letterSpacing: '0.05em',
    },
    h4: {
      fontWeight: 300,
      letterSpacing: '0.05em',
    },
    h5: {
      fontWeight: 300,
      letterSpacing: '0.05em',
    },
    h6: {
      fontWeight: 300,
      letterSpacing: '0.05em',
    },
    button: {
      fontWeight: 300,
      letterSpacing: '0.1em',
      textTransform: 'none',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          boxShadow: 'none',
          borderBottom: '1px solid #333333',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          border: '1px solid #333333',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
          },
        },
      },
    },
  },
});

export default theme; 