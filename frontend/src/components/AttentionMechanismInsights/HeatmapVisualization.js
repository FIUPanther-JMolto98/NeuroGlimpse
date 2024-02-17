import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HeatmapVisualization = ({ attentionData }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (attentionData && d3Container.current) {
      // Simplified: Focus on the first head of the first layer for demonstration
      const scores = attentionData[0][0][0]; // Adjust based on actual structure and layer/head of interest
      
      // Debugging: Log to ensure we're extracting correctly
      console.log('Extracted Scores:', scores);

      const margin = { top: 20, right: 0, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      // Clear any existing SVG to prevent duplicates
      d3.select(d3Container.current).selectAll("*").remove();

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create color scale
      const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, 1]); // Assuming scores are normalized between 0 and 1

      // Render the heatmap
      const blockSize = width / scores.length;
      scores.forEach((row, i) => {
        row.forEach((score, j) => {
          svg.append('rect')
            .attr('x', j * blockSize)
            .attr('y', i * blockSize)
            .attr('width', blockSize)
            .attr('height', blockSize)
            .style('fill', colorScale(score));
        });
      });
    }
  }, [attentionData]); // Dependency array to re-render on data change

  return <div ref={d3Container} />;
};

export default HeatmapVisualization;