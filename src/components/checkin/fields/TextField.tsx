import { TextField as MuiTextField } from '@mui/material';
import type { FieldDef } from '../CheckinForm';

interface Props {
  field: FieldDef;
  value: string;
  onChange: (value: string) => void;
}

export function TextField({ field, value, onChange }: Props) {
  return (
    <MuiTextField
      label={field.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      required
    />
  );
}
