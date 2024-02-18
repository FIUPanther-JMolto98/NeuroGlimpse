import React from 'react';
import * as d3 from 'd3';

const InputHighlighting = ({ tokens, attentionScores }) => {
  // Use D3's color scale for consistency with the heatmap
  const colorScale = d3.scaleSequential(d3.interpolateInferno)
                       .domain([0, 1]); // Assuming scores are normalized

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {tokens.map((token, index) => {
        const score = attentionScores[index];
        // Ensure score is a number and within the expected range
        const validScore = !isNaN(score) && score >= 0 && score <= 1 ? score : 0;
        return (
          <span key={index} style={{ backgroundColor: colorScale(validScore), padding: '2px 5px', borderRadius: '5px', color: '#fff' }}>
            {token}
          </span>
        );
      })}
    </div>
  );
};

export default InputHighlighting;