'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Chip,
  Stack,
  CircularProgress,
  Tooltip,
  DialogContentText
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
  categories: string[];
  onCategoriesUpdate: () => void;
}

export default function CategoryManager({ 
  open, 
  onClose, 
  categories, 
  onCategoriesUpdate 
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('Please enter a category name');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add category');
      }

      setSuccess(`Category "${newCategoryName.trim()}" added successfully! It will appear in the list once you create a menu item with this category.`);
      setNewCategoryName('');
      onCategoriesUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewCategoryName('');
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleDeleteCategory = async (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setDeleteDialogOpen(true);
    setDeleteError(null);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const response = await fetch(`/api/categories?name=${encodeURIComponent(categoryToDelete)}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category');
      }
      
      setSuccess(`Category "${categoryToDelete}" deleted successfully!`);
      setCategoryToDelete(null);
      setDeleteDialogOpen(false);
      onCategoriesUpdate();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDeleteCategory = () => {
    setCategoryToDelete(null);
    setDeleteDialogOpen(false);
    setDeleteError(null);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading) {
      handleAddCategory();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '400px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CategoryIcon />
        Manage Categories
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add new categories for your menu items. Categories help organize your menu and make it easier for customers to find what they're looking for.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="New Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              placeholder="e.g., Hot Beverages, Cold Drinks, Pastries"
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleAddCategory}
              disabled={loading || !newCategoryName.trim()}
              startIcon={<AddIcon />}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Add
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            Current Categories ({categories.length})
          </Typography>
          
          {categories.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4, 
              bgcolor: 'grey.50', 
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'grey.300'
            }}>
              <CategoryIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No categories found. Add your first category above!
              </Typography>
            </Box>
          ) : (
            <List sx={{ 
              bgcolor: 'background.paper', 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {categories.map((category, index) => (
                <ListItem
                  key={category}
                  divider={index < categories.length - 1}
                  secondaryAction={
                    <Tooltip title="Delete category">
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => handleDeleteCategory(category)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemText 
                    primary={category} 
                    primaryTypographyProps={{
                      variant: 'body1',
                      fontWeight: 'medium'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
            Note: You can only delete categories that are not being used by any menu items. To delete a category in use, first change or delete all menu items in that category.
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteCategory}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Confirm Category Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the category <strong>{categoryToDelete}</strong>? This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteCategory} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteCategory} 
            color="error" 
            variant="contained" 
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}