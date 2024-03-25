import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';
import { debounce } from 'lodash';
import { RiOpenaiFill } from "react-icons/ri";

const OutputPD = () => {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT2'); // Assuming you want GPT-2 as default
  const [probabilityData, setProbabilityData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const d3Container = useRef(null);

  // Fetch probability distribution data
  const fetchProbabilityData = async (text, model) => {
    if (text.trim() === '') {
      setProbabilityData([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/gpt2_next_word_prob', { text, model }, { headers: { 'Content-Type': 'application/json' }});
      console.log("Response data:", response.data); // Check the actual response structure
      // Transform the data into an array format suitable for D3
      const probabilityArray = Object.entries(response.data.top_tokens_probs).map(([word, probability]) => ({
        word, probability
    }));
        
      console.log("Transformed data for D3:", probabilityArray);
      setProbabilityData(probabilityArray);
    } catch (error) {
        console.error('Error fetching probability data:', error);
    }
    setIsLoading(false);
  };
  const debouncedFetchProbabilityData = useCallback(debounce(fetchProbabilityData, 300), [selectedModel]);

  useEffect(() => {
    if (probabilityData.length > 0 && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove();
  
      const margin = { top: 40, right: 20, bottom: 100, left: 100 }, // Adjusted bottom margin for label spacing
        width = 500 - margin.left - margin.right, // Smaller width
        height = 300 - margin.top - margin.bottom; // Smaller height
  
      const chart = svg.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
  
      // Defining a gradient for the bars
      const defs = chart.append("defs");
      const gradient = defs.append("linearGradient")
        .attr("id", "purpleGradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "100%").attr("y2", "0%");
  
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#957DAD"); // Light purple
  
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#4B2B59"); // Dark purple
  
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
                            // Custom rendering for the selected value
                            <Box display="flex" alignItems="center" gap="8px">
                                {selected === 'GPT2' && <RiOpenaiFill />}
                                {selected}
                            </Box>
                        )}
                    >
                        <MenuItem value="GPT2">
                            <Box display="flex" alignItems="center" gap="8px">
                                <RiOpenaiFill />
                                GPT2
                            </Box>
                        </MenuItem>
                        {/* Add more MenuItems as needed */}
                    </Select>
                </FormControl>
            </Grid>
            {isLoading ? <CircularProgress /> : (
                <div ref={d3Container} />
                // D3 visualization will be rendered inside this div
            )}
        </Grid>
    </Box>
);
};

export default OutputPD;