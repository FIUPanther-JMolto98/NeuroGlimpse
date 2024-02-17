import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HeatmapVisualization = ({ attentionData }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (attentionData && d3Container.current) {
      const scores = attentionData[0][0][0]; // Simplify for demonstration
      
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      d3.select(d3Container.current).selectAll("*").remove();

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right + 100) // Extra space for legend
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, 1]);

      const blockSize = width / scores.length;
      scores.forEach((row, i) => {
        row.forEach((score, j) => {
          svg.append('rect')
            .attr('x', j * blockSize)
            .attr('y', i * blockSize)
            .attr('width', blockSize)
            .attr('height', blockSize)
            .style('fill', colorScale(score));
          
          svg.append('text')
            .attr('x', j * blockSize + blockSize / 2)
            .attr('y', i * blockSize + blockSize / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(score.toFixed(2))
            .style('fill', 'white');
        });
      });

      // Vertical legend to the right of the heatmap
      const legendHeight = height;
      const legendWidth = 20; // Thickness of the legend
      const legendSvg = svg.append('g')
        .attr('transform', `translate(${width + margin.right + 20}, 0)`); // Position to the right of heatmap

      const linearGradient = legendSvg.append('defs')
        .append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0%')
        .attr('y1', '100%') // Start of the gradient at the bottom
        .attr('x2', '0%')
        .attr('y2', '0%'); // End of the gradient at the top

      linearGradient.selectAll('stop')
        .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
        .enter().append('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color);

      legendSvg.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#linear-gradient)');

      // Legend labels for 0 and 1 with white font
      legendSvg.append('text')
        .attr('x', legendWidth / 2)
        .attr('y', legendHeight + 5) // Just below the legend
        .attr('text-anchor', 'middle')
        .text('0')
        .style('fill', 'white');

      legendSvg.append('text')
        .attr('x', legendWidth / 2)
        .attr('y', -5) // Just above the legend
        .attr('text-anchor', 'middle')
        .text('1')
        .style('fill', 'white');
    }
  }, [attentionData]);

  return <div ref={d3Container} style={{ display: 'flex', justifyContent: 'center' }} />;
};

export default HeatmapVisualization;