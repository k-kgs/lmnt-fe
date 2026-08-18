import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Button,
  Paper,
} from '@mui/material';
import { useConfig } from '../api/config';
import { useMyChallenges } from '../api/challenges';
import { useCreateCheckin, type CreateCheckinResult } from '../api/checkins';
import { CheckinForm } from '../components/checkin/CheckinForm';
import { posthog } from '../lib/posthog';
import { useState } from 'react';

export function CheckinScreen() {
  const { userChallengeId } = useParams<{ userChallengeId: string }>();
  const navigate = useNavigate();
  const { data: config, isLoading: configLoading } = useConfig();
  const { data: myChallenges, isLoading: challengesLoading } = useMyChallenges();
  const createCheckin = useCreateCheckin();
  const [result, setResult] = useState<CreateCheckinResult | null>(null);

  if (configLoading || challengesLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const userChallenge = myChallenges?.find((uc) => uc.id === userChallengeId);
  const vertical = config?.verticals.find((v) => v.key === userChallenge?.vertical_key);

  if (!userChallenge || !vertical) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">Couldn't find that check-in. It may not exist.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </Container>
    );
  }

  async function handleSubmit(values: Record<string, unknown>) {
    if (!userChallengeId) return;
    try {
      const res = await createCheckin.mutateAsync({ userChallengeId, metricData: values });
      posthog.capture('checkin_completed', {
        vertical: vertical?.key,
        streak_after: res.CurrentStreak,
      });
      setResult(res);
    } catch {
      // error surfaced via createCheckin.isError below
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
        <Typography variant="h4">{vertical.icon}</Typography>
        <Typography variant="h5" fontWeight={800}>
          {userChallenge.challenge_title}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={4} sx={{ my: 3 }}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Streak
          </Typography>
          <Typography variant="h3" fontWeight={800} color="primary.main">
            {result?.CurrentStreak ?? userChallenge.current_streak}
          </Typography>
        </Box>
        {result && (
          <Box>
            <Typography variant="overline" color="text.secondary">
              Coins earned
            </Typography>
            <Typography variant="h3" fontWeight={800} color="warning.main">
              +{result.CoinsEarned}
            </Typography>
          </Box>
        )}
      </Stack>

      {result ? (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={700} color="secondary.main" gutterBottom>
            Checked in ✓
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Longest streak: {result.LongestStreak} days
          </Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </Button>
        </Paper>
      ) : (
        <>
          {createCheckin.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createCheckin.error instanceof Error
                ? createCheckin.error.message
                : "Couldn't submit check-in."}
            </Alert>
          )}
          <CheckinForm
            schema={vertical.input_schema}
            onSubmit={handleSubmit}
            submitting={createCheckin.isPending}
          />
        </>
      )}
    </Container>
  );
}
