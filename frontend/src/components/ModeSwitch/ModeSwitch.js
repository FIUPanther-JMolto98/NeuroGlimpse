import React from 'react';
import { Switch, styled, Box } from '@mui/material';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';

const IconContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 24, // Increased the size for better visibility
  height: 24, // Increased the size for better visibility
  borderRadius: '50%',
  backgroundColor: theme.palette.mode === 'dark' ? '#857DB300 !important' : '#E3A1A100 !important', // Replace with your desired colors
  // boxShadow: '0 0 5px #000000', // Optional: adds shadow for depth
}));

const SunIcon = styled(WbSunnyOutlinedIcon)({
  color: '#FFFFFF', // Sun icon color
});

const MoonIcon = styled(NightsStayOutlinedIcon)({
  color: '#FFFFFF', // Moon icon color
});

// This wrapper applies custom styles to the Switch component
const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 73, // Increased size of the switch
  height: 60, // Increased size of the switch
  padding: 7, // Removed padding to allow the track to extend fully
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: '10px 7px', // Adjusted margin to center the knob vertically
    '&.Mui-checked': {
      transform: 'translateX(33px)', // Adjusted for the increased size of the switch
      '& + .MuiSwitch-track': {
        // backgroundColor: theme.palette.mode === 'dark' ? '#857DB3' : '#857DB3',
      },
    },
    width: 24, // Size of the visible knob
    height: 24, // Size of the visible knob
  },
  '& .MuiSwitch-thumb': {
    width: 24, // Size of the thumb to match IconContainer
    height: 24, // Size of the thumb to match IconContainer
    borderRadius: '50%', // Makes the thumb circular
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.mode === 'dark' ? '#857DB3 !important' : '#E3A1A1 !important',
    boxShadow: '0 0 10px gray', // Optional: adds shadow for depth
    // border: '1px solid', // Specify the border width and style here
    borderColor: theme.palette.mode === 'dark' ? '#FFFFFF !important' : '#000000 !important', // Specify border colors for dark and light modes
    borderRadius: 20, // Adjusted to ensure the track has rounded ends
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    display: 'flex',
    alignItems: 'center',
    width: '100%', // Ensures the track fills the switch
    height: 30, // Match the height of the switch base
  },
}));

const ModeSwitch = ({ checked, onChange }) => (
  <Box display="flex" alignItems="center" justifyContent="right">
    <StyledSwitch 
      checked={checked} 
      onChange={onChange}
      icon={<IconContainer><SunIcon /></IconContainer>}
      checkedIcon={<IconContainer><MoonIcon /></IconContainer>}
    />
  </Box>
);

export default ModeSwitch;