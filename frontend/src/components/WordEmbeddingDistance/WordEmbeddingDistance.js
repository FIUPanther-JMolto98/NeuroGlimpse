import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, CircularProgress, Grid, Typography } from '@mui/material';
import axios from 'axios';
import * as d3 from 'd3';

const WordEmbeddingDistance = ({ onSizeChange }) => {
  const [inputText, setInputText] = useState('');
  const [embeddingData, setEmbeddingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });
  const d3Container = useRef(null);

  const fetchEmbeddingData = async (text) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/word_embedding_distance', { text }, { headers: { 'Content-Type': 'application/json' } });
      setEmbeddingData(response.data.embedding_data || []);
    } catch (error) {
      console.error('Error fetching embedding data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputText(text);
    if (text.trim().split(' ').length <= 10) {
      fetchEmbeddingData(text);
    }
  };

  useEffect(() => {
    if (d3Container.current) {
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
        .range([0, width]);

      const yScale = d3.scaleLinear()
        .range([height, 0]);

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

      svg.append("g")
        .call(yAxis);

      const updateVisualization = () => {
        xScale.domain(d3.extent(embeddingData, d => d.x));
        yScale.domain(d3.extent(embeddingData, d => d.y));

        svg.selectAll(".line").remove();
        svg.selectAll(".dot").remove();
        svg.selectAll(".label").remove();

        svg.selectAll(".line")
          .data(embeddingData.filter(d => d.word1 && d.word2))
          .enter()
          .append("line")
          .attr("x1", d => xScale(embeddingData.find(e => e.word === d.word1).x))
          .attr("y1", d => yScale(embeddingData.find(e => e.word === d.word1).y))
          .attr("x2", d => xScale(embeddingData.find(e => e.word === d.word2).x))
          .attr("y2", d => yScale(embeddingData.find(e => e.word === d.word2).y))
          .attr("stroke", "gray")
          .attr("stroke-width", 1);

        svg.selectAll(".dot")
          .data(embeddingData.filter(d => d.word))
          .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", d => xScale(d.x))
          .attr("cy", d => yScale(d.y))
          .attr("r", 5)
          .style("fill", (d, i) => colorScale(i))
          .style("cursor", "pointer")
          .on("mouseover", (event, d) => {
            setHoveredWord(d.word);
            setHoveredPosition({ x: xScale(d.x) + margin.left, y: yScale(d.y) + margin.top });
          })
          .on("mouseout", () => {
            setHoveredWord(null);
          });

        svg.selectAll(".label")
          .data(embeddingData.filter(d => d.word))
          .enter()
          .append("text")
          .attr("class", "label")
          .attr("x", d => xScale(d.x))
          .attr("y", d => yScale(d.y) - 10)
          .text(d => d.word)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", (d, i) => colorScale(i))
          .style("pointer-events", "none");
      };

      updateVisualization();

      onSizeChange(500, 500);
    }
  }, []);

  useEffect(() => {
    if (d3Container.current && embeddingData.length > 0) {
      const svg = d3.select(d3Container.current).select("svg");
      const xScale = d3.scaleLinear()
        .domain(d3.extent(embeddingData, d => d.x))
        .range([0, 500 - 60]); // Adjust the range based on the container width
      const yScale = d3.scaleLinear()
        .domain(d3.extent(embeddingData, d => d.y))
        .range([400 - 50, 0]); // Adjust the range based on the container height

      svg.selectAll(".line").remove();
      svg.selectAll(".dot").remove();
      svg.selectAll(".label").remove();

      svg.selectAll(".line")
        .data(embeddingData.filter(d => d.word1 && d.word2))
        .enter()
        .append("line")
        .attr("x1", d => xScale(embeddingData.find(e => e.word === d.word1).x))
        .attr("y1", d => yScale(embeddingData.find(e => e.word === d.word1).y))
        .attr("x2", d => xScale(embeddingData.find(e => e.word === d.word2).x))
        .attr("y2", d => yScale(embeddingData.find(e => e.word === d.word2).y))
        .attr("stroke", "gray")
        .attr("stroke-width", 1);

      svg.selectAll(".dot")
        .data(embeddingData.filter(d => d.word))
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 5)
        .style("fill", (d, i) => colorScale(i))
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => {
          setHoveredWord(d.word);
          setHoveredPosition({ x: xScale(d.x) + 40, y: yScale(d.y) + 20 }); // Adjust the position
        })
        .on("mouseout", () => {
          setHoveredWord(null);
        });

      svg.selectAll(".label")
        .data(embeddingData.filter(d => d.word))
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => xScale(d.x))
        .attr("y", d => yScale(d.y) - 10)
        .text(d => d.word)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", (d, i) => colorScale(i))
        .style("pointer-events", "none");
    }
  }, [embeddingData]);

  const getSimilarityColor = (similarity) => {
    const value = similarity * 120; // Map similarity to a value between 0 and 120
    const hue = Math.min(value, 120); // Clamp the hue to a maximum of 120 (green)
    return `hsl(${hue}, 100%, 50%)`; // Return the color in HSL format
  };

  const renderSimilarityScores = (word) => {
    const similarities = embeddingData
      .filter(d => d.word1 === word || d.word2 === word)
      .map(d => {
        const otherWord = d.word1 === word ? d.word2 : d.word1;
        const color = getSimilarityColor(d.similarity);
        return (
          <Typography key={otherWord} variant="body2" style={{ marginBottom: '4px' }}>
            <span style={{ color: color, marginRight: '4px' }}>•</span>
            {otherWord}: <span style={{ color }}>{d.similarity.toFixed(2)}</span>
          </Typography>
        );
      });
    return similarities;
  };

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
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div ref={d3Container} style={{ width: '100%', height: '500px', position: 'relative' }}>
            {hoveredWord && (
              <Box
                style={{
                  position: 'absolute',
                  zIndex: 12,
                  left: hoveredPosition.x + 10,
                  top: hoveredPosition.y,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '8px',
                }}
              >
                <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
                  {hoveredWord}
                </Typography>
                {renderSimilarityScores(hoveredWord)}
              </Box>
            )}
          </div>
        )}
      </Grid>
    </Box>
  );
};

export default WordEmbeddingDistance;