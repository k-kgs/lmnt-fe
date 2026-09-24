import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { day0Tokens } from '../../theme/day0Theme';
import { Day0Icon } from './icons';

export function OptionButton({
  label,
  icon,
  selected,
  onClick,
  multi,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.75,
        borderRadius: '16px',
        border: '1.5px solid',
        borderColor: selected ? day0Tokens.sky : day0Tokens.mist,
        bgcolor: selected ? day0Tokens.skySoft : day0Tokens.surface,
        color: selected ? day0Tokens.sky : day0Tokens.ink,
        justifyContent: 'flex-start',
        textAlign: 'left',
        fontWeight: 600,
        fontSize: 14.5,
        transition: 'border-color .15s, background .15s',
      }}
    >
      <Box
        sx={{
          width: 20,
          height: 20,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: multi ? '6px' : '50%',
          border: '2px solid',
          borderColor: selected ? day0Tokens.sky : day0Tokens.inkSoft,
          bgcolor: selected ? day0Tokens.sky : 'transparent',
        }}
      >
        {selected && (
          <Box
            sx={{
              width: multi ? 10 : 8,
              height: multi ? 10 : 8,
              borderRadius: multi ? '2px' : '50%',
              bgcolor: day0Tokens.paper,
            }}
          />
        )}
      </Box>
      {icon && <Day0Icon name={icon} sx={{ fontSize: 18, color: selected ? day0Tokens.sky : day0Tokens.inkSoft }} />}
      <Stack sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 14.5, color: 'inherit' }}>{label}</Typography>
      </Stack>
    </ButtonBase>
  );
}
