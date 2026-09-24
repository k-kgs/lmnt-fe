import { Box, LinearProgress, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { day0Tokens } from '../../theme/day0Theme';

export function Day0Shell({ progressPct, progressLabel, children }: {
  progressPct: number;
  progressLabel: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        py: 3.5,
        background: `radial-gradient(60% 50% at 50% -10%, ${day0Tokens.sunriseSoft} 0%, transparent 60%), ${day0Tokens.paper}`,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" gap={1.25} mb={2.5}>
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              bgcolor: day0Tokens.skySoft,
              color: day0Tokens.sky,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: 15,
              flex: 'none',
            }}
          >
            0
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 14, letterSpacing: '0.01em', lineHeight: 1.2 }}>
              kiVo
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 500,
                color: day0Tokens.inkSoft,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {progressLabel}
            </Typography>
          </Box>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progressPct}
          sx={{
            height: 6,
            borderRadius: 99,
            bgcolor: day0Tokens.mist,
            mb: 3,
            '& .MuiLinearProgress-bar': {
              borderRadius: 99,
              background: `linear-gradient(90deg, ${day0Tokens.sky}, ${day0Tokens.sunrise})`,
            },
          }}
        />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>{children}</Box>
      </Box>
    </Box>
  );
}
