import type { Vertical } from '../api/config';

export function hasPhotoField(vertical: Vertical): boolean {
  return vertical.input_schema.some((field) => field.type === 'photo');
}
