import { Box, Stack, Typography } from '@mui/material';
import { day0Tokens } from '../../theme/day0Theme';
import { StepCard } from './StepCard';
import { Day0Icon } from './icons';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <StepCard onContinue={onNext} continueLabel="Let's go">
      <Box textAlign="center">
        <Box
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 2,
            borderRadius: '50%',
            bgcolor: day0Tokens.sunriseSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Fraunces', serif",
            fontWeight: 700,
            fontSize: 26,
            color: day0Tokens.sunrise,
          }}
        >
          0
        </Box>
        <Typography variant="h4" sx={{ fontSize: 25, mb: 1.25 }}>
          A 2-minute read on
          <br />
          how you build habits.
        </Typography>
        <Typography sx={{ color: day0Tokens.inkSoft, fontSize: 14, lineHeight: 1.55, mb: 0.5 }}>
          Day0 verifies your consistency and rewards it with real coins.
        </Typography>
        <Typography sx={{ color: day0Tokens.inkSoft, fontSize: 14, lineHeight: 1.55 }}>
          Nothing here is a test — just help us build the right thing, before we build it.
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
