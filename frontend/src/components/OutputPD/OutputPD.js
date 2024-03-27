import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField, CircularProgress, Typography, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';
import { debounce } from 'lodash';
import { RiOpenaiFill } from "react-icons/ri";

const OutputPD = ({ onSizeChange }) => {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT2');
  const [probabilityData, setProbabilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const d3Container = useRef(null);

  const fetchProbabilityData = async (text, model) => {
    if (text.trim() === '') {
      setProbabilityData([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/gpt2_next_word_prob', { text, model }, { headers: { 'Content-Type': 'application/json' }});
      const probabilityArray = Object.entries(response.data.top_tokens_probs).map(([word, probability]) => ({
        word, probability
      }));
      setProbabilityData(probabilityArray);
    } catch (error) {
      console.error('Error fetching probability data:', error);
    }
    setIsLoading(false);
  };

  const debouncedFetchProbabilityData = useCallback(debounce(fetchProbabilityData, 300), [selectedModel]);

  useEffect(() => {
    if (probabilityData.length > 0 && d3Container.current) {
    // Remove any existing SVG to start fresh
    d3.select(d3Container.current).selectAll("svg").remove();

      const margin = { top: 40, right: 20, bottom: 20, left: 100 },
            width = 500 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

      // Create the SVG element with explicit dimensions
      const svg = d3.select(d3Container.current).append('svg')
        .attr('width', '100%')
        .attr('height', '500px');

      const chart = svg.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
   
      // X Scale - Using for probability now
      const x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
  
      // Y Scale - Tokens on the y-axis
      const y = d3.scaleBand()
        .range([0, height])
        .domain(probabilityData.map(d => d.word))
        .padding(0.1);
  
      // Adding Grid Lines
      function makeYGridLines() { return d3.axisLeft(y).ticks(5) }
      function makeXGridLines() { return d3.axisBottom(x).ticks(5) }
  
      chart.append("g")
        .attr("class", "grid")
        .call(makeYGridLines()
          .tickSize(-width, 0, 0)
          .tickFormat("")
        );
  
      chart.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0, ${height})`)
        .call(makeXGridLines()
          .tickSize(-height, 0, 0)
          .tickFormat("")
        );
  
      // Y Axis
      chart.append("g")
        .call(d3.axisLeft(y));
  
      // X Axis
      chart.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
  
      // Drawing Bars
      chart.selectAll(".bar")
        .data(probabilityData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.word))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.probability))
        .attr("fill", "#00ff6a");
  
      // Adjusting styles if needed
      chart.selectAll(".tick text")
        .style("font-size", "14px"); // Larger font size for readability
  
      chart.selectAll(".grid .tick line")
        .style("stroke", "lightgrey")
        .style("stroke-dasharray", "2,2");

      // After the chart is drawn, calculate dimensions and trigger resize
      const svgElement = d3Container.current.querySelector("svg"); 
      if (svgElement) {
          const bbox = svgElement.getBBox();
          const totalWidth = bbox.width + margin.left + margin.right;
          const totalHeight = bbox.height + margin.top + margin.bottom;
          if (typeof onSizeChange === 'function') {
              onSizeChange(totalWidth, totalHeight+200);  
          }
      }
    }
  }, [probabilityData]);

const handleInputChange = (event) => {
setInputText(event.target.value);
debouncedFetchProbabilityData(event.target.value, selectedModel);
};

const handleModelChange = (event) => {
setSelectedModel(event.target.value);
debouncedFetchProbabilityData(inputText, event.target.value);
};

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
            {selected === 'GPT2' && <RiOpenaiFill />}
            {selected}
          </Box>
        )}
      >
        <MenuItem value="GPT2">
          <Box display="flex" alignItems="center">
            <RiOpenaiFill />
            GPT2
          </Box>
        </MenuItem>
        {/* Additional MenuItems as needed */}
      </Select>
    </FormControl>
  </Grid>
  {isLoading ? (
    <CircularProgress />
  ) : (
    <div ref={d3Container} style={{ width: '100%', height: '100%', overflow: 'visible' }} />
  )}
</Grid>
</Box>
);
};

export default OutputPD;