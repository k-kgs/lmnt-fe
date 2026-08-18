import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useConfig, type Challenge, type Vertical } from '../api/config';
import { useJoinChallenge } from '../api/challenges';
import { hasPhotoField } from '../lib/verticals';

type Mode = 'choose' | 'join' | 'goal';

export function OnboardingScreen() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useConfig();
  const [mode, setMode] = useState<Mode>('choose');
  const [selectedVertical, setSelectedVertical] = useState<Vertical | null>(null);
  const [goalTarget, setGoalTarget] = useState<number | ''>('');
  const joinChallenge = useJoinChallenge();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">Couldn't load Kayam's config. Try refreshing.</Alert>
      </Container>
    );
  }

  const joinableVerticals = data.verticals.filter((v) => !hasPhotoField(v));
  const joinableChallenges = data.challenges.filter((c) =>
    joinableVerticals.some((v) => v.id === c.vertical_id),
  );

  async function handleJoin(challenge: Challenge) {
    try {
      const uc = await joinChallenge.mutateAsync({ challengeId: challenge.id });
      navigate(`/checkin/${uc.id}`);
    } catch {
      // surfaced via joinChallenge.isError below
    }
  }

  async function handleSetGoal() {
    if (!selectedVertical) return;
    const templateChallenge = data!.challenges.find(
      (c) => c.vertical_id === selectedVertical.id && c.is_template,
    );
    if (!templateChallenge) return;
    try {
      const uc = await joinChallenge.mutateAsync({
        challengeId: templateChallenge.id,
        customGoal: goalTarget === '' ? undefined : { target: goalTarget },
      });
      navigate(`/checkin/${uc.id}`);
    } catch {
      // surfaced via joinChallenge.isError below
    }
  }

  if (mode === 'choose') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Let's get started
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Pick a challenge someone else is running, or set your own goal.
        </Typography>
        <Stack spacing={2}>
          <Card variant="outlined">
            <CardActionArea onClick={() => setMode('join')} sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  Join a Challenge
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Follow an influencer-led challenge with a built-in community.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card variant="outlined">
            <CardActionArea onClick={() => setMode('goal')} sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700}>
                  Set My Own Goal
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pick a vertical and track it your way.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Stack>
      </Container>
    );
  }

  if (mode === 'join') {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Button onClick={() => setMode('choose')} sx={{ mb: 2 }}>
          ← Back
        </Button>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Choose a challenge
        </Typography>
        {joinChallenge.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Couldn't join that challenge — try again.
          </Alert>
        )}
        <Stack spacing={2} mt={2}>
          {joinableChallenges.map((challenge) => {
            const vertical = joinableVerticals.find((v) => v.id === challenge.vertical_id);
            return (
              <Card key={challenge.id} variant="outlined">
                <CardActionArea
                  onClick={() => handleJoin(challenge)}
                  disabled={joinChallenge.isPending}
                  sx={{ p: 2 }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <Typography variant="h6">{vertical?.icon}</Typography>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {challenge.title}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Chip size="small" label={challenge.influencer_handle} />
                      <Chip size="small" label={`${challenge.member_count} members`} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {challenge.difficulty_stat}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      </Container>
    );
  }

  // mode === 'goal'
  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Button onClick={() => setMode('choose')} sx={{ mb: 2 }}>
        ← Back
      </Button>
      <Typography variant="h5" fontWeight={800} gutterBottom>
        Set your own goal
      </Typography>
      {!selectedVertical ? (
        <Stack spacing={2} mt={2}>
          {joinableVerticals.map((vertical) => (
            <Card key={vertical.id} variant="outlined">
              <CardActionArea onClick={() => setSelectedVertical(vertical)} sx={{ p: 2 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h6">{vertical.icon}</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {vertical.label}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      ) : (
        <Stack spacing={3} mt={2}>
          <Typography variant="body1">
            Vertical: <strong>{selectedVertical.label}</strong>
          </Typography>
          {joinChallenge.isError && <Alert severity="error">Couldn't set your goal — try again.</Alert>}
          <TextField
            label="Daily target (optional)"
            type="number"
            value={goalTarget}
            onChange={(e) => setGoalTarget(e.target.value === '' ? '' : Number(e.target.value))}
            fullWidth
          />
          <Button
            variant="contained"
            size="large"
            onClick={handleSetGoal}
            disabled={joinChallenge.isPending}
          >
            {joinChallenge.isPending ? 'Setting up…' : 'Start tracking'}
          </Button>
        </Stack>
      )}
    </Container>
  );
}
