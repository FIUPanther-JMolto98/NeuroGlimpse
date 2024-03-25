import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField, CircularProgress, Typography, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';
import { debounce } from 'lodash';
import { RiOpenaiFill } from "react-icons/ri";

const AttentionHeatmap = () => {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT2');
  const [attentionData, setAttentionData] = useState([]);
  const [showWeights, setShowWeights] = useState(true);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewType, setViewType] = useState('averaged'); 
  const d3Container = useRef(null);

  const handleInputChange = useCallback((event) => {
    setInputText(event.target.value);
    debouncedFetchAttentionData(event.target.value);
  }, []);

  const handleModelChange = useCallback((event) => {
    setSelectedModel(event.target.value);
  }, []);

  const fetchAttentionData = async (text, averageHeads = true) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/gpt2_attention', { text, averageHeads }, { headers: { 'Content-Type': 'application/json' }});
      setAttentionData(response.data.attention_matrices || []);
      setTokens(response.data.tokens.map(token => token.replace('Ġ', '')) || []);
    } catch (error) {
      console.error('Error fetching attention data:', error);
    }
    setIsLoading(false);
  };

  const debouncedFetchAttentionData = debounce(fetchAttentionData, 300);

  useEffect(() => {
    if (Array.isArray(attentionData[0]) && d3Container.current) {
      const formattedTokens = tokens.map(token => token.replace('Ġ', '_'));
  
      const containerWidth = d3Container.current.offsetWidth * 2;
      const containerHeight = d3Container.current.offsetHeight / 2;
      const margin = { top: 20, right: 100, bottom: 50, left: 50 };
  
      d3.select(d3Container.current).selectAll("*").remove();
  
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', containerWidth + margin.left + margin.right)
        .attr('height', containerHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      const xScale = d3.scaleBand()
        .domain(formattedTokens)
        .range([0, containerWidth])
        .padding(0.05);
  
      const yScale = d3.scaleBand()
        .domain(formattedTokens)
        .range([0, containerHeight])
        .padding(0.05);
  
      const colorScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([0, 1]);
  
      // Gradient for the color bar
      const defs = svg.append("defs");
      const linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "0%");
  
      linearGradient.selectAll("stop")
        .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
  
      svg.append('rect')
        .attr('x', containerWidth + margin.right - 30)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', containerHeight)
        .style("fill", "url(#linear-gradient)");
  
      // Color scale labels
      svg.append("text")
        .attr("x", containerWidth + margin.right - 5)
        .attr("y", containerHeight)
        .attr("dy", ".35em")
        .text("0");
  
      svg.append("text")
        .attr("x", containerWidth + margin.right - 5)
        .attr("y", 0)
        .attr("dy", ".35em")
        .text("1");
  
      // Rectangles for heatmap
      svg.selectAll(null)
        .data(attentionData[0].flat())
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(formattedTokens[i % formattedTokens.length]))
        .attr('y', (d, i) => yScale(formattedTokens[Math.floor(i / formattedTokens.length)]))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .style('fill', (d, i) => {
          // Ensuring the first element is colored correctly
          return colorScale(d);
        });
  
    if (showWeights) {
        // Text labels
      svg.selectAll(null)
        .data(attentionData[0].flat())
        .enter()
        .append("text")
        .text(d => d.toFixed(2))
        .attr("x", (d, i) => xScale(formattedTokens[i % formattedTokens.length]) + xScale.bandwidth() / 2)
        .attr("y", (d, i) => yScale(formattedTokens[Math.floor(i / formattedTokens.length)]) + yScale.bandwidth() / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .style("fill", d => d > 0.99 ? "black" : "white")
      .style("font-size", "10px");
      }

    // Adding axes to the heatmap
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    svg.append("g")
      .attr("transform", `translate(0,${containerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");

    svg.append("g")
      .call(yAxis);

  }
}, [attentionData, tokens, showWeights]);
               
  return (
    <Box p={2}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Enter text"
            variant="outlined"
            value={inputText}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Model</InputLabel>
            <Select
              value={selectedModel}
              label="Model"
              onChange={handleModelChange}
              renderValue={(selected) => (
                <Box display="flex" alignItems="center">
                  {selected === 'GPT2' && <RiOpenaiFill style={{ marginRight: 8 }} />}
                  {selected}
                </Box>
              )}
            >
              <MenuItem value="GPT2">
                <Box display="flex" alignItems="center">
                  <RiOpenaiFill style={{ marginRight: 8 }} />
                  GPT2
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="view-attention-head-label">View Attention Head</InputLabel>
            <Select
              labelId="view-attention-head-label"
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              label="View Attention Head" 
            >
              <MenuItem value="averaged">Averaged Attention</MenuItem>
              {Array.isArray(attentionData[0]) && attentionData.map((_, index) => (
                <MenuItem key={`head${index}`} value={`head${index + 1}`}>{`Head ${index + 1}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showWeights}
                onChange={() => setShowWeights(!showWeights)}
                name="showWeights"
              />
            }
            label="Show Weights"
          />
        </Grid>
        </Grid>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div ref={d3Container} style={{ width: '100%', height: '400px' }} />
        )}
      </Grid>
    </Box>
  );
};

export default AttentionHeatmap;