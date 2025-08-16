import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { useCartStore, type MenuItem as CartMenuItem } from '@/stores/cart-store';

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string | null;
  is_available?: boolean;
}

const safeStr = (val: any): string => {
  if (val === null || val === undefined) return '';
  const t = typeof val;
  if (t === 'string' || t === 'number' || t === 'bigint' || t === 'boolean') return String(val);
  return '';
};

function MenuPage() {
  const { addToCart } = useCartStore();

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const [items, setItems] = useState<MenuItem[]>([]);
  const [loadingItems, setLoadingItems] = useState<boolean>(true);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  // Fetch categories once
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetch('/api/menu/categories', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const json = await res.json();
        const list = Array.isArray(json) ? json : json?.data;
        const normalized: string[] = Array.isArray(list) ? list.map((c) => String(c)) : [];
        if (!cancelled) setCategories(normalized);
      } catch (e: any) {
        toast.error(safeStr(e?.message || 'Failed to load categories'));
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch items whenever filters change
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoadingItems(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
        if (showAvailableOnly) params.set('isAvailable', 'true');
        const res = await fetch(`/api/menu?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch menu items');
        const json = await res.json();
        const list = Array.isArray(json) ? json : json?.data;
        const normalized: MenuItem[] = (list || []).map((item: any) => ({
          id: item.id,
          name: safeStr(item.name),
          category: safeStr(item.category ?? 'Uncategorized'),
          price: Number.parseFloat(String(item.price)),
          description: typeof item.description === 'string' ? item.description : undefined,
          image: item.image_url ?? '',
          is_available: item.is_available,
        }));
        if (!cancelled) setItems(normalized);
      } catch (e: any) {
        toast.error(safeStr(e?.message || 'Failed to load menu items'));
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoadingItems(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, showAvailableOnly]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const name = it.name?.toLowerCase() || '';
      const desc = it.description?.toLowerCase() || '';
      const cat = it.category?.toLowerCase() || '';
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [items, search]);

  const handleAddToCart = (item: MenuItem) => {
    const cartItem: CartMenuItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      image: item.image ?? '',
      is_available: item.is_available,
    };
    addToCart(cartItem);
    toast.success(`${item.name} added to cart`);
  };

  const renderSkeletons = () => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
      }}
    >
      {Array.from({ length: 9 }).map((_, idx) => (
        <Card key={idx} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Skeleton variant="rectangular" height={200} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Skeleton width="60%" />
            <Skeleton width="40%" />
            <Skeleton width="90%" />
          </CardContent>
          <CardActions>
            <Skeleton variant="rectangular" height={36} width={120} />
          </CardActions>
        </Card>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Our Menu
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}>
                <SearchIcon fontSize="small" />
              </Box>
            ),
          }}
        />
        <Divider flexItem orientation="vertical" sx={{ mx: 1, display: { xs: 'none', sm: 'block' } }} />
        <FormControlLabel
          control={
            <Switch
              checked={showAvailableOnly}
              onChange={(_, v) => setShowAvailableOnly(v)}
              color="primary"
            />
          }
          label="Available only"
        />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 3 }}>
        <Chip
          label="All"
          color={selectedCategory === 'All' ? 'primary' : 'default'}
          onClick={() => setSelectedCategory('All')}
          variant={selectedCategory === 'All' ? 'filled' : 'outlined'}
        />
        {loadingCategories ? (
          <>
            <Skeleton variant="rounded" width={80} height={28} />
            <Skeleton variant="rounded" width={90} height={28} />
            <Skeleton variant="rounded" width={70} height={28} />
          </>
        ) : (
          categories.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              color={selectedCategory === cat ? 'primary' : 'default'}
              onClick={() => setSelectedCategory(cat)}
              variant={selectedCategory === cat ? 'filled' : 'outlined'}
            />
          ))
        )}
      </Stack>

      {loadingItems ? (
        renderSkeletons()
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No items found. Try adjusting filters or search.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {filtered.map((item) => (
            <Card key={item.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {typeof item.image === 'string' && item.image !== '' && (
                <CardMedia component="img" height="200" image={item.image} alt={safeStr(item.name)} />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2">
                  {safeStr(item.name)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                  ${Number.isFinite(item.price) ? item.price.toFixed(2) : '0.00'}
                </Typography>
                {typeof item.description === 'string' && item.description && (
                  <Typography variant="body2" color="text.secondary">
                    {safeStr(item.description)}
                  </Typography>
                )}
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Category: {safeStr(item.category)}
                </Typography>
                {item.is_available === false && (
                  <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                    Currently unavailable
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  disabled={item.is_available === false}
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default dynamic(() => Promise.resolve(MenuPage), { ssr: false });