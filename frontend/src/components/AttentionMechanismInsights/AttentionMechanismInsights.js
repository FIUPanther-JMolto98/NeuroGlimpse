import React, { useState, useCallback } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Grid } from '@mui/material';
import axios from 'axios'; // Assuming you're using Axios for API calls
import InputHighlighting from './InputHighlighting';
import HeatmapVisualization from './HeatmapVisualization';
import { debounce, set } from 'lodash';

const AttentionMechanismInsights = () => {
  const [inputText, setInputText] = useState('');
  const [attentionData, setAttentionData] = useState(null);
  const [attentionScores, setAttentionScores] = useState(null);
  const [tokens, setTokens]= useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define the function to fetch attention data
  const fetchAttentionData = async (text) => {
    if (text.trim() === '') {
        setAttentionData(null);
        setTokens([]);
        return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/attention', { text }, { headers: { 'Content-Type': 'application/json' }});
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

  // Wrap fetchAttentionData with debounce
  const debouncedFetchAttentionData = useCallback(debounce(fetchAttentionData, 300), []);

  // Update handleInputChange to use debouncedFetchAttentionData
  const handleInputChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
    debouncedFetchAttentionData(newText);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/attention', { text: inputText }, { headers: { 'Content-Type': 'application/json' }});
      console.log("API Response:", response.data);
      if(response.data.attentions) {
        setAttentionData(response.data.attentions); // Adjust based on your actual API response
        console.log("Set attentionData:", response.data.attentions);
      } else {
        console.log("attentions_list not found in response:", response.data);
      }
    } catch (error) {
      console.error('Error fetching attention data:', error);
    }
    setIsLoading(false);
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