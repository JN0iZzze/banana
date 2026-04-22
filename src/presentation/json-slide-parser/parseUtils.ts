import type { JsonSlideGridGap } from '../jsonSlideTypes';

export const GRID_GAPS = new Set<JsonSlideGridGap>(['xs', 'sm', 'md', 'lg']);

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function err(message: string): { ok: false; error: string } {
  return { ok: false, error: message };
}

export function parseString(value: unknown, field: string): string | { ok: false; error: string } {
  if (typeof value !== 'string') {
    return err(`${field} must be a string`);
  }
  return value;
}

export function parseOptionalString(
  value: unknown,
  field: string,
): string | undefined | { ok: false; error: string } {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== 'string') {
    return err(`${field} must be a string when present`);
  }
  return value;
}
