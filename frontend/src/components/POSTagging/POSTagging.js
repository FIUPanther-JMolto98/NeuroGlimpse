import React, { useState } from 'react';
import { Box, TextField, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { Tooltip } from '@mui/material';

const POSTaggingWidget = () => {
  const [inputText, setInputText] = useState('');
  const [posTags, setPosTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosTags = async (text) => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze_text', { text }, { headers: { 'Content-Type': 'application/json' }});
      setPosTags(response.data.pos_tags);
    } catch (error) {
      console.error('Error fetching POS tags:', error);
      setPosTags([]);
    }
    setIsLoading(false);
  };

  const handleInputChange = (event) => {
    const newText = event.target.value;
    setInputText(newText);
    if (newText.trim()) {
      fetchPosTags(newText);
    } else {
      setPosTags([]);
    }
  };

  const posColors = {
    PROPN: '#ffdc9f',  // Proper Noun
    VERB: '#8effe1',   // Verb
    NOUN: '#ff9999',   // Noun, adjusted for better contrast
    ADJ: '#99ccff',    // Adjective, adjusted for better contrast
    ADV: '#f9e79f',    // Adverb
    PRON: '#d7bde2',   // Pronoun
    DET: '#82e0aa',    // Determiner
    ADP: '#f7dc6f',    // Adposition (Preposition and Postposition)
    AUX: '#f0b27a',    // Auxiliary Verb
    CONJ: '#ebdef0',   // Conjunction
    SCONJ: '#85c1e9',  // Subordinating Conjunction
    NUM: '#aed6f1',    // Numeral
    PART: '#f5b7b1',   // Particle
    INTJ: '#fad7a0',   // Interjection
    SYM: '#d5dbdb',    // Symbol
    PUNCT: '#ccd1d1',  // Punctuation, slightly darker for visibility
    X: '#abb2b9',      // Other, including foreign words, typos, unclassifiable
  };
  

return (
<Box p={2}>
  <Grid container justifyContent="center" spacing={2}>
    <Grid item xs={12}>
      <TextField
        label="Enter text for POS Tagging"
        variant="outlined"
        value={inputText}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid>
    <Grid item xs={12}>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box p={2} display="flex" flexWrap="wrap" justifyContent="flex-start" alignItems="flex-start">
          {posTags.map((tag, index) => (
            <Box key={index} style={{ margin: '4px', textAlign: 'center' }}>
              <Tooltip title={`POS: ${tag.pos}`} placement="top" arrow>
                <Box>
                  {/* POS Class Name Displayed Above the Word */}
                  <Typography 
                    variant="caption" 
                    display="block" 
                    style={{ 
                      color: '#fff', // Ensuring visibility against a potential light background
                    }}
                  >
                    {tag.pos}
                  </Typography>
                  <Typography 
                    display="inline-block" 
                    style={{ 
                      backgroundColor: posColors[tag.pos] || '#fff', 
                      color: '#000', // Set font color to black for better contrast
                      padding: '2px 4px', 
                      borderRadius: '4px',
                    }}
                  >
                    {tag.word}
                  </Typography>
                </Box>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}
    </Grid>
  </Grid>
</Box>
  );
};

export default POSTaggingWidget;