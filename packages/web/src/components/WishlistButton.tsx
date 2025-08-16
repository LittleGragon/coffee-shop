import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// Material UI imports
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { toast } from 'sonner';
import { useWishlistStore } from '@/stores/wishlist-store';

// Types
import type { Product } from '@/types';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.secondary.main,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

interface WishlistButtonProps {
  itemId: string;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

export function WishlistButton({ itemId, size = 'medium', showCount = false }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, items } = useWishlistStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const isInWishlist = items.some((item) => item.id === itemId);
  const product = items.find((item) => item.id === itemId);

  const handleToggleWishlist = () => {
    if (isInWishlist && product) {
      removeFromWishlist(itemId);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      // For simplicity, we'll just add the ID if we don't have the full product
      addToWishlist({ id: itemId, name: "Item" } as Product);
      setIsAnimating(true);
      toast.success(`Item added to wishlist`);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <StyledIconButton
      onClick={handleToggleWishlist}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      size={size}
      className={isAnimating ? 'animate-wishlist-pulse' : ''}
      sx={{
        animation: isAnimating ? 'pulse 0.5s ease-in-out' : 'none',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      }}
    >
      {isInWishlist ? (
        <FavoriteIcon color="secondary" fontSize={size} />
      ) : (
        <FavoriteBorderIcon fontSize={size} />
      )}
    </StyledIconButton>
  );
}
