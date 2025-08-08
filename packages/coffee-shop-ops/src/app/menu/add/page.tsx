'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MenuItem } from '@/types/models';
import MenuItemForm from '@/app/components/MenuItemForm';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AddMenuItemPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: Partial<MenuItem>) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create menu item: ${response.statusText}`);
      }

      // Navigate back to the menu page after successful creation
      router.push('/menu');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating menu item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/menu');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Add New Menu Item
        </Typography>
        <Button
          component={Link}
          href="/menu"
          startIcon={<ArrowBackIcon />}
          variant="outlined"
        >
          Back to Menu
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3 }}>
        <MenuItemForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </Paper>
    </Container>
  );
}