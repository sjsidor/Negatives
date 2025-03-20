import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import PhotoGrid from './components/PhotoGrid';
import PhotoUpload from './components/PhotoUpload';
import PhotoDetail from './components/PhotoDetail';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#888888',
    },
  },
  typography: {
    fontFamily: '"Courier New", Courier, monospace',
    h1: {
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
    h2: {
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
    h3: {
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
    h4: {
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
    h5: {
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
    h6: {
      fontWeight: 400,
      letterSpacing: '0.1em',
    },
    body1: {
      letterSpacing: '0.05em',
    },
    body2: {
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh',
            width: '100vw',
            overflowX: 'hidden',
          }}
        >
          <Navbar />
          <Container 
            component="main" 
            maxWidth={false}
            sx={{ 
              flex: 1,
              py: 6,
              px: { xs: 2, sm: 3, md: 4 },
              width: '100%',
              maxWidth: '100% !important',
            }}
          >
            <Routes>
              <Route path="/" element={<PhotoGrid />} />
              <Route path="/upload" element={<PhotoUpload />} />
              <Route path="/photo/:id" element={<PhotoDetail />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
