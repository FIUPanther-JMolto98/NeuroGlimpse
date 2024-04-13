import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, TextField, CircularProgress, Typography, Grid, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';
import { debounce } from 'lodash';
import { RiOpenaiFill } from "react-icons/ri";
import { FaGoogle } from "react-icons/fa";

const AttentionHeatmap = ({ onSizeChange }) => {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('GPT2');
  const [attentionData, setAttentionData] = useState([]);
  const [attentionDataPerHead, setAttentionDataPerHead] = useState([]);
  const [showWeights, setShowWeights] = useState(true);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHeadIndex, setSelectedHeadIndex] = useState(null);
  const [initialRender, setInitialRender] = useState(true); // State to track initial render

  const d3Container = useRef(null);

  const fetchAttentionData = async (text, model) => {
    setIsLoading(true);
    try {
      const endpoint = model === 'GPT2' ? 'gpt2_attention' : 'bert_attention';
      const response = await axios.post(`http://127.0.0.1:5000/${endpoint}`, { text }, { headers: { 'Content-Type': 'application/json' } });
      setAttentionData(response.data.attention_matrices_average || []);
      setAttentionDataPerHead(response.data.attention_matrices_per_head || []);
      setTokens(response.data.tokens.map(token => token.replace('Ġ', ' ')) || []);
    } catch (error) {
      console.error('Error fetching attention data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchAttentionData = debounce(fetchAttentionData, 300);

  const handleInputChange = useCallback((event) => {
    const text = event.target.value;
    setInputText(text);
    debouncedFetchAttentionData(text, selectedModel);
  }, [selectedModel]);
  
const handleModelChange = useCallback((event) => {
  const selectedModel = event.target.value;
  setSelectedModel(selectedModel);
  debouncedFetchAttentionData(inputText, selectedModel);
}, [inputText]);

  useEffect(() => {
    if (d3Container.current && (attentionData.length > 0 || attentionDataPerHead.length > 0)) {
      const formattedTokens = tokens.map(token => token.replace('Ġ', ' '));
      console.log('Formatted Tokens:', formattedTokens);
      console.log('Attention Data:', attentionData);
      console.log('Attention Data Per Head:', attentionDataPerHead);
      console.log('Selected Head Index:', selectedHeadIndex);
      console.log('Show Weights:', showWeights);
      const margin = { top: 20, right: 100, bottom: 50, left: 80 };
      const containerWidth = d3Container.current.offsetWidth /2+150;
      const containerHeight = d3Container.current.offsetHeight / 2;

      d3.select(d3Container.current).selectAll("*").remove();
      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', containerWidth + margin.left + margin.right)
        .attr('height', containerHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleBand()
        .domain(Array.from({ length: tokens.length }, (_, i) => i))
        .range([0, containerWidth])
        .padding(0.05);
      
      const yScale = d3.scaleBand()
        .domain(Array.from({ length: tokens.length }, (_, i) => i))
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
        .attr('x', containerWidth + margin.right - 70)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', containerHeight)
        .style("fill", "url(#linear-gradient)");

      // Color scale labels
      svg.append("text")
        .attr("x", containerWidth + margin.right - 65)
        .attr("y", containerHeight + margin.top - 10)
        .attr("dy", ".35em")
        .text("0")
        .style("fill", "white");

      svg.append("text")
        .attr("x", containerWidth + margin.right - 65)
        .attr("y", containerHeight - margin.top - 190)
        .attr("dy", ".35em")
        .text("1")
        .style("fill", "white");

      let dataToRender;
      if (selectedHeadIndex === null) {
        dataToRender = attentionData; // Use averaged attention
      } else {
        // Correctly access the attention data for the selected head:
        dataToRender = attentionDataPerHead.map(layer => layer[selectedHeadIndex]); 
      }
      console.log('Data to Render:', dataToRender);
      // Rectangles for heatmap
      svg.selectAll(null)
        .data(dataToRender[0].flat())
        .enter()
        .append('rect')
        .attr('x', (d, i) => xScale(i % tokens.length))
        .attr('y', (d, i) => yScale(Math.floor(i / tokens.length)))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .style('fill', d => colorScale(d))
        .each((d, i, nodes) => {
          console.log('Rectangle Data:', d);
          console.log('Rectangle Index:', i);
          console.log('Rectangle Node:', nodes[i]);
        });

      // Text labels
      if (showWeights) {
        svg.selectAll(null)
          .data(dataToRender[0].flat())
          .enter()
          .append("text")
          .text(d => d.toFixed(2)) // display all numbers with 2 decimal places
          .attr("x", (d, i) => xScale(i % tokens.length) + xScale.bandwidth() / 2)
          .attr("y", (d, i) => yScale(Math.floor(i / tokens.length)) + yScale.bandwidth() / 2)
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("fill", d => d > 0.8 ? "black" : "white")
          .style("font-size", "10px")
          .each((d, i, nodes) => {
            console.log('Text Data:', d);
            console.log('Text Index:', i);
            console.log('Text Node:', nodes[i]);
          });
      }
      // Adding axes to the heatmap
      const xAxis = d3.axisBottom(xScale)
        .tickFormat((d, i) => tokens[i])
        .tickSizeOuter(0);

      const yAxis = d3.axisLeft(yScale)
        .tickFormat((d, i) => tokens[i])
        .tickSizeOuter(0);
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
      
        if (initialRender) {
              onSizeChange(620, 540); // Call with fixed dimensions for the initial render
              setInitialRender(false); // Update the state to prevent further unnecessary onSizeChange calls
            }
          }
        }, [attentionData, attentionDataPerHead, tokens, selectedHeadIndex, showWeights, initialRender, onSizeChange]);
  

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
                        {selected === 'BERT' && <FaGoogle style={{ marginRight: 8 }} />}
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
                    <MenuItem value="BERT">
                      <Box display="flex" alignItems="center">
                        <FaGoogle style={{ marginRight: 8 }} />
                        BERT
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="view-attention-head-label">View Attention Head</InputLabel>
                  <Select
                    labelId="view-attention-head-label"
                    value={selectedHeadIndex === null ? 'averaged' : selectedHeadIndex}
                    onChange={(e) => setSelectedHeadIndex(e.target.value === 'averaged' ? null : parseInt(e.target.value))}
                    label="View Attention Head"
                  >
                    <MenuItem value="averaged">Averaged Attention</MenuItem>
                    {/* {[...Array(12)].map((_, index) => (
                      <MenuItem key={`head${index}`} value={index}>{`Head ${index + 1}`}
                  </MenuItem>
                ))} */}
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