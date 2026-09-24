import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { day0Tokens } from '../../theme/day0Theme';
import { Day0Icon } from '../../components/day0/icons';

export function LandingScreen() {
  const navigate = useNavigate();

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
      <Box sx={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Paper
          variant="outlined"
          sx={{ p: { xs: 3.5, sm: 4.5 }, borderRadius: '24px', borderColor: day0Tokens.mist, textAlign: 'center' }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2.25,
              borderRadius: '50%',
              bgcolor: day0Tokens.sunriseSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Fraunces', serif",
              fontWeight: 700,
              fontSize: 28,
              color: day0Tokens.sunrise,
            }}
          >
            0
          </Box>
          <Typography variant="h1" sx={{ fontSize: 30, mb: 3 }}>
            kiVo
          </Typography>

          <Stack direction="row" gap={1} justifyContent="center" flexWrap="wrap" mb={3.5}>
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

          <Button
            fullWidth
            variant="contained"
            disableElevation
            size="large"
            onClick={() => navigate('/survey')}
            sx={{ py: 1.6, bgcolor: day0Tokens.ink, '&:hover': { bgcolor: day0Tokens.ink } }}
          >
            Take the 2-minute survey
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
