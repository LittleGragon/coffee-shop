'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MenuItem } from '@/types/models';
import MenuItemForm from '@/app/components/MenuItemForm';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface EditMenuItemClientProps {
  id: string;
}

export default function EditMenuItemClient({ id }: EditMenuItemClientProps) {
  const router = useRouter();
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/menu/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch menu item');
        }
        
        const data = await response.json();
        setMenuItem(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching menu item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const handleSubmit = async (formData: Partial<MenuItem>) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }

      const updatedItem = await response.json();
      setMenuItem(updatedItem);
      setUpdateSuccess(true);
      setError(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Edit Menu Item
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/menu')}
          >
            Back to Menu
          </Button>
        </Box>

        {loading && !menuItem && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {updateSuccess && (
          <Alert severity="success" sx={{ mb: 4 }}>
            Menu item updated successfully!
          </Alert>
        )}

        {menuItem && (
          <MenuItemForm
            initialData={menuItem}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/menu')}
            isSubmitting={loading}
          />
        )}
      </Paper>
    </Container>
  );
}