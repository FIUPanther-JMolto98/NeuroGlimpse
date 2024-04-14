import React, { useState, useRef } from 'react';
import { Box, TextField, Button, Grid } from '@mui/material';

const N_Component = () => {
  const [sentenceA, setSentenceA] = useState('');
  const [sentenceB, setSentenceB] = useState('');
  const [layer, setLayer] = useState(0);
  const [head, setHead] = useState(0);
  const [neuronViewHtml, setNeuronViewHtml] = useState('');
  const iframeRef = useRef(null);

  const handleSentenceAChange = (e) => {
    setSentenceA(e.target.value);
  };

  const handleSentenceBChange = (e) => {
    setSentenceB(e.target.value);
  };

  const handleLayerChange = (e) => {
    setLayer(parseInt(e.target.value));
  };

  const handleHeadChange = (e) => {
    setHead(parseInt(e.target.value));
  };

  const handleVisualize = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/n_attention', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sentence_a: sentenceA,
          sentence_b: sentenceB,
          layer: layer,
          head: head,
        }),
      });

      const data = await response.json();
      setNeuronViewHtml(data.neuronView);
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
    <Box p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Sentence A"
            variant="outlined"
            value={sentenceA}
            onChange={handleSentenceAChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Sentence B"
            variant="outlined"
            value={sentenceB}
            onChange={handleSentenceBChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleVisualize} fullWidth>
            Visualize
          </Button>
        </Grid>
      </Grid>
      {neuronViewHtml && (
        <Box mt={2}>
          <iframe
            ref={iframeRef}
            srcDoc={neuronViewHtml}
            width="100%"
            height="600px"
            onLoad={handleIframeLoad}
            frameBorder="0"
          />
        </Box>
      )}
    </Box>
  );
};

export default N_Component;