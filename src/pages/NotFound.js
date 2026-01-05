import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 80,
            color: 'error.main',
            marginBottom: 2,
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontSize: '72px',
            fontWeight: 'bold',
            marginBottom: 2,
            color: '#333',
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            marginBottom: 2,
            color: '#666',
            fontWeight: 500,
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            color: '#999',
            fontSize: '16px',
          }}
        >
          The page you are looking for does not exist.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Go to Form
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;
