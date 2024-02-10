// APP.JS COMPONENT: MAIN ENTRY POINT FOR THE APPLICATION'S FRONT-END CONTENT
import React from 'react';
import './App.css';
import NeuroGlimpseLogo from './components/NeuroGlimpseLogo/NeuroGlimpseLogo';
import { ThemeProvider } from '@mui/material/styles';
import getTheme from './themes/getTheme';
import ModeSwitch from './components/ModeSwitch/ModeSwitch';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage/LandingPage';
import Button from '@mui/material/Button';

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
        <ModeSwitch 
          checked={mode === 'dark'}
          onChange={toggleMode}
        />
        <NeuroGlimpseLogo style={{ width: '500px', height: '500px' }} />
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