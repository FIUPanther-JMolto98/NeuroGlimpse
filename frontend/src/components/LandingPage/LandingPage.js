// LANDING PAGE COMPONENT/WEBPAGE FOR THE REACT APPLICATION
import React from 'react';
import { Typography, Button, AppBar, Toolbar, Container } from '@mui/material';
import '../../styles/acrylicEffect.css'
import NeuroGlimpseLogo from '../NeuroGlimpseLogo/NeuroGlimpseLogo';

const LandingPage = () => {
  return (
    <div>
      <AppBar position="static">
        {/* <Toolbar>
          <Typography variant="h5">
          </Typography>
        </Toolbar> */}
      </AppBar>
      <Container maxWidth="sm" style={{ 
        marginTop: '2rem', 
        display: 'flex', // Add this
        flexDirection: 'column', // Add this to align items vertically
        alignItems: 'center', // Center items horizontally in the container
        justifyContent: 'center', // Center items vertically if you have a specific height
        height: '100vh', // Optional: Set a specific height to enable vertical centering
      }}>
        <NeuroGlimpseLogo style={{ maxWidth: '100%', height: 'auto' }} />      </Container>
    </div>
  );
};

export default LandingPage;