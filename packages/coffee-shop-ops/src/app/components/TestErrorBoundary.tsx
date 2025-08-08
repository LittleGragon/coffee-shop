'use client';

import { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';

export default function TestErrorBoundary() {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error('This is a test error to verify the ErrorBoundary component');
  }
  
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Error Boundary Test
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Click the button below to trigger an error and test the ErrorBoundary component.
      </Typography>
      <Button 
        variant="contained" 
        color="error" 
        onClick={() => setShouldError(true)}
      >
        Trigger Test Error
      </Button>
    </Paper>
  );
}