import React, { useState } from 'react';
import HeadView from './head_view';
import ModelView from './model_view';
import NeuronView from './neuron_view';

const HMN_Visualization = () => {
  const [selectedView, setSelectedView] = useState('head');

  const renderSelectedView = () => {
    switch (selectedView) {
      case 'head':
        return <HeadView />;
      case 'model':
        return <ModelView />;
      case 'neuron':
        return <NeuronView />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setSelectedView('head')}>Head View</button>
        <button onClick={() => setSelectedView('model')}>Model View</button>
        <button onClick={() => setSelectedView('neuron')}>Neuron View</button>
      </div>
      {renderSelectedView()}
    </div>
  );
};

export default HMN_Visualization;