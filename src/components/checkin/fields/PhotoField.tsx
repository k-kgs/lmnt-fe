import { Box, Typography, Chip } from '@mui/material';
import type { FieldDef } from '../CheckinForm';

interface Props {
  field: FieldDef;
}

// Stubbed until lmnt-be ships a pre-signed upload endpoint + storage bucket
// (see .adlc/spec/kayam-web-prototype/design.md §5). Not reachable through
// normal onboarding today since verticals with a photo field are filtered
// out of the challenge/vertical pickers (src/lib/verticals.ts) — this exists
// so wiring the real upload flow later touches only this file.
export function PhotoField({ field }: Props) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {field.label}
      </Typography>
      <Chip label="Photo check-ins coming soon" variant="outlined" disabled />
    </Box>
  );
}
