'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuItem } from '@/types/models';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem as MuiMenuItem,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

export default function MenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  
  // Fetch menu items and categories
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        
        // Fetch menu items
        const itemsResponse = await fetch('/api/menu');
        if (!itemsResponse.ok) {
          throw new Error('Failed to fetch menu items');
        }
        const itemsData = await itemsResponse.json();
        setMenuItems(itemsData);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/menu/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching menu data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuData();
  }, []);
  
  // Handle delete menu item
  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }
      
      // Remove the deleted item from the state
      setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting menu item:', err);
    }
  };
  
  // Handle toggle availability
  const handleToggleAvailability = async (id: string) => {
    try {
      const response = await fetch(`/api/menu/${id}/toggle-availability`, {
        method: 'PUT',
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle menu item availability');
      }
      
      const updatedItem = await response.json();
      
      // Update the item in the state
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? updatedItem : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error toggling menu item availability:', err);
    }
  };
  
  // Filter and sort menu items
  const filteredAndSortedItems = menuItems
    .filter(item => {
      // Filter by category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort based on selected option
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
        case 'price-desc':
          return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
        default:
          // Default sorting by category and then name
          return a.category === b.category
            ? a.name.localeCompare(b.name)
            : a.category.localeCompare(b.category);
      }
    });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Coffee Shop Menu
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={Link}
            href="/menu/add"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Add New Item
          </Button>
          <Button
            component={Link}
            href="/"
            variant="outlined"
          >
            Back to Home
          </Button>
        </Box>
      </Box>
      
      {/* Filters */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Filter by Category"
            >
              <MuiMenuItem value="all">All Categories</MuiMenuItem>
              {categories.map((category) => (
                <MuiMenuItem key={category} value={category}>
                  {category}
                </MuiMenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            id="search-input"
            label="Search"
            variant="outlined"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl fullWidth variant="outlined">
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              label="Sort by"
            >
              <MuiMenuItem value="default">Default</MuiMenuItem>
              <MuiMenuItem value="name-asc">Name (A-Z)</MuiMenuItem>
              <MuiMenuItem value="name-desc">Name (Z-A)</MuiMenuItem>
              <MuiMenuItem value="price-asc">Price (Low to High)</MuiMenuItem>
              <MuiMenuItem value="price-desc">Price (High to Low)</MuiMenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading menu items...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Menu Items */}
      {!loading && !error && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {filteredAndSortedItems.length} of {menuItems.length} items
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}>
            {filteredAndSortedItems.map((item) => (
              <Card key={item.id} elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.image_url && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.image_url}
                    alt={item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ${parseFloat(item.price.toString()).toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description || 'No description available'}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label={item.category} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                    />
                    
                    <Chip 
                      label={item.is_available ? 'Available' : 'Unavailable'} 
                      size="small" 
                      color={item.is_available ? 'success' : 'error'} 
                      icon={item.is_available ? <CheckCircleIcon /> : <CancelIcon />}
                    />
                  </Stack>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    onClick={() => handleToggleAvailability(item.id)}
                    color={item.is_available ? 'error' : 'success'}
                    variant="outlined"
                    sx={{ mr: 'auto' }}
                  >
                    {item.is_available ? 'Mark Unavailable' : 'Mark Available'}
                  </Button>
                  
                  <IconButton 
                    component={Link} 
                    href={`/menu/edit/${item.id}`} 
                    color="primary" 
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  
                  <IconButton 
                    onClick={() => handleDeleteItem(item.id)} 
                    color="error" 
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
          
          {filteredAndSortedItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                No menu items found matching your criteria.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}