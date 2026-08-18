import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useConfig } from '../api/config';
import { useMyChallenges } from '../api/challenges';
import { useLeaderboard } from '../api/community';
import { useAuth } from '../context/AuthContext';

export function ChallengeDetailScreen() {
  const { userChallengeId } = useParams<{ userChallengeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: config, isLoading: configLoading } = useConfig();
  const { data: myChallenges, isLoading: challengesLoading } = useMyChallenges();

  const userChallenge = myChallenges?.find((uc) => uc.id === userChallengeId);
  // ListUserChallengesForUser (GET /api/user-challenges) doesn't return a
  // challenge_id, only challenge_title — resolved here against useConfig(),
  // which does have both, rather than requiring a BE change for this pass.
  const challenge = config?.challenges.find((c) => c.title === userChallenge?.challenge_title);

  const { data: leaderboard, isLoading: leaderboardLoading, isError } = useLeaderboard(challenge?.id);

  if (configLoading || challengesLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!userChallenge || !challenge) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">Couldn't find that challenge.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
          Back to dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {challenge.title}
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        <Chip size="small" label={challenge.influencer_handle} />
        <Chip size="small" label={`${challenge.member_count} members`} />
      </Stack>

      <Typography variant="overline" color="text.secondary">
        Leaderboard
      </Typography>

      {leaderboardLoading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress size={24} />
        </Box>
      ) : isError ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Couldn't load the leaderboard.
        </Alert>
      ) : (
        <List>
          {leaderboard?.map((entry, i) => (
            <ListItem
              key={entry.user_challenge_id}
              divider
              sx={{
                bgcolor: entry.user_id === user?.id ? 'action.selected' : 'transparent',
                borderRadius: 1,
              }}
            >
              <Avatar sx={{ width: 28, height: 28, mr: 2, fontSize: 13 }}>{i + 1}</Avatar>
              <ListItemText primary={entry.name} />
              <Chip
                size="small"
                color="primary"
                label={`${entry.current_streak} day streak`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}
