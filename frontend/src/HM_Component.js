import React, { useState, useRef } from 'react';

const HM_Component = () => {
  const [inputText, setInputText] = useState('');
  const [selectedView, setSelectedView] = useState('headView');
  const [headViewHtml, setHeadViewHtml] = useState('');
  const [modelViewHtml, setModelViewHtml] = useState('');
  const iframeRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleViewChange = (e) => {
    setSelectedView(e.target.value);
  };

  const handleVisualize = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/hm_attention', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      setHeadViewHtml(data.headView);
      setModelViewHtml(data.modelView);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleIframeLoad = () => {
    const iframeDocument = iframeRef.current.contentDocument;
    const bertvizDiv = iframeDocument.querySelector('div[id^="bertviz-"]');
    console.log(bertvizDiv);

    if (bertvizDiv) {
      const styleElement = iframeDocument.createElement('style');
      styleElement.textContent = `
        div[id^="bertviz-"] {
          background-color: transparent !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          height: 100% !important;
        }
      `;
      iframeDocument.head.appendChild(styleElement);
    }

    iframeRef.current.style.border = 'none';
  };

  return (
    <div>
      <h2>Attention Visualization</h2>
      <div>
        <label>Input Text:</label>
        <input type="text" value={inputText} onChange={handleInputChange} />
      </div>
      <div>
        <label>Select View:</label>
        <select value={selectedView} onChange={handleViewChange}>
          <option value="headView">Head View</option>
          <option value="modelView">Model View</option>
        </select>
      </div>
      <button onClick={handleVisualize}>Visualize</button>

      {(headViewHtml || modelViewHtml) && (
        <div>
          <h3>{selectedView === 'headView' ? 'Head View' : 'Model View'}</h3>
          <iframe
            ref={iframeRef}
            srcDoc={selectedView === 'headView' ? headViewHtml : modelViewHtml}
            width="100%"
            height="600px"
            onLoad={handleIframeLoad}
          />
        </div>
      )}
    </div>
  );
};

export default HM_Component;