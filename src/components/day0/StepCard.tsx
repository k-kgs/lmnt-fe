import { Button, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { day0Tokens } from '../../theme/day0Theme';

export function StepCard({
  eyebrow,
  question,
  helper,
  children,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled,
  onBack,
  hideFooter,
}: {
  eyebrow?: string;
  question?: string;
  helper?: string;
  children: ReactNode;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  onBack?: () => void;
  hideFooter?: boolean;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2.75, sm: 3.25 },
        borderRadius: 5,
        borderColor: day0Tokens.mist,
        bgcolor: day0Tokens.surface,
      }}
    >
      {eyebrow && (
        <Typography
          sx={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: day0Tokens.sky,
            mb: 1.25,
          }}
        >
          {eyebrow}
        </Typography>
      )}
      {question && (
        <Typography variant="h4" sx={{ fontSize: 22, lineHeight: 1.25, fontWeight: 600, mb: 0.75 }}>
          {question}
        </Typography>
      )}
      {helper && (
        <Typography sx={{ fontSize: 12.5, color: day0Tokens.inkSoft, mt: 1.75, mb: -0.5 }}>{helper}</Typography>
      )}
      {children}
      {!hideFooter && (onContinue || onBack) && (
        <Stack gap={1.25} pt={2.25}>
          {onContinue && (
            <Button
              variant="contained"
              disableElevation
              size="large"
              onClick={onContinue}
              disabled={continueDisabled}
              sx={{ py: 1.6, bgcolor: day0Tokens.ink, color: day0Tokens.paper, '&:hover': { bgcolor: day0Tokens.ink } }}
            >
              {continueLabel}
            </Button>
          )}
          {onBack && (
            <Button variant="text" onClick={onBack} sx={{ color: day0Tokens.inkSoft, fontSize: 13, fontWeight: 600 }}>
              ← Back
            </Button>
          )}
        </Stack>
      )}
    </Paper>
  );
}
