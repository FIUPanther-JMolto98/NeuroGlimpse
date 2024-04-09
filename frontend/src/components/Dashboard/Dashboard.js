import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import Widget from './Widget';
import OutputPD from '../OutputPD/OutputPD';
import AttentionHeatmap from '../AttentionHeatmap/AttentionHeatmap';
import POSTaggingWidget from '../POSTagging/POSTagging';
import WordEmbeddingDistance from '../WordEmbeddingDistance/WordEmbeddingDistance';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './Dashboard.css';

const Dashboard = () => {
  // Initial layout configuration to prevent overlap and allow for more space
  const initialLayout = [
    { i: 'widget1', x: 0, y: 0, w: 2, h: 4 },
    { i: 'widget2', x: 3, y: 0, w: 2, h: 4 },
    { i: 'widget3', x: 6, y: 0, w: 2, h: 4 }, // Adjust 'x', 'y', 'w', 'h' as needed
    // Ensure 'x', 'y', 'w', and 'h' are configured so widgets do not overlap
    // Adjust 'w' and 'h' to control widget size
    // Adjust 'x' and 'y' to position widgets without overlap
  ];

  const [layout, setLayout] = useState(initialLayout);
  const [minimizedWidgets, setMinimizedWidgets] = useState({});

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
      cols={25}
      rowHeight={30} // Adjust for desired height
      width={1920}
      margin={[30, 30]} // Increased space between widgets
      draggableHandle=".draggable-area"
      isResizable={false} // Disable resizing
      compactType={null}
    >
      
      <div key="widget1">
        <Widget
          title="Output Probability"
          backgroundColor="#ffffff00"
          borderColor="#43474E"
          titleBarColor="#70d87000"
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
          titleBarColor="#d8707000"
          isMinimized={!!minimizedWidgets['widget2']}
          onToggle={() => toggleMinimize('widget2')}
        >
          <AttentionHeatmap />
        </Widget>
      </div>
      <div key="widget3">
        <Widget
          title="Embedding Distance"
          backgroundColor="#ffffff00"
          borderColor="#43474E"
          titleBarColor="#7070d800" // Choose a color that fits your design
          isMinimized={!!minimizedWidgets['widget3']}
          onToggle={() => toggleMinimize('widget3')}
        >
          <WordEmbeddingDistance />
        </Widget>
      </div>
      {/* Repeat for any additional widgets */}
    </GridLayout>
  );
};

export default Dashboard;