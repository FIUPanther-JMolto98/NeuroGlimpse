import React, { useState } from 'react';
import { AppBar,  ThemeProvider, createTheme, Toolbar, Typography, Button, Menu, MenuItem, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import NeuroGlimpseLogo from '../NeuroGlimpseLogo/NeuroGlimpseLogo';

/*
*********************************************************
CUSTOM THEME DEFINITION PER BUTTON TO CHANGE RIPPLE COLOR
*********************************************************
*/

const attentionButtonTheme = createTheme({
    typography: {
        fontFamily: '"Georgia", "Helvetica", "Arial", sans-serif'
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          TouchRippleProps: {
            style: {
              color: '#ff7272',
            },
          },      
        },
      },
    },
  });

const confidenceButtonTheme = createTheme({
    typography: {
        fontFamily: '"Georgia", "Helvetica", "Arial", sans-serif'
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          TouchRippleProps: {
            style: {
              color: '#ff5e00',
            },
          },      
        },
      },
    },
  });

const counterfactualButtonTheme = createTheme({
    typography: {
        fontFamily: '"Georgia", "Helvetica", "Arial", sans-serif'
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          TouchRippleProps: {
            style: {
              color: '#ffae00',
            },
          },      
        },
      },
    },
  });

const decisionButtonTheme = createTheme({
    typography: {
        fontFamily: '"Georgia", "Helvetica", "Arial", sans-serif'
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          TouchRippleProps: {
            style: {
              color: '#00ff40',
            },
          },      
        },
      },
    },
  });

const whatifsButtonTheme = createTheme({
    typography: {
        fontFamily: '"Georgia", "Helvetica", "Arial", sans-serif'
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          TouchRippleProps: {
            style: {
              color: '#00ccff',
            },
          },      
        },
      },
    },
  });
  
/*
*******************************************************************
CUSTOM BUTTON STYLING PER BUTTON TO CHANGE UNDERLINE COLOR ON HOVER
*******************************************************************
*/

const AttentionButton = styled(Button)({
    position: 'relative', // Required for positioning the pseudo-element
    textAlign: 'center',
    '&::after': {
      content: '""', // Necessary for pseudo-elements
      position: 'absolute',
      bottom: 0, // Position the underline at the bottom of the button
      left: 0,
      width: '100%', // Span the full width of the button
      height: '2px', // Height of the underline
      backgroundColor: 'transparent', // Start with a transparent background
      transition: 'background-color 0.3s', // Smooth transition for the background color
    },
    '&:hover' : {
        backgroundColor: 'transparent',
    },
    '&:hover::after': {
        backgroundColor: '#ff7272', // Underline color on hover
    },
  });
const ConfidenceButton = styled(Button)({
    position: 'relative', // Required for positioning the pseudo-element
    textAlign: 'center',
    '&::after': {
      content: '""', // Necessary for pseudo-elements
      position: 'absolute',
      bottom: 0, // Position the underline at the bottom of the button
      left: 0,
      width: '100%', // Span the full width of the button
      height: '2px', // Height of the underline
      backgroundColor: 'transparent', // Start with a transparent background
      transition: 'background-color 0.3s', // Smooth transition for the background color
    },
    '&:hover' : {
        backgroundColor: 'transparent',
    },
    '&:hover::after': {
        backgroundColor: '#ff5e00', // Underline color on hover
    },
  });
const CounterfactualButton = styled(Button)({
    position: 'relative', // Required for positioning the pseudo-element
    textAlign: 'center',
    '&::after': {
      content: '""', // Necessary for pseudo-elements
      position: 'absolute',
      bottom: 0, // Position the underline at the bottom of the button
      left: 0,
      width: '100%', // Span the full width of the button
      height: '2px', // Height of the underline
      backgroundColor: 'transparent', // Start with a transparent background
      transition: 'background-color 0.3s', // Smooth transition for the background color
    },
    '&:hover' : {
        backgroundColor: 'transparent',
    },
    '&:hover::after': {
        backgroundColor: '#ffae00', // Underline color on hover
    },
  });
const DecisionButton = styled(Button)({
    position: 'relative', // Required for positioning the pseudo-element
    textAlign: 'center',
    '&::after': {
      content: '""', // Necessary for pseudo-elements
      position: 'absolute',
      bottom: 0, // Position the underline at the bottom of the button
      left: 0,
      width: '100%', // Span the full width of the button
      height: '2px', // Height of the underline
      backgroundColor: 'transparent', // Start with a transparent background
      transition: 'background-color 0.3s', // Smooth transition for the background color
    },
    '&:hover' : {
        backgroundColor: 'transparent',
    },
    '&:hover::after': {
        backgroundColor: '#00ff40', // Underline color on hover
    },
  });
const WhatIfButton = styled(Button)({
    position: 'relative', // Required for positioning the pseudo-element
    textAlign: 'center',
    '&::after': {
      content: '""', // Necessary for pseudo-elements
      position: 'absolute',
      bottom: 0, // Position the underline at the bottom of the button
      left: 0,
      width: '100%', // Span the full width of the button
      height: '2px', // Height of the underline
      backgroundColor: 'transparent', // Start with a transparent background
      transition: 'background-color 0.3s', // Smooth transition for the background color
    },
    '&:hover' : {
        backgroundColor: 'transparent',
    },
    '&:hover::after': {
        backgroundColor: '#00ccff', // Underline color on hover
    },
  });

const TopNavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="transparent" sx={{ boxShadow: 'none' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
          <NeuroGlimpseLogo height= '100px' width = '100px'/>
        </Link>
        </Typography>
        <ThemeProvider theme={attentionButtonTheme}>
        <AttentionButton color="inherit" component={Link} to="/attention">Attention<br /> Mechanisms</AttentionButton>
        </ThemeProvider>
         <ThemeProvider theme={confidenceButtonTheme}>
        <ConfidenceButton color="inherit" component={Link} to="/confidence">Confidence<br /> Scores</ConfidenceButton>
        </ThemeProvider>
        <ThemeProvider theme={counterfactualButtonTheme}>
        <CounterfactualButton color="inherit" component={Link} to="/counterfactuals">Counterfactual<br /> Explanations</CounterfactualButton>
        </ThemeProvider>
        <ThemeProvider theme={decisionButtonTheme}>
        <DecisionButton color="inherit" component={Link} to="/decisionpath">Decision Path<br /> Visualizations</DecisionButton>
        </ThemeProvider>
        <ThemeProvider theme={whatifsButtonTheme}>
        <WhatIfButton color="inherit" component={Link} to="/whatif">Interactive<br /> What-Ifs</WhatIfButton>
        </ThemeProvider>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;