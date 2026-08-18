import { describe, it, expect } from 'vitest';
import { computeScaledDimensions, MAX_UPLOAD_BYTES } from './imageCompress';

describe('computeScaledDimensions', () => {
  it('caps the long edge at 1280px, preserving aspect ratio', () => {
    const { width, height } = computeScaledDimensions(4000, 3000);
    expect(width).toBe(1280);
    expect(height).toBe(960);
  });

  it('caps the long edge when height is the longer dimension', () => {
    const { width, height } = computeScaledDimensions(1500, 3000);
    expect(height).toBe(1280);
    expect(width).toBe(640);
  });

  it('leaves an already-small image untouched (never upscales)', () => {
    const { width, height } = computeScaledDimensions(800, 600);
    expect(width).toBe(800);
    expect(height).toBe(600);
  });

  it('respects a custom cap', () => {
    const { width, height } = computeScaledDimensions(2000, 1000, 500);
    expect(width).toBe(500);
    expect(height).toBe(250);
  });
});

describe('MAX_UPLOAD_BYTES', () => {
  it('matches lmnt-be\'s server-side cap (2MB)', () => {
    expect(MAX_UPLOAD_BYTES).toBe(2 * 1024 * 1024);
  });
});
