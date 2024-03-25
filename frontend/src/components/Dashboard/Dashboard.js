import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import OutputPD from '../OutputPD/OutputPD';
import AttentionHeatmap from '../AttentionHeatmap/AttentionHeatmap';
import './Dashboard.css'; // Import the CSS file here

const Dashboard = () => {
  // Layout for widgets: [x, y, w, h]
  const layout = [
    {i: 'widget1', x: 0, y: 0, w: 2, h: 2},
    {i: 'widget2', x: 2, y: 0, w: 2, h: 2},
    // Add more widgets as needed
  ];

  return (
    <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
      <div key="widget1">
        <OutputPD />
      </div>
      <div key="widget2">
        <AttentionHeatmap />
      </div>
      {/* Add more widget components */}
    </GridLayout>
  );
};

export default Dashboard;