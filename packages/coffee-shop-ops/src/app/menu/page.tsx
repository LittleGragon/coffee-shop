'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MenuItem } from '@/types/models';
import { WishlistCount } from '@/services/wishlistService';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
  Stack,
  Tabs,
  Tab,
  Badge,
  Fab,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  SwipeableDrawer,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Category as CategoryIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import CategoryManager from '@/app/components/CategoryManager';

interface CategoryStats {
  name: string;
  count: number;
  availableCount: number;
}

export default function MenuPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistCounts, setWishlistCounts] = useState<Record<string, number>>({});
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('default');
  
  // UI states
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  
  // Fetch menu items and categories
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
      const categoriesResponse = await fetch('/api/categories');
      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
      
      // Fetch wishlist counts
      const wishlistResponse = await fetch('/api/wishlist');
      if (wishlistResponse.ok) {
        const wishlistData: WishlistCount[] = await wishlistResponse.json();
        const countsMap: Record<string, number> = {};
        wishlistData.forEach(item => {
          countsMap[item.menu_item_id] = item.count;
        });
        setWishlistCounts(countsMap);
      }
      
      // Calculate category statistics
      const stats = categoriesData.map((category: string) => {
        const categoryItems = itemsData.filter((item: MenuItem) => item.category === category);
        return {
          name: category,
          count: categoryItems.length,
          availableCount: categoryItems.filter((item: MenuItem) => item.is_available).length
        };
      });
      setCategoryStats(stats);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching menu data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Handle categories update
  const handleCategoriesUpdate = () => {
    fetchMenuData();
  };
  
  // Handle delete menu item
  const handleDeleteItem = async (id: string) => {
    console.log(`Delete function called for item ID: ${id}`);
    
    try {
      // Skip confirmation for debugging
      // if (!confirm('Are you sure you want to delete this menu item?')) {
      //   console.log('User cancelled delete operation');
      //   return;
      // }
      
      console.log(`Proceeding with delete for item ID: ${id}`);
      
      // Direct API call with fetch
      const apiUrl = `/api/menu/${id}`;
      console.log(`Making DELETE request to: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
      
      console.log(`Response status: ${response.status}`);
      console.log(`Response status text: ${response.statusText}`);
      
      const responseText = await response.text();
      console.log(`Raw response: ${responseText}`);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed response:', result);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        alert(`Error parsing response: ${responseText}`);
        return;
      }
      
      if (!response.ok) {
        console.error('Delete response not OK:', result);
        alert(`Server error: ${result.error || response.statusText}`);
        return;
      }
      
      console.log('Delete successful:', result);
      
      // Update UI by removing the deleted item
      setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
      
      // Show success message
      alert('Menu item deleted successfully');
      
      // Refresh data to update category stats
      fetchMenuData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error in delete operation:', err);
      alert(`Failed to delete menu item: ${errorMessage}`);
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
      
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? updatedItem : item
        )
      );
      fetchMenuData(); // Refresh to update category stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error toggling menu item availability:', err);
    }
  };
  
  // Filter and sort menu items
  const filteredAndSortedItems = menuItems
    .filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
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
          return a.category === b.category
            ? a.name.localeCompare(b.name)
            : a.category.localeCompare(b.category);
      }
    });

  // Mobile category tabs
  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  // Mobile filters drawer
  const FiltersDrawer = () => (
    <SwipeableDrawer
      anchor="bottom"
      open={filtersOpen}
      onClose={() => setFiltersOpen(false)}
      onOpen={() => setFiltersOpen(true)}
      disableSwipeToOpen={false}
      PaperProps={{
        sx: { 
          borderTopLeftRadius: 16, 
          borderTopRightRadius: 16,
          maxHeight: '70vh'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Filters & Sort</Typography>
          <IconButton onClick={() => setFiltersOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Stack spacing={3}>
          <TextField
            fullWidth
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
            <InputLabel>Sort by</InputLabel>
            <Select
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
        </Stack>
      </Box>
    </SwipeableDrawer>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading menu items...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ pb: isMobile ? 7 : 0 }}>
      {/* Mobile Header */}
      {isMobile && (
        <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => router.push('/')}
              sx={{ mr: 2 }}
            >
              <HomeIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Menu ({filteredAndSortedItems.length})
            </Typography>
            <IconButton onClick={() => setFiltersOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 4 }}>
        {/* Desktop Header */}
        {!isMobile && (
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
                onClick={() => setCategoryManagerOpen(true)}
                variant="outlined"
                color="secondary"
                startIcon={<CategoryIcon />}
              >
                Manage Categories
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
        )}

        {/* Category Tabs (Mobile) */}
        {isMobile && categories.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': { opacity: 0.3 }
                }
              }}
            >
              <Tab 
                label={
                  <Badge badgeContent={menuItems.length} color="primary" max={999}>
                    All Items
                  </Badge>
                } 
                value="all" 
              />
              {categoryStats.map((stat) => (
                <Tab
                  key={stat.name}
                  label={
                    <Badge badgeContent={stat.count} color="primary" max={999}>
                      {stat.name}
                    </Badge>
                  }
                  value={stat.name}
                />
              ))}
            </Tabs>
          </Box>
        )}

        {/* Desktop Filters */}
        {!isMobile && (
          <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filter by Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Filter by Category"
                >
                  <MuiMenuItem value="all">
                    <Badge badgeContent={menuItems.length} color="primary" max={999}>
                      All Categories
                    </Badge>
                  </MuiMenuItem>
                  {categoryStats.map((stat) => (
                    <MuiMenuItem key={stat.name} value={stat.name}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{stat.name}</span>
                        <Chip size="small" label={`${stat.availableCount}/${stat.count}`} />
                      </Box>
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
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
                <InputLabel>Sort by</InputLabel>
                <Select
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
        )}

        {/* Results Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {selectedCategory === 'all' 
              ? `Showing ${filteredAndSortedItems.length} of ${menuItems.length} items`
              : `${filteredAndSortedItems.length} items in ${selectedCategory}`
            }
          </Typography>
          {selectedCategory !== 'all' && (
            <Button 
              size="small" 
              onClick={() => setSelectedCategory('all')}
              sx={{ minWidth: 'auto' }}
            >
              Clear Filter
            </Button>
          )}
        </Box>

        {/* Menu Items Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: { xs: 2, md: 3 }
        }}>
          {filteredAndSortedItems.map((item) => (
            <Card 
              key={item.id} 
              elevation={isMobile ? 1 : 2} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: isMobile ? 'none' : 'translateY(-2px)'
                }
              }}
            >
              {item.image_url && (
                <CardMedia
                  component="img"
                  height={isMobile ? "160" : "180"}
                  image={item.image_url}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} component="h2" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" color="primary">
                    ${parseFloat(item.price.toString()).toFixed(2)}
                  </Typography>
                </Box>
                
                {item.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.description}
                  </Typography>
                )}
                
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
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
                  
                  {wishlistCounts[item.id] > 0 && (
                    <Chip
                      icon={<FavoriteIcon />}
                      label={`${wishlistCounts[item.id]} likes`}
                      size="small"
                      color="primary"
                    />
                  )}
                </Stack>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0, flexWrap: 'wrap', gap: 1 }}>
                <Button
                  size="small"
                  onClick={() => handleToggleAvailability(item.id)}
                  color={item.is_available ? 'error' : 'success'}
                  variant="outlined"
                  sx={{ flex: 1, minWidth: 'fit-content' }}
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
                  color="error" 
                  size="small"
                  onClick={() => {
                    setItemToDelete(item);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
        
        {filteredAndSortedItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CategoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No menu items found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery 
                ? `No items match "${searchQuery}" in ${selectedCategory === 'all' ? 'any category' : selectedCategory}`
                : `No items available in ${selectedCategory === 'all' ? 'any category' : selectedCategory}`
              }
            </Typography>
            {selectedCategory !== 'all' || searchQuery ? (
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button 
                component={Link}
                href="/menu/add"
                variant="contained"
                startIcon={<AddIcon />}
              >
                Add First Menu Item
              </Button>
            )}
          </Box>
        )}
      </Container>

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
          }}
          component={Link}
          href="/menu/add"
        >
          <AddIcon />
        </Fab>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation showLabels>
            <BottomNavigationAction
              label="Home"
              icon={<HomeIcon />}
              onClick={() => router.push('/')}
            />
            <BottomNavigationAction
              label="Categories"
              icon={<CategoryIcon />}
              onClick={() => setCategoryManagerOpen(true)}
            />
            <BottomNavigationAction
              label="Add Item"
              icon={<AddIcon />}
              onClick={() => router.push('/menu/add')}
            />
          </BottomNavigation>
        </Paper>
      )}

      {/* Mobile Filters Drawer */}
      <FiltersDrawer />

      {/* Category Manager Dialog */}
      <CategoryManager
        open={categoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
        categories={categories}
        onCategoriesUpdate={handleCategoriesUpdate}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {itemToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (itemToDelete) {
                // Use our dedicated delete endpoint
                fetch('/api/menu/delete', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ id: itemToDelete.id }),
                })
                .then(response => response.json())
                .then(data => {
                  setDeleteDialogOpen(false);
                  
                  if (data.success) {
                    // Show success message using Material UI Alert or Snackbar in a real app
                    alert(`${itemToDelete.name} has been deleted.`);
                    // Remove from UI
                    setMenuItems(current => current.filter(i => i.id !== itemToDelete.id));
                  } else {
                    alert(`Failed to delete item: ${data.error || 'Unknown error'}`);
                  }
                })
                .catch(err => {
                  setDeleteDialogOpen(false);
                  console.error('Delete error:', err);
                  alert('An error occurred while deleting.');
                });
              }
            }} 
            color="error" 
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}