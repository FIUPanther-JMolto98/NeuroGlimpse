import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import Widget from './Widget'; // Import the Widget component
import OutputPD from '../OutputPD/OutputPD';
import AttentionHeatmap from '../AttentionHeatmap/AttentionHeatmap';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Dashboard.css';

const Dashboard = () => {
  const [layout, setLayout] = useState([
    { i: 'widget1', x: 0, y: 0, w: 2, h: 2 },
    { i: 'widget2', x: 2, y: 0, w: 2, h: 2 },
    // ... more widgets
  ]);

  // State to track minimized widgets
  const [minimizedWidgets, setMinimizedWidgets] = useState({});

  // Function to toggle minimized state of widgets
  const toggleMinimize = (widgetId) => {
    setMinimizedWidgets(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId],
    }));
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      draggableHandle=".draggable-area" // Specify the draggable handle
    >
      
      <div key="widget1">
        <Widget 
          title="Output Probability"
          backgroundColor="#ffffff00"
          borderColor="#43474E"
          titleBarColor="#70d870"
          isMinimized={!!minimizedWidgets['widget1']}
          onToggle={() => toggleMinimize('widget1')}
        >
          <OutputPD />
        </Widget>
      </div>
      <div key="widget2">
        <Widget 
          title="Attention Heatmap"
          backgroundColor="#ffffff00"
          borderColor="#43474E"
          titleBarColor="#d87070"
          isMinimized={!!minimizedWidgets['widget2']}
          onToggle={() => toggleMinimize('widget2')}
        >
          <AttentionHeatmap />
        </Widget>
      </div>
      {/* Repeat for any additional widgets */}
    </GridLayout>
  );
};

export default Dashboard;