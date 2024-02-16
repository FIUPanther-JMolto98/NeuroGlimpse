// LANDING PAGE COMPONENT/WEBPAGE FOR THE REACT APPLICATION
import React from 'react';
import { Typography, Button, AppBar, Toolbar, Container } from '@mui/material';
import '../../styles/acrylicEffect.css'
import NeuroGlimpseLogo from '../NeuroGlimpseLogo/NeuroGlimpseLogo';
import TypingAnimation from '../TypingAnimation/TypingAnimation';

const LandingPage = ({ style }) => {
  return (
    <div style={{
      display: 'flex', // This centered the <Container> tag
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
      border: '1px solid #FF0000', // Optional: Add a border to visualize the container
      height: '100vh',
      weight: '100vw',
    }}>
      <Container maxWidth="sm" style={{ 
        display: 'flex', // Add this
        flexDirection: 'column', // Add this to align items vertically
        alignItems: 'center', // Center items horizontally in the container
        justifyContent: 'center', // Center items vertically if you have a specific height
        width: '50vw',
        height: '50vh', // Optional: Set a specific height to enable vertical centering
        border: '1px solid #FF0000', // Optional: Add a border to visualize the container
      }}>
        <NeuroGlimpseLogo />    
        <TypingAnimation />  
      </Container>
    </div>
  );
};

export default LandingPage;