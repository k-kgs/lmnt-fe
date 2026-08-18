import { TextField, MenuItem } from '@mui/material';
import type { FieldDef } from '../CheckinForm';

interface Props {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

export function SelectField({ field, value, onChange }: Props) {
  return (
    <TextField
      select
      label={field.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      required
    >
      {(field.options ?? []).map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}
