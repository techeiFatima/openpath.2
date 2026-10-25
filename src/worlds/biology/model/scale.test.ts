import { describe, expect, it } from 'vitest';
import {
  formatLength, formatScientific, LIGHT_MICROSCOPE_LIMIT_M, microscopeFor, NAKED_EYE_LIMIT_M, niceScaleBar,
  objectsInView, ordersOfMagnitude, SCALE_OBJECTS, scaleObject, sizeRatio, toPrefixed,
} from './scale';

describe('scale objects', () => {
  it('are sorted from largest to smallest with unique ids and sizes inside their quoted range', () => {
    const ids = new Set(SCALE_OBJECTS.map((o) => o.id));
    expect(ids.size).toBe(SCALE_OBJECTS.length);
    for (let i = 1; i < SCALE_OBJECTS.length; i++) expect(SCALE_OBJECTS[i]!.size).toBeLessThan(SCALE_OBJECTS[i - 1]!.size);
    for (const o of SCALE_OBJECTS) {
      expect(o.size, o.id).toBeGreaterThanOrEqual(o.range[0] * 0.999);
      expect(o.size, o.id).toBeLessThanOrEqual(o.range[1] * 1.001);
    }
  });
  it('human / red blood cell ≈ 2.3e5 and about 5.4 orders of magnitude', () => {
    const ratio = sizeRatio(scaleObject('human'), scaleObject('red-blood-cell'));
    expect(ratio / 2.3e5).toBeCloseTo(1, 1);
    expect(ordersOfMagnitude(scaleObject('human'), scaleObject('red-blood-cell'))).toBeCloseTo(5.36, 1);
    expect(ordersOfMagnitude(1e-3, 1)).toBe(-3);
  });
});

describe('SI formatting', () => {
  it('picks the prefix that keeps the number in [1, 1000)', () => {
    expect(formatLength(7.5e-6)).toBe('7.5 µm');
    expect(formatLength(1.7)).toBe('1.7 m');
    expect(formatLength(3e-3)).toBe('3 mm');
    expect(formatLength(1e-4)).toBe('100 µm');
    expect(formatLength(1e-7)).toBe('100 nm');
    expect(formatLength(2e-9)).toBe('2 nm');
    expect(formatLength(0.999e-6)).toBe('999 nm');
    expect(formatLength(1e-6)).toBe('1 µm');
  });
  it('keeps atomic sizes in nanometres', () => {
    expect(formatLength(3e-10)).toBe('0.3 nm');
    expect(formatLength(1e-10)).toBe('0.1 nm');
    expect(toPrefixed(1e-10).symbol).toBe('nm');
  });
  it('formats scientific notation for prose', () => {
    expect(formatScientific(7.5e-6)).toBe('7.5 × 10^-6 m');
    expect(formatScientific(1.7)).toBe('1.7 × 10^0 m');
  });
  it('chooses 1-2-5 scale bars', () => {
    expect(niceScaleBar(2.5e-5)).toBe(2e-5);
    expect(niceScaleBar(5e-5)).toBe(5e-5);
    expect(niceScaleBar(9e-7)).toBe(5e-7);
    expect(niceScaleBar(1.2)).toBe(1);
  });
});

describe('microscope rule of thumb', () => {
  it('uses 0.1 mm and 200 nm thresholds', () => {
    expect(NAKED_EYE_LIMIT_M).toBe(1e-4);
    expect(LIGHT_MICROSCOPE_LIMIT_M).toBe(2e-7);
    expect(microscopeFor(scaleObject('egg-cell').size)).toBe('naked-eye');
    expect(microscopeFor(scaleObject('cheek-cell').size)).toBe('light-microscope');
    expect(microscopeFor(scaleObject('e-coli').size)).toBe('light-microscope');
    expect(microscopeFor(2e-7)).toBe('light-microscope');
    expect(microscopeFor(1.9e-7)).toBe('electron-microscope');
    expect(microscopeFor(scaleObject('influenza').size)).toBe('electron-microscope');
    expect(microscopeFor(scaleObject('ribosome').size)).toBe('electron-microscope');
  });
});

describe('objectsInView', () => {
  it('shows only objects that fit and are not vanishingly small', () => {
    const ids = objectsInView(1e-4).map((o) => o.id);
    expect(ids).toContain('egg-cell');
    expect(ids).toContain('red-blood-cell');
    expect(ids).toContain('e-coli');
    expect(ids).not.toContain('ant');
    expect(ids).not.toContain('influenza');
  });
});
