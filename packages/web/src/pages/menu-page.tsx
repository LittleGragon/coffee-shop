import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
// Material UI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
// Components
import { WishlistButton } from '@/components/WishlistButton';
import { type MenuItem, useCartStore } from '@/stores/cart-store';

interface CategoryStats {
  name: string;
  count: number;
  availableCount: number;
}

export const MenuPage = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
    toast.success(`${item.name} has been added to your cart.`);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleClearFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
  };

  // Fetch categories and menu items
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories from database - use direct URL to bypass environment variables
        const categoriesResponse = await fetch('http://localhost:3000/api/categories');
        // Categories response status tracking removed
        interface CategoryData {
          id: string | number;
          name: string;
        }

        let categoriesData: CategoryData[];

        if (categoriesResponse.ok) {
          categoriesData = await categoriesResponse.json();
          // Categories data logging removed
        } else {
          // Using fallback data for categories
          // Fallback categories
          categoriesData = [
            { id: 1, name: 'Hot Beverages' },
            { id: 2, name: 'Cold Beverages' },
            { id: 3, name: 'Pastries' },
            { id: 4, name: 'Sandwiches' },
            { id: 5, name: 'Desserts' },
            { id: 6, name: 'Snacks' },
          ];
        }

        // Create category lookup map (id -> name)
        const categoryMap = new Map();
        let categoryNames: string[] = [];

        if (Array.isArray(categoriesData)) {
          categoriesData.forEach((cat: { id: string; name: string }) => {
            if (cat?.id && cat?.name) {
              categoryMap.set(cat.id, cat.name);
              categoryNames.push(cat.name);
            }
          });
        } else {
          // Fallback to hardcoded categories if API fails
          categoryNames = [
            'Hot Beverages',
            'Cold Beverages',
            'Pastries',
            'Sandwiches',
            'Desserts',
            'Snacks',
          ];
          categoryNames.forEach((name, index) => {
            categoryMap.set(index + 1, name);
          });
        }

        setCategories(categoryNames);

        // Fetch all menu items directly
        const menuResponse = await fetch('http://localhost:3000/api/menu');

        interface RawMenuItem {
          id: string;
          name: string;
          price: string | number;
          category_id?: string | number;
          description?: string;
          image_url?: string;
          is_available?: boolean;
        }

        let menuItems: RawMenuItem[] = [];
        if (menuResponse.ok) {
          menuItems = await menuResponse.json();
        } else {
          // Use mock data instead of console.warn
          // Use mock data from coffee, tea, and pastries
          menuItems = [
            ...(await import('@/lib/mock-api').then((m) => m.mockFetchMenuItems('coffee'))),
            ...(await import('@/lib/mock-api').then((m) => m.mockFetchMenuItems('tea'))),
            ...(await import('@/lib/mock-api').then((m) => m.mockFetchMenuItems('pastries'))),
          ];
        }

        const availableItems = menuItems.filter((item) => item.is_available !== false);

        // Transform data to match frontend expectations
        const transformedItems = availableItems.map((item) => ({
          id: item.id,
          name: item.name,
          category: categoryMap.get(item.category_id) || 'Uncategorized',
          price: parseFloat(item.price),
          description: item.description,
          image: item.image_url || null,
          is_available: item.is_available,
        }));

        setAllMenuItems(transformedItems);

        // Calculate category statistics
        const stats = categoryNames.map((category: string) => {
          const categoryItems = transformedItems.filter(
            (item: MenuItem) => item.category === category
          );
          return {
            name: category,
            count: categoryItems.length,
            availableCount: categoryItems.filter((item: MenuItem) => item.is_available !== false)
              .length,
          };
        });
        setCategoryStats(stats);

        // Set default active tab to first category or 'all'
        if (categoryNames.length > 0) {
          setActiveTab('all');
        }
      } catch (_err) {
        setError('Failed to load menu data. Please try again later.');
        toast.error('Failed to load menu data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter items based on active tab and search criteria
  useEffect(() => {
    let items = [...allMenuItems];

    // Filter by category
    if (activeTab !== 'all') {
      items = items.filter((item) => item.category === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)
      );
    }

    // Sort items alphabetically by name (default sorting)
    items.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredItems(items);
  }, [allMenuItems, activeTab, searchQuery]);

  const totalItems = allMenuItems.length;

  const renderNoItemsFound = () => (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h2" sx={{ fontSize: '3rem', mb: 2 }}>
        ☕
      </Typography>
      <Typography variant="h5" sx={{ mb: 1 }}>
        No items found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {searchQuery
          ? `No items match "${searchQuery}" in ${activeTab === 'all' ? 'any category' : activeTab}`
          : `No items available in ${activeTab === 'all' ? 'any category' : activeTab}`}
      </Typography>
      {(activeTab !== 'all' || searchQuery) && (
        <Button variant="outlined" onClick={handleClearFilters}>
          View all items
        </Button>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Our Menu
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover our carefully crafted selection of beverages and treats
        </Typography>
      </Box>

      {/* Search Controls */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          variant="outlined"
          size="small"
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography color="text.secondary">Loading our delicious menu...</Typography>
        </Box>
      ) : error ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            textAlign: 'center',
            bgcolor: 'error.light',
            color: 'error.dark',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Error Loading Menu
          </Typography>
          <Typography variant="body2">{error}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Paper>
      ) : (
        <>
          {/* Category Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, overflowX: 'auto' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>All Items</span>
                    <Chip
                      label={totalItems}
                      size="small"
                      sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                    />
                  </Box>
                }
                value="all"
              />
              {categories.map((category) => {
                const stats = categoryStats.find((s) => s.name === category);
                return (
                  <Tab
                    key={category}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <span>{category}</span>
                        <Chip
                          label={stats?.availableCount || 0}
                          size="small"
                          sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                        />
                      </Box>
                    }
                    value={category}
                  />
                );
              })}
            </Tabs>
          </Box>

          {/* Results Summary */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              px: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {activeTab === 'all'
                ? `Showing ${filteredItems.length} of ${totalItems} items`
                : `${filteredItems.length} items in ${activeTab}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </Typography>
            {(activeTab !== 'all' || searchQuery) && (
              <Button size="small" onClick={handleClearFilters} startIcon={<ClearIcon />}>
                Clear filters
              </Button>
            )}
          </Box>

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            renderNoItemsFound()
          ) : (
            <Grid container spacing={3}>
              {filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'box-shadow 0.3s',
                      '&:hover': { boxShadow: 6 },
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="div"
                        sx={{
                          height: 200,
                          bgcolor: 'grey.100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.image &&
                        item.image !==
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOUI5QjlCIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K' ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = document.createElement('div');
                                fallback.textContent = 'No Image Available';
                                parent.appendChild(fallback);
                              }
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No Image Available
                          </Typography>
                        )}
                      </CardMedia>
                      <Chip
                        label={item.category}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                          color: 'text.primary',
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" component="h3" sx={{ fontSize: '1.1rem' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${item.price.toFixed(2)}
                        </Typography>
                      </Box>
                      {item.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.description}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAddToCart(item)}
                        sx={{ flexGrow: 1 }}
                      >
                        Add to Cart
                      </Button>
                      <WishlistButton menuItemId={item.id} size="small" />
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};
