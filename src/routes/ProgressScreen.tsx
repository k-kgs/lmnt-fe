import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useConfig } from '../api/config';
import { useMyChallenges } from '../api/challenges';
import { useTrend, useAdherence } from '../api/insights';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKEND_DAYS = new Set([0, 6]);

function adherenceInsight(points: { day_of_week: number; checkin_count: number }[]): string {
  if (points.length === 0) return "No check-ins yet — your pattern will show up here once you've logged a few.";

  const weekday = points.filter((p) => !WEEKEND_DAYS.has(p.day_of_week));
  const weekend = points.filter((p) => WEEKEND_DAYS.has(p.day_of_week));
  const avg = (arr: typeof points) => (arr.length ? arr.reduce((s, p) => s + p.checkin_count, 0) / arr.length : 0);
  const weekdayAvg = avg(weekday);
  const weekendAvg = avg(weekend);

  const lowest = [...points].sort((a, b) => a.checkin_count - b.checkin_count)[0];

  if (Math.abs(weekdayAvg - weekendAvg) < 0.5) {
    return 'Your consistency is steady across the whole week.';
  }
  if (weekendAvg < weekdayAvg) {
    return `You're most consistent on weekdays — ${DAY_LABELS[lowest.day_of_week]} is where you're most likely to skip.`;
  }
  return `Weekends are your strong suit — watch out for ${DAY_LABELS[lowest.day_of_week]}, your lowest day.`;
}

export function ProgressScreen() {
  const { data: config } = useConfig();
  const { data: myChallenges, isLoading, isError } = useMyChallenges();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError || !myChallenges) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="error">Couldn't load your progress. Try refreshing.</Alert>
      </Container>
    );
  }

  if (myChallenges.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Alert severity="info">Join a challenge to start seeing your progress.</Alert>
      </Container>
    );
  }

  const current = myChallenges.find((uc) => uc.id === selectedId) ?? myChallenges[0];
  const vertical = config?.verticals.find((v) => v.key === current.vertical_key);
  const numberField = vertical?.input_schema.find((f) => f.type === 'number');

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Progress
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1 }}>
        {myChallenges.map((uc) => (
          <Chip
            key={uc.id}
            label={uc.challenge_title}
            color={uc.id === current.id ? 'primary' : 'default'}
            onClick={() => setSelectedId(uc.id)}
          />
        ))}
      </Stack>

      {numberField && <TrendCard userChallengeId={current.id} field={numberField} />}
      <AdherenceCard userChallengeId={current.id} />
    </Container>
  );
}

function TrendCard({
  userChallengeId,
  field,
}: {
  userChallengeId: string;
  field: { key: string; label: string; unit?: string };
}) {
  const { data, isLoading } = useTrend(userChallengeId, field.key);

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {field.label}
        {field.unit ? ` (${field.unit})` : ''} trend
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={24} />
        </Box>
      ) : !data || data.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Not enough check-ins yet to plot a trend.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <XAxis dataKey="date" hide />
            <YAxis width={32} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#ff5a1f" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

function AdherenceCard({ userChallengeId }: { userChallengeId: string }) {
  const { data, isLoading } = useAdherence(userChallengeId);

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        Weekly pattern
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mb: 2 }}>
            {DAY_LABELS.map((label, i) => {
              const point = data?.find((p) => p.day_of_week === i);
              return (
                <Box key={label} textAlign="center">
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: point?.checkin_count ? 'secondary.main' : 'action.disabledBackground',
                      color: point?.checkin_count ? 'secondary.contrastText' : 'text.disabled',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {point?.checkin_count ?? 0}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {label}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {adherenceInsight(data ?? [])}
          </Typography>
        </>
      )}
    </Paper>
  );
}
