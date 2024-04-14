import React, { useState } from 'react';
import '../Dashboard/Dashboard.css';
import { IoIosStats, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import N_Component from './N_Component';

const NeuronViewWidget = ({
  title,
  borderColor = '#ffffff00',
  backgroundColor = '#ffffff00',
  titleBarColor = '#ffffff00',
  onToggle,
  isMinimized,
  onSizeChange
}) => {
  const minSize = { width: 250, height: 150 };
  const [contentSize, setContentSize] = useState(minSize);

  const widgetStyle = {
    border: `2px solid ${borderColor}`,
    backgroundColor,
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: `1000px`,
    height: `500px`,
  };

  const handleSizeChange = (width, height) => {
    setContentSize({ width, height });
    if (typeof onSizeChange === 'function') {
      onSizeChange(width, height);
    }
  };

  const titleBarStyle = {
    backgroundColor: titleBarColor,
    padding: '5px',
    borderBottom: `1px solid ${borderColor}`,
    cursor: 'move',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const draggableAreaStyle = {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    cursor: 'move',
    marginRight: '30px',
  };

  return (
    <div className="widget" style={widgetStyle}>
      <div className="widget-title-bar" style={titleBarStyle}>
        <div className="draggable-area" style={draggableAreaStyle}>
          <IoIosStats style={{ marginRight: '10px' }} />
          <span>{title}</span>
        </div>
        <div onClick={onToggle} style={{ cursor: 'pointer' }}>
          {isMinimized ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
      </div>
      {!isMinimized && (
        <div style={{ height: '100%', width: '100%' }}>
          <N_Component onSizeChange={handleSizeChange} />
        </div>
      )}
    </div>
  );
};

export default NeuronViewWidget;