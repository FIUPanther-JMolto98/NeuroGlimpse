// In src/components/LandingPage.js
import React from 'react';
import { Typography, Button, AppBar, Toolbar, Container } from '@mui/material';
import '../../styles/acrylicEffect.css'

const LandingPage = () => {
  return (
    <div>
      <AppBar position="static">
        {/* <Toolbar>
          <Typography variant="h5">
            NeuroGlimpse
          </Typography>
        </Toolbar> */}
      </AppBar>
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        {/* <Typography variant="h2" component="h1" gutterBottom>
          NeuroGlimpse 
        </Typography> */}
        {/* <Typography variant="h5" component="h2" gutterBottom>
          Dive into the world of NLP with NeuroGlimpse.
        </Typography> */}
        {/* <Button variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Get Started
        </Button> */}
      </Container>
    </div>
  );
};

export default LandingPage;