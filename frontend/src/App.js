// APP.JS COMPONENT: MAIN ENTRY POINT FOR THE APPLICATION'S FRONT-END CONTENT
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import NeuroGlimpseLogo from './components/NeuroGlimpseLogo/NeuroGlimpseLogo';
import NeuroGlimpse from './components/NeuroGlimpseLogo/NeuroGlimpse.svg';
import { ThemeProvider, Typography, Button, AppBar, Toolbar, Container } from '@mui/material';
import getTheme from './themes/getTheme';
import TopNavBar from './components/TopNavBar/TopNavBar';
import TopNavBarButton from './themes/TopNavBarButton';
import Dashboard from './components/Dashboard/Dashboard';
import OutputPD from './components/OutputPD/OutputPD';
import HeatmapVisualization from './components/AttentionHeatmap/AttentionHeatmap';
import ModeSwitch from './components/ModeSwitch/ModeSwitch';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage/LandingPage';
import InteractiveWhatIf from './components/InteractiveWhatIf/InteractiveWhatIf';
import ConfidenceScores from './components/ConfidenceScores/ConfidenceScores';
import CounterfactualExplanations from './components/CounterfactualExplanations/CounterfactualExplanations';
import DecisionPathVisualization from './components/DecisionPathVisualization/DecisionPathVisualization';
import AttentionMechanismInsights from './components/AttentionMechanismInsights/AttentionMechanismInsights';
import AttentionHeatmap from './components/AttentionHeatmap/AttentionHeatmap';
import WordEmbeddingDistance from './components/WordEmbeddingDistance/WordEmbeddingDistance';

function App() {
  // MANAGE LIGHT/DARK MODE STATE USING A REACT HOOK
  const [mode, setMode] = React.useState('dark');
  const theme = getTheme(mode);
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <Router>
          <TopNavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attention" element={<AttentionMechanismInsights />} />
          <Route path="/confidence" element={<ConfidenceScores />} />
          <Route path="/counterfactuals" element={<CounterfactualExplanations />} />
          <Route path="/decisionpath" element={<DecisionPathVisualization />} />
          <Route path="/whatif" element={<InteractiveWhatIf />} />
          <Route path="/outputpd" element={<OutputPD />} />
          <Route path="/attnheatmap" element={<AttentionHeatmap />} />
          <Route path="/wordembedding" element={<WordEmbeddingDistance />} />
        </Routes>
      </Router>
        <div style = {{
          // border: '1px solid #FF0000', // Optional: Add a border to visualize the container
        }}>
        </div>
        {/* <LandingPage /> */}
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