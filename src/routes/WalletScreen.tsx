import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useWallet, RUPEES_PER_COIN } from '../api/wallet';

export function WalletScreen() {
  const navigate = useNavigate();
  const { data: wallet, isLoading, isError } = useWallet();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError || !wallet) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">Couldn't load your wallet. Try refreshing.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Wallet
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 2, textAlign: 'center' }}>
        <Typography variant="h2" fontWeight={800} color="warning.main">
          {wallet.balance}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          coins · ≈ ₹{(wallet.balance * RUPEES_PER_COIN).toFixed(0)}
        </Typography>
      </Paper>

      <Button variant="contained" fullWidth size="large" onClick={() => navigate('/redeem')} sx={{ mb: 4 }}>
        Redeem
      </Button>

      <Typography variant="overline" color="text.secondary">
        Activity
      </Typography>
      <List disablePadding>
        {wallet.transactions.map((tx) => (
          <ListItem key={tx.id} divider sx={{ px: 0 }}>
            <ListItemText
              primary={tx.reason}
              secondary={new Date(tx.created_at).toLocaleDateString()}
            />
            <Chip
              label={`${tx.delta > 0 ? '+' : ''}${tx.delta}`}
              color={tx.delta > 0 ? 'secondary' : 'default'}
              size="small"
            />
          </ListItem>
        ))}
        {wallet.transactions.length === 0 && (
          <Stack alignItems="center" py={4}>
            <Typography variant="body2" color="text.secondary">
              No activity yet — check in to start earning coins.
            </Typography>
          </Stack>
        )}
      </List>
    </Container>
  );
}
