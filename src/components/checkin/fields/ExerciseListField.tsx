import { Box, TextField, IconButton, Button, Stack, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import type { FieldDef } from '../CheckinForm';

export interface Exercise {
  name: string;
  sets: number | '';
  reps: number | '';
}

interface Props {
  field: FieldDef;
  value: Exercise[];
  onChange: (value: Exercise[]) => void;
}

const EMPTY_EXERCISE: Exercise = { name: '', sets: '', reps: '' };

export function ExerciseListField({ field, value, onChange }: Props) {
  const rows = value.length > 0 ? value : [EMPTY_EXERCISE];

  function updateRow(index: number, patch: Partial<Exercise>) {
    const next = rows.map((row, i) => (i === index ? { ...row, ...patch } : row));
    onChange(next);
  }

  function removeRow(index: number) {
    const next = rows.filter((_, i) => i !== index);
    onChange(next.length > 0 ? next : [EMPTY_EXERCISE]);
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {field.label}
      </Typography>
      <Stack spacing={1.5}>
        {rows.map((row, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <TextField
              label="Exercise"
              value={row.name}
              onChange={(e) => updateRow(i, { name: e.target.value })}
              sx={{ flex: 2 }}
              size="small"
            />
            <TextField
              label="Sets"
              type="number"
              value={row.sets}
              onChange={(e) => updateRow(i, { sets: e.target.value === '' ? '' : Number(e.target.value) })}
              sx={{ flex: 1 }}
              size="small"
            />
            <TextField
              label="Reps"
              type="number"
              value={row.reps}
              onChange={(e) => updateRow(i, { reps: e.target.value === '' ? '' : Number(e.target.value) })}
              sx={{ flex: 1 }}
              size="small"
            />
            <IconButton onClick={() => removeRow(i)} size="small" aria-label="remove exercise">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>
      <Button
        startIcon={<AddIcon />}
        onClick={() => onChange([...rows, EMPTY_EXERCISE])}
        size="small"
        sx={{ mt: 1 }}
      >
        Add exercise
      </Button>
    </Box>
  );
}
