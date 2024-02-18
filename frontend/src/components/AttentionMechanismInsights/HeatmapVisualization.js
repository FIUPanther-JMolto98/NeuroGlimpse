import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HeatmapVisualization = ({ attentionData, tokens }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (attentionData && d3Container.current && tokens) {
      const scores = attentionData; // Directly use the 2D array of scores
      console.log('Attention Data Received:', scores);

      const margin = { top: 40, right: 40, bottom: 80, left: 80 };
      const width = 600 - margin.left - margin.right;
      const height = 600 - margin.top - margin.bottom;

      d3.select(d3Container.current).selectAll("*").remove();

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right + 100) // Extra space for legend
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateInferno)
        .domain([0, 1]); // Assuming scores are normalized between 0 and 1

      const xScale = d3.scaleBand()
        .range([0, width])
        .domain(tokens)
        .padding(0.01);

      const yScale = d3.scaleBand()
        .range([height, 0])
        .domain(tokens)
        .padding(0.01);

      const blockSize = width / scores.length;
      attentionData.forEach((row, i) => {
        row.forEach((score, j) => {
            // Ensure score is a number, handle it if not
            const numericScore = parseFloat(score);
            if (!isNaN(numericScore)) {
                svg.append('rect')
                    .attr('x', j * blockSize)
                    .attr('y', i * blockSize)
                    .attr('width', blockSize)
                    .attr('height', blockSize)
                    .style('fill', colorScale(numericScore));
                
                // Only add text if the score is meaningful (optional)
                if (numericScore >= 0) {
                    svg.append('text')
                        .attr('x', j * blockSize + blockSize / 2)
                        .attr('y', i * blockSize + blockSize / 2)
                        .attr('text-anchor', 'middle')
                        .attr('dy', '.35em')
                        .text(numericScore.toFixed(2))
                        .style('fill', 'white'); // Adjust styling as needed
                }
            } else {
                console.error('Expected a number for score, received:', score);
            }
        });
    });
      // Add x-axis labels
      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      // Add y-axis labels
      svg.append("g")
        .call(d3.axisLeft(yScale));
      // vertical legend to the right of the heatmap
      const legendHeight = height;
      const legendWidth = 20; // thickness of the legend
      const legendSvg = svg.append('g')
        .attr('transform', `translate(${width + margin.right + 20}, 0)`); // position to the right of heatmap

      const linearGradient = legendSvg.append('defs')
        .append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0%')
        .attr('y1', '100%') // start of the gradient at the bottom
        .attr('x2', '0%')
        .attr('y2', '0%'); // end of the gradient at the top

      linearGradient.selectAll('stop')
        .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
        .enter().append('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color);

      legendSvg.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#linear-gradient)');

      // legend labels for 0 and 1 with white font
      legendSvg.append('text')
        .attr('x', legendWidth / 2)
        .attr('y', legendHeight + 5) // just below the legend
        .attr('text-anchor', 'middle')
        .text('0')
        .style('fill', 'white');

      legendSvg.append('text')
        .attr('x', legendWidth / 2)
        .attr('y', -5) // just above the legend
        .attr('text-anchor', 'middle')
        .text('1')
        .style('fill', 'white');
    }
  }, [attentionData, tokens]);

  return <div ref={d3Container} style={{ display: 'flex', justifyContent: 'center' }} />;
};

export default HeatmapVisualization;