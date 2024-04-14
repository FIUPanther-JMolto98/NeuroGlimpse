import React, { useState } from 'react';

const N_Component = () => {
  const [sentenceA, setSentenceA] = useState('');
  const [sentenceB, setSentenceB] = useState('');
  const [layer, setLayer] = useState(2);
  const [head, setHead] = useState(0);
  const [neuronViewHtml, setNeuronViewHtml] = useState('');

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

  return (
    <div>
      <h2>Neuron View Visualization</h2>
      <div>
        <label>Sentence A:</label>
        <input type="text" value={sentenceA} onChange={handleSentenceAChange} />
      </div>
      <div>
        <label>Sentence B:</label>
        <input type="text" value={sentenceB} onChange={handleSentenceBChange} />
      </div>
      <div>
        <label>Layer:</label>
        <input type="number" value={layer} onChange={handleLayerChange} />
      </div>
      <div>
        <label>Head:</label>
        <input type="number" value={head} onChange={handleHeadChange} />
      </div>
      <button onClick={handleVisualize}>Visualize</button>

      {neuronViewHtml && (
        <div>
          <h3>Neuron View</h3>
          <iframe srcDoc={neuronViewHtml} width="100%" height="600px" />
        </div>
      )}
    </div>
  );
};

export default N_Component;