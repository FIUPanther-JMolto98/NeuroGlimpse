// TopNavBarButton.js
import { Button, styled } from '@mui/material';

const TopNavBarButton = styled(Button)({
  // Default state styles
  background: 'transparent',
  color: 'inherit', // Use the current text color
  textDecoration: 'none',

  // Hover state styles
  '&:hover': {
    background: 'transparent', // Keep the background transparent on hover
    textDecoration: 'underline', // Add underline on hover
    textDecorationColor: '#FF0000', // Customize the underline color
    textDecorationThickness: '2px', // Customize the underline thickness
  },
});

export default TopNavBarButton;