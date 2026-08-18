import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckinForm, type FieldDef } from './CheckinForm';

// Reading's schema: a single number field.
const READING_SCHEMA: FieldDef[] = [
  { key: 'pages', type: 'number', label: 'Pages read', unit: 'pages' },
];

// Fitness/Gym's schema: text + exercise_list — no number field at all, proving
// the same renderer genuinely generalizes across structurally different
// shapes (US-2/AC2), not just "another number field with a different label".
const FITNESS_SCHEMA: FieldDef[] = [
  { key: 'workout_name', type: 'text', label: 'Workout' },
  { key: 'exercises', type: 'exercise_list', label: 'Exercises' },
];

describe('CheckinForm', () => {
  it('renders a NumberField for a number-only schema and submits its value as a number', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CheckinForm schema={READING_SCHEMA} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/pages read/i), '42');
    await user.click(screen.getByRole('button', { name: /check in/i }));

    expect(onSubmit).toHaveBeenCalledWith({ pages: 42 });
  });

  it('renders TextField + ExerciseListField for the fitness schema and submits an array', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CheckinForm schema={FITNESS_SCHEMA} onSubmit={onSubmit} />);

    await user.type(screen.getByRole('textbox', { name: /workout/i }), 'Push day');
    await user.type(screen.getByRole('textbox', { name: /^exercise$/i }), 'Bench press');
    await user.type(screen.getByRole('spinbutton', { name: /sets/i }), '3');
    await user.type(screen.getByRole('spinbutton', { name: /reps/i }), '10');
    await user.click(screen.getByRole('button', { name: /check in/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      workout_name: 'Push day',
      exercises: [{ name: 'Bench press', sets: 3, reps: 10 }],
    });
  });

  it('keeps the submit button disabled until every required field is filled', () => {
    render(<CheckinForm schema={READING_SCHEMA} onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /check in/i })).toBeDisabled();
  });
});
