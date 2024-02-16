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
      flexDirection: 'column',
      justifyContent: 'center', // Center horizontally
      alignItems: 'center', // Center vertically
      // border: '1px solid #FF0000', // Optional: Add a border to visualize the container
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
        // border: '1px solid #FF0000', // Optional: Add a border to visualize the container
        transform : 'translateY(-15%)',
      }}>
        <NeuroGlimpseLogo />    
        <TypingAnimation />  
      </Container>
      <Typography
        variant="body2"
        style={{
          position: 'absolute',
          bottom: '20px', // Adjust this value as needed to position the text closer to the bottom
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Georgia', // Example font, adjust as needed
          fontSize: 'calc(0.5vw + 0.5vh + 0.5vmin)', // Responsive size based on viewport, adjust formula as needed
          color: '#ffffff', // Text color
        }}
      >
        Made with ❤️ by Joaquin Molto (AIXplore)
      </Typography>
    </div>
  );
};

export default LandingPage;