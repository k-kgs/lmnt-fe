import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { useConfig, type RedemptionItem } from '../api/config';
import { useWallet } from '../api/wallet';
import { useRedeem } from '../api/redemptions';

const SLOT_OPTIONS = ['Tomorrow, 10:00 AM', 'Tomorrow, 4:00 PM', 'In 2 days, 6:00 PM'];

type Step =
  | { name: 'list' }
  | { name: 'voucher-confirm'; item: RedemptionItem }
  | { name: 'consult-slots'; item: RedemptionItem }
  | { name: 'consult-confirm'; item: RedemptionItem; slot: string }
  | { name: 'done'; item: RedemptionItem; code: string };

export function RedeemHub() {
  const { data: config, isLoading: configLoading } = useConfig();
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const redeem = useRedeem();
  const [step, setStep] = useState<Step>({ name: 'list' });

  if (configLoading || walletLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!config || !wallet) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">Couldn't load the redeem hub. Try refreshing.</Alert>
      </Container>
    );
  }

  const canAfford = (item: RedemptionItem) => wallet.balance >= item.coin_cost;

  async function handleConfirmRedeem(item: RedemptionItem, extra?: { slot?: string }) {
    try {
      const result = await redeem.mutateAsync(item.id);
      setStep({ name: 'done', item, code: result.CodeOrSlot });
    } catch {
      // surfaced via redeem.isError below; extra kept for future slot logging
      void extra;
    }
  }

  if (step.name === 'done') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={800} color="secondary.main" gutterBottom>
            {step.item.type === 'voucher' ? 'Redeemed ✓' : 'Booked ✓'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {step.item.title}
          </Typography>
          <Chip label={step.code} color="primary" sx={{ fontSize: 16, py: 2.5, px: 1 }} />
          <Box mt={3}>
            <Button variant="contained" onClick={() => setStep({ name: 'list' })}>
              Back to Redeem Hub
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (step.name === 'consult-confirm') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Button onClick={() => setStep({ name: 'consult-slots', item: step.item })} sx={{ mb: 2 }}>
          ← Back
        </Button>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Confirm booking
        </Typography>
        {redeem.isError && <Alert severity="error" sx={{ mb: 2 }}>Couldn't book that slot — try again.</Alert>}
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {step.item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {step.slot} · {step.item.coin_cost} coins
          </Typography>
        </Paper>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={redeem.isPending}
          onClick={() => handleConfirmRedeem(step.item, { slot: step.slot })}
        >
          {redeem.isPending ? 'Booking…' : 'Confirm booking'}
        </Button>
      </Container>
    );
  }

  if (step.name === 'consult-slots') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Button onClick={() => setStep({ name: 'list' })} sx={{ mb: 2 }}>
          ← Back
        </Button>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Pick a slot
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step.item.title}
        </Typography>
        <Stack spacing={1.5}>
          {SLOT_OPTIONS.map((slot) => (
            <Card key={slot} variant="outlined">
              <CardActionArea
                onClick={() => setStep({ name: 'consult-confirm', item: step.item, slot })}
                sx={{ p: 2 }}
              >
                {slot}
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Container>
    );
  }

  if (step.name === 'voucher-confirm') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Button onClick={() => setStep({ name: 'list' })} sx={{ mb: 2 }}>
          ← Back
        </Button>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Confirm redemption
        </Typography>
        {redeem.isError && <Alert severity="error" sx={{ mb: 2 }}>Couldn't redeem that — try again.</Alert>}
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            {step.item.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {step.item.coin_cost} coins · balance after: {wallet.balance - step.item.coin_cost}
          </Typography>
        </Paper>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={redeem.isPending}
          onClick={() => handleConfirmRedeem(step.item)}
        >
          {redeem.isPending ? 'Redeeming…' : 'Confirm redemption'}
        </Button>
      </Container>
    );
  }

  // step.name === 'list'
  const vouchers = config.redemption_items.filter((i) => i.type === 'voucher');
  const consultations = config.redemption_items.filter((i) => i.type === 'consultation');

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Redeem
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Balance: <strong>{wallet.balance} coins</strong>
      </Typography>

      <Typography variant="overline" color="text.secondary">
        Vouchers
      </Typography>
      <Stack spacing={1.5} mt={1} mb={4}>
        {vouchers.map((item) => (
          <RedeemItemCard
            key={item.id}
            item={item}
            affordable={canAfford(item)}
            onClick={() => setStep({ name: 'voucher-confirm', item })}
          />
        ))}
      </Stack>

      <Typography variant="overline" color="text.secondary">
        Expert consultations
      </Typography>
      <Stack spacing={1.5} mt={1}>
        {consultations.map((item) => (
          <RedeemItemCard
            key={item.id}
            item={item}
            affordable={canAfford(item)}
            onClick={() => setStep({ name: 'consult-slots', item })}
          />
        ))}
      </Stack>
    </Container>
  );
}

function RedeemItemCard({
  item,
  affordable,
  onClick,
}: {
  item: RedemptionItem;
  affordable: boolean;
  onClick: () => void;
}) {
  const meta = item.metadata as { brand?: string; rating?: number; duration_min?: number };
  return (
    <Card variant="outlined" sx={{ opacity: affordable ? 1 : 0.6 }}>
      <CardActionArea onClick={onClick} disabled={!affordable} sx={{ p: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {meta.brand ?? (meta.rating ? `★ ${meta.rating} · ${meta.duration_min} min` : '')}
              </Typography>
            </Box>
            <Chip
              label={`${item.coin_cost} coins`}
              color={affordable ? 'warning' : 'default'}
              size="small"
            />
          </Stack>
          {!affordable && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              Not enough coins yet
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
