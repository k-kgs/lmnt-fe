import { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { day0Tokens } from '../../theme/day0Theme';
import { StepCard } from './StepCard';
import { Day0Icon } from './icons';
import { BASE_COINS, EMAIL_BONUS_COINS, type SurveyAnswers } from '../../hooks/useSurveyFlow';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WaitlistStep({
  onAnswer,
  onNext,
  onBack,
}: {
  onAnswer: (patch: Partial<SurveyAnswers>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [email, setEmail] = useState('');
  const valid = EMAIL_RE.test(email.trim());
  const touched = email.trim() !== '';

  const join = () => {
    if (!valid) return;
    onAnswer({ email: email.trim(), emailChoice: 'given' });
    onNext();
  };
  const skip = () => {
    onAnswer({ emailChoice: 'skipped' });
    onNext();
  };

  return (
    <StepCard onBack={onBack}>
      <Stack direction="row" alignItems="center" gap={1.25}>
        <Day0Icon name="gift" sx={{ color: day0Tokens.sage }} />
        <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Want first access when Day0 launches?</Typography>
      </Stack>
      <Typography sx={{ fontSize: 12.5, color: day0Tokens.inkSoft, lineHeight: 1.5, mt: 0.75 }}>
        Join the Day0 waitlist and claim +{EMAIL_BONUS_COINS} bonus coins on top of your {BASE_COINS}-coin New
        Member grant. Totally optional.
      </Typography>
      <TextField
        fullWidth
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mt: 1.75 }}
      />
      {touched && !valid && (
        <Typography sx={{ fontSize: 12, color: day0Tokens.danger, mt: 0.75 }}>
          That doesn't look like a valid email.
        </Typography>
      )}
      <Box mt={1.5}>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          disabled={!valid}
          onClick={join}
          sx={{ py: 1.5, bgcolor: day0Tokens.ink, '&:hover': { bgcolor: day0Tokens.ink } }}
        >
          Join waitlist &amp; claim +{EMAIL_BONUS_COINS} coins
        </Button>
        <Button fullWidth variant="text" onClick={skip} sx={{ mt: 1, color: day0Tokens.inkSoft, fontSize: 12.5 }}>
          Skip — keep base {BASE_COINS}-coin bonus
        </Button>
      </Box>
    </StepCard>
  );
}
