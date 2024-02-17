import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography, Grid } from '@mui/material';
import axios from 'axios'; // Assuming you're using Axios for API calls
import HeatmapVisualization from './HeatmapVisualization';

const AttentionMechanismInsights = () => {
  const [inputText, setInputText] = useState('');
  const [attentionData, setAttentionData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
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
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          label="Enter text"
          variant="outlined"
          value={inputText}
          onChange={handleInputChange}
          fullWidth
        />
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mt: 1 }}>
          Visualize Attention
        </Button>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h6">Output Text (with Heatmap)</Typography>
            {/* Placeholder for output text with heatmap colors */}
          </Grid>
          <Grid item>
            <Typography variant="h6">Heatmap Visualization</Typography>
            {attentionData ? <HeatmapVisualization attentionData={attentionData} /> : <Typography>No data to visualize.</Typography>}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
    {isLoading && <CircularProgress />}
  </Box>
);
};

export default AttentionMechanismInsights;