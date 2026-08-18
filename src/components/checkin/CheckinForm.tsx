import { useState } from 'react';
import { Stack, Button } from '@mui/material';
import type { Vertical } from '../../api/config';
import { NumberField } from './fields/NumberField';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';
import { ExerciseListField, type Exercise } from './fields/ExerciseListField';
import { PhotoField } from './fields/PhotoField';

export type FieldDef = Vertical['input_schema'][number];

type FieldValue = number | '' | string | Exercise[];

interface Props {
  schema: FieldDef[];
  onSubmit: (values: Record<string, unknown>) => void;
  submitting?: boolean;
}

function initialValueFor(type: FieldDef['type']): FieldValue {
  switch (type) {
    case 'number':
      return '';
    case 'exercise_list':
      return [];
    default:
      return '';
  }
}

export function CheckinForm({ schema, onSubmit, submitting }: Props) {
  const [values, setValues] = useState<Record<string, FieldValue>>(() =>
    Object.fromEntries(schema.map((f) => [f.key, initialValueFor(f.type)])),
  );

  function setValue(key: string, value: FieldValue) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function isComplete() {
    return schema.every((f) => {
      const v = values[f.key];
      if (f.type === 'exercise_list') return Array.isArray(v) && v.length > 0 && v[0].name !== '';
      return v !== '' && v !== undefined;
    });
  }

  function handleSubmit() {
    const payload: Record<string, unknown> = {};
    for (const field of schema) {
      payload[field.key] = values[field.key];
    }
    onSubmit(payload);
  }

  return (
    <Stack spacing={3}>
      {schema.map((field) => {
        switch (field.type) {
          case 'number':
            return (
              <NumberField
                key={field.key}
                field={field}
                value={values[field.key] as number | ''}
                onChange={(v) => setValue(field.key, v)}
              />
            );
          case 'text':
            return (
              <TextField
                key={field.key}
                field={field}
                value={values[field.key] as string}
                onChange={(v) => setValue(field.key, v)}
              />
            );
          case 'select':
            return (
              <SelectField
                key={field.key}
                field={field}
                value={values[field.key] as string}
                onChange={(v) => setValue(field.key, v)}
              />
            );
          case 'exercise_list':
            return (
              <ExerciseListField
                key={field.key}
                field={field}
                value={values[field.key] as Exercise[]}
                onChange={(v) => setValue(field.key, v)}
              />
            );
          case 'photo':
            return (
              <PhotoField
                key={field.key}
                field={field}
                value={values[field.key] as string}
                onChange={(v) => setValue(field.key, v)}
              />
            );
          default:
            return null;
        }
      })}
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        disabled={!isComplete() || submitting}
      >
        {submitting ? 'Checking in…' : 'Check in'}
      </Button>
    </Stack>
  );
}
