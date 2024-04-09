import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, CircularProgress, Grid, Typography, Button } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';

const WordEmbeddingDistance = ({ onSizeChange }) => {
  const [inputText, setInputText] = useState('');
  const [embeddingData, setEmbeddingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [arithmeticExpression, setArithmeticExpression] = useState('');
  const [arithmeticResult, setArithmeticResult] = useState([]);
  const [activeVisualization, setActiveVisualization] = useState('embedding');
  const d3Container = useRef(null);
  const tooltipRef = useRef(null);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  const fetchEmbeddingData = async (text) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/word_embedding_distance', { text }, { headers: { 'Content-Type': 'application/json' } });
      setEmbeddingData(response.data.embedding_data || []);
      setActiveVisualization('embedding');
    } catch (error) {
      console.error('Error fetching embedding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
    if (text.trim() === '') {
      setEmbeddingData([]);
    } else if (text.trim().split(' ').length <= 10) {
      fetchEmbeddingData(text);
    }
  };

  const handleArithmeticExpression = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/word_embedding_arithmetic', { expression: arithmeticExpression }, { headers: { 'Content-Type': 'application/json' } });
      setArithmeticResult(response.data.result_words || []);
      setActiveVisualization('arithmetic');
    } catch (error) {
      console.error('Error performing embedding arithmetic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (d3Container.current && activeVisualization === 'embedding' && embeddingData.length > 0) {
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = 500 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const svg = d3.select(d3Container.current)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xScale = d3.scaleLinear()
        .domain(d3.extent(embeddingData, d => d.x))
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .domain(d3.extent(embeddingData, d => d.y))
        .range([height, 0]);

      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale));

      const validData = embeddingData.filter(d => d.word && typeof d.x === 'number' && typeof d.y === 'number');

      validData.forEach((d, i) => {
        validData.forEach((e, j) => {
          if (i !== j) {
            svg.append("line")
              .attr("x1", xScale(d.x))
              .attr("y1", yScale(d.y))
              .attr("x2", xScale(e.x))
              .attr("y2", yScale(e.y))
              .attr("stroke", "#ffffff1a")
              .attr("stroke-opacity", 0.5);
          }
        });
      });

      const dots = svg.selectAll(".dot").data(validData, d => d.word);

      dots.enter().append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .style("fill", (d, i) => colorScale(i))
        .on("mouseover", (event, d) => {
          setHoveredWord(d.word);
          const tooltipDiv = d3.select(tooltipRef.current);
          const [x, y] = d3.pointer(event);
          tooltipDiv.style("left", `${x - 25}px`)
                    .style("top", `${y + 50}px`)
                    .style("display", "block")
                    .style("max-width", "300px")
                    .style("white-space", "nowrap");

          const relevantEntries = embeddingData.filter(data => data.word1 === d.word || data.word2 === d.word);

          const tooltipContent = relevantEntries
            .sort((a, b) => b.similarity - a.similarity)
            .map(data => {
              const targetWord = data.word1 === d.word ? data.word2 : data.word1;
              const similarity = data.similarity;
              const color = similarity >= 0.75 ? '#92ff92' : similarity >= 0.5 ? '#fff892' : '#ff9292';
              const similarityString = typeof similarity === 'number' ? similarity.toFixed(2) : 'N/A';
              return `<div>
                <span style="color: ${colorScale(validData.findIndex(d => d.word === targetWord))}">&#9679;</span>
                ${targetWord} <span style="color: ${color}">${similarityString}</span>
              </div>`;
            })
            .join('');

          tooltipDiv.html(`<strong><center>${d.word}:</center></strong>${tooltipContent}`)
                    .style('background-color', 'rgba(0, 0, 0, 0.8)')
                    .style('color', 'white')
                    .style('border-radius', '4px')
                    .style('padding', '8px');
        })
        .on("mouseout", () => {
          setHoveredWord(null);
          d3.select(tooltipRef.current).style("display", "none");
        });

      const labels = svg.selectAll(".label")
        .data(validData, d => d.word);

      labels.enter().append("text")
          .attr("x", d => xScale(d.x))
          .attr("y", d => yScale(d.y) - 10)
          .text(d => d.word)
          .style("font-size", "12px")
          .style("fill", (d, i) => colorScale(i))
          .attr("text-anchor", "middle");

      dots.exit().remove();
      labels.exit().remove();

      onSizeChange(500, 625);
    } 
}, [embeddingData, activeVisualization]);  
  useEffect(() => {
    if (d3Container.current && activeVisualization === 'arithmetic' && arithmeticResult.length > 0) {
        const margin = { top: 40, right: 20, bottom: 20, left: 100 },
                width = 500 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

        const svg = d3.select(d3Container.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, d3.max(arithmeticResult, d => d.similarity)])
            .range([0, width]);

        const y = d3.scaleBand()
            .range([0, height])
            .domain(arithmeticResult.map(d => d.word))
            .padding(0.1);

        const colorScale = d3.scaleLinear()
            .domain([0, 0.5, 1])
            .range(["#ff0000", "#ffff00", "#00ff00"]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg.selectAll(".bar")
            .data(arithmeticResult)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("y", d => y(d.word))
            .attr("height", y.bandwidth())
            .attr("x", 0)
            .attr("width", d => x(d.similarity))
            .attr("fill", d => colorScale(d.similarity));

        onSizeChange(500, 625);
        }
    }, [arithmeticResult, activeVisualization]);

  return (
    <Box p={2}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Enter text (max 10 words)"
            variant="outlined"
            value={inputText}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Enter arithmetic expression (e.g., woman + king - man)"
            variant="outlined"
            value={arithmeticExpression}
            onChange={(e) => setArithmeticExpression(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleArithmeticExpression} disabled={!arithmeticExpression}>
            Calculate
          </Button>
        </Grid>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            {activeVisualization === 'embedding' && (
              <>
                <div ref={d3Container} style={{ width: '100%', height: '100%' }}></div>
                <Box
                  ref={tooltipRef}
                  style={{
                    display: 'none',
                    position: 'absolute',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                ></Box>
              </>
            )}
            {activeVisualization === 'arithmetic' && (
              <div ref={d3Container} style={{ width: '100%', height: '100%' }}></div>
            )}
          </div>
        )}
      </Grid>
    </Box>
  );
};

export default WordEmbeddingDistance;