import { TextField } from '@mui/material';
import type { FieldDef } from '../CheckinForm';

interface Props {
  field: FieldDef;
  value: number | '';
  onChange: (value: number | '') => void;
}

export function NumberField({ field, value, onChange }: Props) {
  return (
    <TextField
      type="number"
      label={field.unit ? `${field.label} (${field.unit})` : field.label}
      value={value}
      onChange={(e) => {
        const raw = e.target.value;
        onChange(raw === '' ? '' : Number(raw));
      }}
      fullWidth
      required
    />
  );
}
