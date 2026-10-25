import { describe, expect, it } from 'vitest';
import { formatSI } from './format';

describe('formatSI', () => {
  it('picks readable units', () => {
    expect(formatSI(6.771e6, 'm')).toBe('6,771 km');
    expect(formatSI(1.496e11, 'm')).toBe('1 au');
    expect(formatSI(5545, 's')).toBe('92.4 min');
    expect(formatSI(86400 * 365.25 * 11.86, 's')).toBe('11.9 years');
    expect(formatSI(7672, 'm/s')).toBe('7.672 km/s');
    expect(formatSI(-2.94e7, 'J/kg')).toBe('-29.4 MJ/kg');
    expect(formatSI(Infinity, 's')).toBe('∞');
  });
});
