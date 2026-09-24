import { useState } from 'react';
import { Box, Button, Paper, Stack, Typography, keyframes } from '@mui/material';
import { day0Tokens } from '../../theme/day0Theme';
import { Day0Icon } from './icons';
import { BASE_COINS, EMAIL_BONUS_COINS, computePersona, type SurveyAnswers } from '../../hooks/useSurveyFlow';

const pulse = keyframes`
  0% { transform: scale(.85); opacity: .9; }
  70% { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
`;

const COLOR_MAP: Record<string, string> = {
  sunrise: day0Tokens.sunrise,
  plum: day0Tokens.plum,
  sky: day0Tokens.sky,
  sage: day0Tokens.sage,
};

export function ResultStep({ answers, onRestart }: { answers: SurveyAnswers; onRestart: () => void }) {
  const persona = computePersona(answers);
  const color = COLOR_MAP[persona.colorToken];
  const [toast, setToast] = useState('');

  const shareText = `I'm a ${persona.name.replace(/^The /, '')} according to kiVo's Day 0 Check-In — curious what you are?`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyResult = async () => {
    const full = `${shareText} ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(full);
      setToast('Copied to clipboard');
    } catch {
      setToast("Couldn't copy — long-press to select");
    }
    setTimeout(() => setToast(''), 1800);
  };

  return (
    <Stack>
      <Paper
        sx={{
          borderRadius: '24px',
          p: { xs: 3.5, sm: 4 },
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(155deg, ${color}, color-mix(in srgb, ${color} 55%, ${day0Tokens.personaDeep}))`,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 1.75,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,.16)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -10,
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,.5)',
              animation: `${pulse} 2.2s ease-out infinite`,
            },
          }}
        >
          <Day0Icon name={persona.icon} sx={{ fontSize: 30, color: '#fff' }} />
        </Box>
        <Typography variant="h4" sx={{ fontSize: 26, color: '#fff', mb: 1.25 }}>
          {persona.name}
        </Typography>
        <Typography sx={{ fontSize: 14.5, lineHeight: 1.55, opacity: 0.95 }}>{persona.line}</Typography>
      </Paper>

      <Stack
        sx={{ mt: 1.75, bgcolor: day0Tokens.sageSoft, borderRadius: '18px', p: 2.25 }}
      >
        <Typography sx={{ fontSize: 14 }}>
          {answers.emailChoice === 'given' ? (
            <>
              <Box component="b" sx={{ color: day0Tokens.sage }}>
                Thank you for helping us shape our product. We'll reach out shortly.
              </Box>{' '}
              {BASE_COINS + EMAIL_BONUS_COINS} New Member coins are waiting for you at launch.
            </>
          ) : (
            <>
              <Box component="b" sx={{ color: day0Tokens.sage }}>
                Thank you for helping us shape our product.
              </Box>{' '}
              {BASE_COINS} bonus coins secured for whenever kiVo launches.
            </>
          )}
        </Typography>
      </Stack>

      <Stack direction="row" gap={1.25} mt={2}>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          component="a"
          href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
          target="_blank"
          rel="noopener"
          sx={{ bgcolor: '#25D366', color: '#04240f', '&:hover': { bgcolor: '#25D366' } }}
        >
          Share on WhatsApp
        </Button>
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={copyResult}
          sx={{ bgcolor: day0Tokens.surface2, color: day0Tokens.ink, '&:hover': { bgcolor: day0Tokens.surface2 } }}
        >
          Copy result
        </Button>
      </Stack>

      <Button variant="text" onClick={onRestart} sx={{ mt: 2, alignSelf: 'flex-start', color: day0Tokens.inkSoft }}>
        Start over
      </Button>

      {toast && (
        <Box
          sx={{
            position: 'fixed',
            left: '50%',
            bottom: 22,
            transform: 'translateX(-50%)',
            bgcolor: day0Tokens.ink,
            color: day0Tokens.paper,
            px: 2,
            py: 1.25,
            borderRadius: 99,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {toast}
        </Box>
      )}
    </Stack>
  );
}
