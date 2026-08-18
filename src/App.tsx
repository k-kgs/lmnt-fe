import {
  Box,
  Container,
  Typography,
  Chip,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useConfig } from './api/config';

function StatusPill() {
  const { isLoading, isError } = useConfig();
  if (isLoading) {
    return <Chip size="small" label="connecting…" color="default" />;
  }
  if (isError) {
    return <Chip size="small" label="backend offline" color="error" />;
  }
  return <Chip size="small" label="backend live" color="secondary" />;
}

function VerticalsPreview() {
  const { data, isLoading, isError, error } = useConfig();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Couldn't reach the Kayam backend: {(error as Error).message}
      </Alert>
    );
  }

  return (
    <Stack spacing={2} mt={3}>
      {data?.verticals.map((v) => {
        const challengeCount = data.challenges.filter(
          (c) => c.vertical_id === v.id,
        ).length;
        return (
          <Card key={v.id} variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="h5">{v.icon}</Typography>
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {v.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {challengeCount} active challenge{challengeCount === 1 ? '' : 's'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}

function App() {
  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Kayam
          </Typography>
          <StatusPill />
        </Stack>

        <Typography variant="h3" fontWeight={800} gutterBottom>
          Guide. Track.{' '}
          <Box component="span" color="secondary.main">
            Verify.
          </Box>{' '}
          <Box component="span" color="warning.main">
            Reward.
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          A consistency-rewards prototype. Pick a vertical, check in daily,
          earn coins — verified (mocked, for now) every step of the way.
        </Typography>

        <Button variant="contained" color="primary" size="large" fullWidth disabled>
          Get Started (coming soon)
        </Button>

        <Typography variant="overline" color="text.secondary" sx={{ mt: 5, display: 'block' }}>
          Live verticals
        </Typography>
        <VerticalsPreview />
      </Container>
    </Box>
  );
}

export default App;
