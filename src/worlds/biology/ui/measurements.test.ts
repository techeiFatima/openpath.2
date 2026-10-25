import { describe, expect, it } from 'vitest';
import { assumptionsFor, dnaMeasurements, dnaReadout, dnaSentence, microscopeSentence, scaleMeasurements } from './measurements';
import { EXAMPLE_GENE, PRESETS } from './presets';

describe('scale readout helpers', () => {
  it('reports field of view, both sizes, ratio and orders of magnitude', () => {
    const ms = scaleMeasurements({ fov: 2e-4, selectedId: 'human', referenceId: 'red-blood-cell' });
    const byId = Object.fromEntries(ms.map((m) => [m.id, m.value]));
    expect(byId.fov).toBe(2e-4);
    expect(byId.selected).toBe(1.7);
    expect(byId.reference).toBe(7.5e-6);
    expect(byId.ratio! / 2.27e5).toBeCloseTo(1, 1);
    expect(byId.orders).toBeCloseTo(5.36, 1);
    expect(ms.find((m) => m.id === 'ratio')?.source).toBe('analytic');
  });
  it('names the tool for the selected object as a rule of thumb', () => {
    expect(microscopeSentence('influenza')).toContain('Electron microscope');
    expect(microscopeSentence('influenza')).toContain('rule of thumb');
    expect(microscopeSentence('egg-cell')).toContain('Naked eye');
    expect(microscopeSentence('nope')).toBe('');
  });
  it('lists panel-specific assumptions', () => {
    expect(assumptionsFor('scale').join(' ')).toMatch(/typical size/);
    expect(assumptionsFor('dna').join(' ')).toMatch(/coding strand/);
  });
});

describe('dna readout helpers', () => {
  it('summarises the example gene', () => {
    const r = dnaReadout({ coding: EXAMPLE_GENE, mutation: null });
    const byId = Object.fromEntries(dnaMeasurements(r).map((m) => [m.id, m.value]));
    expect(byId.length).toBe(15);
    expect(byId.gc).toBeCloseTo(46.67, 1);
    expect(byId.codons).toBe(5);
    expect(byId.aa).toBe(4);
    expect(byId['mutant-aa']).toBeUndefined();
    expect(dnaSentence(r)).toContain('Met-Ala-Lys-Trp-Stop');
  });
  it('includes the mutation classification when one is active', () => {
    const r = dnaReadout({ coding: EXAMPLE_GENE, mutation: PRESETS['dna:mutation-nonsense']!.mutation! });
    expect(r.mutation?.effect).toBe('nonsense');
    const byId = Object.fromEntries(dnaMeasurements(r).map((m) => [m.id, m.value]));
    expect(byId['mutant-aa']).toBe(3);
    expect(dnaSentence(r)).toContain('Nonsense');
  });
  it('reports an invalid mutation instead of throwing', () => {
    const r = dnaReadout({ coding: 'ATG', mutation: { type: 'delete', position: 9 } });
    expect(r.mutation).toBeNull();
    expect(r.mutationError).toMatch(/outside/);
  });
});
