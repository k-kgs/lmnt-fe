import { useRef, useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress, Chip } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import type { FieldDef } from '../CheckinForm';
import { compressImage, ImageTooLargeError } from '../../../lib/imageCompress';
import { requestUploadUrl, uploadToStorage } from '../../../api/uploads';

interface Props {
  field: FieldDef;
  value: string;
  onChange: (objectKey: string) => void;
}

const UPLOAD_CONTENT_TYPE = 'image/jpeg';

export function PhotoField({ field, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(file: File) {
    setStatus('processing');
    setError(null);
    try {
      const blob = await compressImage(file);
      const { upload_url, object_key } = await requestUploadUrl({
        contentType: UPLOAD_CONTENT_TYPE,
        declaredSizeBytes: blob.size,
      });
      await uploadToStorage(upload_url, blob, UPLOAD_CONTENT_TYPE);
      onChange(object_key);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof ImageTooLargeError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Photo upload failed — try again.',
      );
    }
  }

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {field.label}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFileSelected(file);
          e.target.value = '';
        }}
      />
      {error && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}
      {value && status === 'idle' && (
        <Chip label="Photo attached ✓" color="secondary" sx={{ mb: 1.5 }} />
      )}
      <Button
        variant="outlined"
        startIcon={status === 'processing' ? <CircularProgress size={16} /> : <PhotoCameraIcon />}
        onClick={() => inputRef.current?.click()}
        disabled={status === 'processing'}
        fullWidth
      >
        {status === 'processing' ? 'Uploading…' : value ? 'Retake photo' : 'Take photo'}
      </Button>
    </Box>
  );
}
