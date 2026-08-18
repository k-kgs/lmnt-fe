import { Navigate, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { useConfig } from '../api/config';
import { useMyChallenges } from '../api/challenges';
import { useAuth } from '../context/AuthContext';

export function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: config } = useConfig();
  const { data: myChallenges, isLoading, isError } = useMyChallenges();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">Couldn't load your challenges. Try refreshing.</Alert>
      </Container>
    );
  }

  if (!myChallenges || myChallenges.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box mb={4}>
        <Typography variant="h5" fontWeight={800}>
          Hey {user?.name.split(' ')[0]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Keep the streak alive.
        </Typography>
      </Box>

      <Stack spacing={2}>
        {myChallenges.map((uc) => {
          const vertical = config?.verticals.find((v) => v.key === uc.vertical_key);
          const checkedInToday = uc.last_checkin_date === new Date().toISOString().slice(0, 10);
          return (
            <Card key={uc.id} variant="outlined">
              <CardActionArea
                onClick={() => navigate(`/checkin/${uc.id}`)}
                sx={{ p: 2 }}
                disabled={checkedInToday}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                        <Typography variant="h6">{vertical?.icon}</Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {uc.challenge_title}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {vertical?.label}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="h4" fontWeight={800} color="primary.main">
                        {uc.current_streak}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        day streak
                      </Typography>
                    </Box>
                  </Stack>
                  {checkedInToday && (
                    <Chip size="small" label="Checked in today" color="secondary" sx={{ mt: 1.5 }} />
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Stack>

      <Button sx={{ mt: 3 }} onClick={() => navigate('/onboarding')}>
        + Add another challenge
      </Button>
    </Container>
  );
}
