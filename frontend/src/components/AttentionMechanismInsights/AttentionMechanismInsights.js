import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import InputHighlighting from './InputHighlighting';
import HeatmapVisualization from './HeatmapVisualization';
import { debounce } from 'lodash';

const AttentionMechanismInsights = () => {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('bert-base-uncased'); // Default model
  const [attentionData, setAttentionData] = useState(null);
  const [attentionScores, setAttentionScores] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const models = ['bert-base-uncased', 'gpt2', 'roberta-base']; // Example models

  const fetchAttentionData = async (text) => {
    if (text.trim() === '') {
      setAttentionData(null);
      setTokens([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/bert_attention', { text, model: selectedModel }, { headers: { 'Content-Type': 'application/json' }});
      // Adjust based on your actual API response
      if (response.data.aggregated_attention_2d && response.data.aggregated_attention_1d && response.data.tokens) {
        setAttentionData(response.data.aggregated_attention_2d);
        setAttentionScores(response.data.aggregated_attention_1d);
        setTokens(response.data.tokens);
      } else {
        console.log("This was the response from the API:", response.data);
      }
    } catch (error) {
      console.error('Error fetching attention data:', error);
    }
    setIsLoading(false);
  };

  const debouncedFetchAttentionData = useCallback(debounce(fetchAttentionData, 300), [selectedModel]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    debouncedFetchAttentionData(event.target.value);
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
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
            >
              {models.map((model) => (
                <MenuItem key={model} value={model}>{model}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8} lg={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {isLoading ? <CircularProgress /> : tokens && attentionScores && (
            <InputHighlighting tokens={tokens} attentionScores={attentionScores} />
          )}
          {attentionData && (
            <HeatmapVisualization attentionData={attentionData} tokens={tokens} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AttentionMechanismInsights;