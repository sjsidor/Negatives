import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <DownhillSkiingIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            letterSpacing: '0.2em',
          }}
        >
          sjsidor
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Gallery
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/upload"
            sx={{ letterSpacing: '0.1em' }}
          >
            Upload
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 