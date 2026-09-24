import { Chip, Stack } from '@mui/material';
import { day0Tokens } from '../../theme/day0Theme';
import { Day0Icon } from './icons';

export interface ChipDef {
  value: string;
  label: string;
  icon?: string;
}

export function ChipRow({
  options,
  selected,
  onSelect,
}: {
  options: ChipDef[];
  selected?: string | string[];
  onSelect: (value: string) => void;
}) {
  const isChipSelected = (value: string) => (Array.isArray(selected) ? selected.includes(value) : selected === value);

  return (
    <Stack direction="row" flexWrap="wrap" gap={1} mt={1.75}>
      {options.map((opt) => {
        const isSelected = isChipSelected(opt.value);
        return (
          <Chip
            key={opt.value}
            label={opt.label}
            icon={opt.icon ? <Day0Icon name={opt.icon} sx={{ fontSize: '15px !important' }} /> : undefined}
            onClick={() => onSelect(opt.value)}
            variant="outlined"
            sx={{
              px: 0.5,
              py: 2.1,
              fontSize: 13.5,
              borderColor: isSelected ? day0Tokens.sunrise : day0Tokens.mist,
              bgcolor: isSelected ? day0Tokens.sunriseSoft : day0Tokens.surface,
              color: isSelected ? day0Tokens.sunrise : day0Tokens.ink,
              '& .MuiChip-icon': { color: isSelected ? day0Tokens.sunrise : day0Tokens.inkSoft },
            }}
          />
        );
      })}
    </Stack>
  );
}
