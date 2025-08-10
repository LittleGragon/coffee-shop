// Material UI imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { toast } from 'sonner';
import { submitReservation } from '@/lib/api';

const partySizeOptions = [2, 3, 4, 5, 6, 7, 8];
const timeOptions = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
];

export function ReservationPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('');
  const [partySize, setPartySize] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !partySize || !name || !phone) {
      toast.error('Incomplete Form', {
        description: 'Please fill out all fields to make a reservation.',
      });
      return;
    }

    setIsSubmitting(true);
    const reservationDetails = {
      date,
      time,
      partySize: Number(partySize),
      name,
      phone,
    };

    try {
      const result = await submitReservation(reservationDetails);
      if (result.success) {
        toast.success('Reservation Successful!', {
          description: `Thank you, ${name}! Your table for ${partySize} on ${new Date(date).toLocaleDateString()} at ${time} is confirmed.`,
        });
        // Reset form
        setDate(new Date().toISOString().split('T')[0]);
        setTime('');
        setPartySize('');
        setName('');
        setPhone('');
      } else {
        toast.error('Reservation Failed', {
          description: result.message || 'Could not complete your reservation. Please try again.',
        });
      }
    } catch (_error) {
      toast.error('Reservation Failed', {
        description: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom fontWeight="bold">
          Book a Table
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Reserve your spot at our cozy café.
        </Typography>
      </Box>

      <Grid container spacing={4} maxWidth="md" sx={{ mx: 'auto' }}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader
              title="Reservation Details"
              subheader="Select a date, time, and party size"
            />
            <Box component="form" onSubmit={handleSubmit}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />

                <TextField
                  label="Phone Number"
                  placeholder="(123) 456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  required
                />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="party-size-label">Party Size</InputLabel>
                      <Select
                        labelId="party-size-label"
                        value={partySize}
                        label="Party Size"
                        onChange={(e) => setPartySize(e.target.value)}
                      >
                        {partySizeOptions.map((size) => (
                          <MenuItem key={size} value={String(size)}>
                            {size} people
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="time-label">Time</InputLabel>
                      <Select
                        labelId="time-label"
                        value={time}
                        label="Time"
                        onChange={(e) => setTime(e.target.value)}
                      >
                        {timeOptions.map((t) => (
                          <MenuItem key={t} value={t}>
                            {t}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <TextField
                  label="Date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0],
                  }}
                  fullWidth
                  required
                />
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                </Button>
              </CardActions>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 3,
              boxShadow: 3,
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=2070&auto=format&fit=crop"
              alt="Coffee shop interior"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 1,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
