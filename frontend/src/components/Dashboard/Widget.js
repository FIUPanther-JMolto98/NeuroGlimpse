import React, { useState } from 'react';
import './Dashboard.css';
import { IoIosStats, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const Widget = ({
  title,
  children,
  borderColor = '#ffffff00',
  backgroundColor = '#ffffff00',
  titleBarColor = '#ffffff00',
  onToggle,
  isMinimized,
  onSizeChange // Assuming this prop is passed from the parent component
}) => {
// Define minimum dimensions
const minSize = { width: 250, height: 150 }; // Adjust as needed

// State to manage dynamic content size, initialized to minimum dimensions
const [contentSize, setContentSize] = useState(minSize);

// Adjust widget style based on content size or minimum size
const widgetStyle = {
  border: `2px solid ${borderColor}`,
  backgroundColor,
  borderRadius: '5px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  width: `${Math.max(contentSize.width, minSize.width)}px`, // Use the larger of content width or minimum width
  height: `${Math.max(contentSize.height, minSize.height*2)}px`, // Same for height
};
  // Handle dynamic size change
  const handleSizeChange = (width, height) => {
    setContentSize({ width, height });
    if (typeof onSizeChange === 'function') {
      // Optionally propagate size change further up if needed
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
    marginRight: '30px', // Adjust based on the size of your toggle icon area
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
      {!isMinimized && React.cloneElement(children, { onSizeChange: handleSizeChange })}
    </div>
  );
};

export default Widget;