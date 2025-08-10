import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';

// Material UI imports
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useCartDrawerStore } from '@/stores/cart-drawer-store';
import { useCartStore } from '@/stores/cart-store';

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export function FloatingCartButton() {
  const { items } = useCartStore();
  const { toggle } = useCartDrawerStore();
  const navigate = useNavigate();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleClick = () => {
    if (itemCount === 0) {
      navigate('/menu');
    } else {
      toggle();
    }
  };

  return (
    <StyledFab color="primary" aria-label="shopping cart" onClick={handleClick}>
      <StyledBadge badgeContent={itemCount} color="secondary" max={99}>
        <ShoppingCartIcon />
      </StyledBadge>
    </StyledFab>
  );
}
