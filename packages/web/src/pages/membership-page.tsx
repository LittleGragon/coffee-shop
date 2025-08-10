import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
// Icons
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
// Material UI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { fetchMemberData, processTopUp } from '@/lib/api';

type MemberData = {
  name: string;
  balance: number;
  memberSince: string;
  orderHistory: { id: string; date: string; items: string; total: number }[];
};

type MembershipTab = 'profile' | 'balance' | 'history';

export function MembershipPage() {
  const [activeTab, setActiveTab] = useState<MembershipTab>('profile');
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMemberData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchMemberData();
      setMemberData(data);
    } catch (_error) {
      // Error would be logged to a proper logging service in production
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemberData();
  }, [loadMemberData]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading your membership details...</Typography>
        </Box>
      );
    }
    if (!memberData) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="error">Could not load member data.</Typography>
        </Box>
      );
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileSection user={memberData} />;
      case 'balance':
        return <BalanceSection balance={memberData.balance} onSuccessfulTopUp={loadMemberData} />;
      case 'history':
        return <OrderHistorySection history={memberData.orderHistory} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom fontWeight="bold">
          Membership
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Your personal coffee hub.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ position: 'sticky', top: 24 }}>
            <List component="nav">
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'profile'}
                  onClick={() => setActiveTab('profile')}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'balance'}
                  onClick={() => setActiveTab('balance')}
                >
                  <ListItemIcon>
                    <AccountBalanceWalletIcon />
                  </ListItemIcon>
                  <ListItemText primary="Balance & Top-up" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'history'}
                  onClick={() => setActiveTab('history')}
                >
                  <ListItemIcon>
                    <ShoppingBagIcon />
                  </ListItemIcon>
                  <ListItemText primary="Order History" />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          {renderContent()}
        </Grid>
      </Grid>
    </Container>
  );
}

function ProfileSection({ user }: { user: { name: string; memberSince: string } }) {
  return (
    <Card elevation={3}>
      <CardHeader title="Personal Information" subheader="Manage your account details" />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField label="Full Name" defaultValue={user.name} fullWidth />

        <TextField
          label="Email"
          type="email"
          defaultValue={`${user.name.toLowerCase().replace(' ', '.')}@example.com`}
          fullWidth
        />

        <Typography variant="body2" color="text.secondary">
          Member since: {user.memberSince}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button variant="contained" color="secondary">
          Save Changes
        </Button>
      </CardActions>
    </Card>
  );
}

function BalanceSection({
  balance,
  onSuccessfulTopUp,
}: {
  balance: number;
  onSuccessfulTopUp: () => void;
}) {
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTopUp = async (amount: number) => {
    setIsSubmitting(true);
    try {
      const result = await processTopUp(amount);
      if (result.success) {
        toast.success('Top-up Successful!', {
          description: `$${amount.toFixed(2)} has been added. Your new balance is $${result.newBalance?.toFixed(2)}.`,
        });
        onSuccessfulTopUp();
        setCustomAmount('');
      } else {
        toast.error('Top-up Failed', {
          description: result.message || 'An error occurred.',
        });
      }
    } catch (_error) {
      toast.error('Top-up Failed', {
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Card elevation={3}>
        <CardHeader title="Current Balance" />
        <CardContent>
          <Typography variant="h3" color="primary" fontWeight="bold">
            ${balance.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={3}>
        <CardHeader
          title="Top-up Your Balance"
          subheader="Add funds to your account for faster checkout"
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ButtonGroup variant="outlined" fullWidth>
            {[20, 50, 100].map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? 'contained' : 'outlined'}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount('');
                }}
                disabled={isSubmitting}
                color="secondary"
              >
                ${amount}
              </Button>
            ))}
          </ButtonGroup>

          {selectedAmount && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  handleTopUp(selectedAmount);
                  setSelectedAmount(null);
                }}
                disabled={isSubmitting}
                startIcon={<CreditCardIcon />}
              >
                {isSubmitting ? 'Adding...' : `Add $${selectedAmount}`}
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Or enter a custom amount:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Custom amount"
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(null);
                }}
                disabled={isSubmitting}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleTopUp(parseFloat(customAmount))}
                disabled={isSubmitting || !customAmount || parseFloat(customAmount) <= 0}
                startIcon={<CreditCardIcon />}
              >
                {isSubmitting ? 'Adding...' : 'Add'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function OrderHistorySection({
  history,
}: {
  history: { id: string; date: string; items: string; total: number }[];
}) {
  return (
    <Card elevation={3}>
      <CardHeader title="Order History" subheader="Review your past purchases" />
      <CardContent>
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((order) => (
                <TableRow key={order.id}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                    {order.id}
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
