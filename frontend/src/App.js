// APP.JS COMPONENT: MAIN ENTRY POINT FOR THE APPLICATION'S FRONT-END CONTENT
import React from 'react';
import './App.css';
import NeuroGlimpseLogo from './components/NeuroGlimpseLogo/NeuroGlimpseLogo';
import { ThemeProvider, Typography, Button, AppBar, Toolbar, Container } from '@mui/material';
import getTheme from './themes/getTheme';
import ModeSwitch from './components/ModeSwitch/ModeSwitch';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage/LandingPage';

function App() {
  // MANAGE LIGHT/DARK MODE STATE USING A REACT HOOK
  const [mode, setMode] = React.useState('light');
  const theme = getTheme(mode);
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        {/* <div style = {{
          border: '1px solid #FF0000', // Optional: Add a border to visualize the container
        }}> */}
        <ModeSwitch 
          checked={mode === 'dark'}
          onChange={toggleMode}
        />
        {/* </div> */}
        <LandingPage />
    </ThemeProvider>
  );
}

export default App;

// import logo from './logo.svg';
// import './App.css';
// import Button from '@mui/material/Button';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//         <Button variant="contained">Hello World</Button>
//       </header>
//     </div>
//   );
// }

// export default App;