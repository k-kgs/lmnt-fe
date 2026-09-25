import { Box, Stack, Typography } from '@mui/material';
import { day0Tokens } from '../../theme/day0Theme';
import { StepCard } from './StepCard';
import { Day0Icon } from './icons';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <StepCard onContinue={onNext} continueLabel="Let's go">
      <Box textAlign="center">
        <Typography variant="h4" sx={{ fontSize: 20, lineHeight: 1.35, mb: 1.25 }}>
          kiVo verifies your consistency and rewards it with real coins.
        </Typography>
        <Typography sx={{ color: day0Tokens.inkSoft, fontSize: 14, lineHeight: 1.55 }}>
          There are no wrong answers. Yours will shape what we build.
        </Typography>
        <Stack direction="row" gap={1} justifyContent="center" flexWrap="wrap" mt={2}>
          {[
            { icon: 'lock', label: 'Anonymous' },
            { icon: 'clock', label: '~2 min' },
            { icon: 'gift', label: 'New Member perk' },
          ].map((pill) => (
            <Stack
              key={pill.label}
              direction="row"
              alignItems="center"
              gap={0.6}
              sx={{
                fontSize: 11.5,
                fontWeight: 700,
                px: 1.4,
                py: 0.7,
                borderRadius: 99,
                bgcolor: day0Tokens.surface2,
                color: day0Tokens.inkSoft,
              }}
            >
              <Day0Icon name={pill.icon} sx={{ fontSize: '13px !important' }} />
              {pill.label}
            </Stack>
          ))}
        </Stack>
      </Box>
    </StepCard>
  );
}
