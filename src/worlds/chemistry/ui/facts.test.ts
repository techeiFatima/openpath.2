import { describe, expect, it } from 'vitest';
import { assumptionsFor, measurementsFor, textFacts } from './facts';
import { PRESET_MENU, resolvePreset } from './presets';
import { useChemistryUi } from './store';

describe('chemistry presets and store', () => {
  it('resolves atom, table and molecule presets and rejects unknown ones', () => {
    expect(resolvePreset('atom:carbon-14')?.atom).toEqual({ protons: 6, neutrons: 8, electrons: 6 });
    expect(resolvePreset('atom:na-ion')?.atom).toEqual({ protons: 11, neutrons: 12, electrons: 10 });
    expect(resolvePreset('table:electronegativity')?.tableColor).toBe('electronegativity');
    expect(resolvePreset('table:blocks:Na')?.selectedZ).toBe(11);
    expect(resolvePreset('table:blocks:Xx')).toBeNull();
    expect(resolvePreset('molecule:H2O')?.molecule).toBe('H2O');
    expect(resolvePreset('molecule:XYZ')).toBeNull();
    expect(resolvePreset('nonsense')).toBeNull();
    expect(PRESET_MENU.length).toBeGreaterThan(20);
  });

  it('applyPreset switches mode and state; counters clamp', () => {
    const s = useChemistryUi.getState();
    s.applyPreset('molecule:CH4');
    expect(useChemistryUi.getState().mode).toBe('molecule');
    expect(useChemistryUi.getState().molecule).toBe('CH4');
    s.applyPreset('atom:hydrogen-1');
    expect(useChemistryUi.getState().mode).toBe('atom');
    s.changeAtom('protons', -5);
    expect(useChemistryUi.getState().atom.protons).toBe(1);
    s.changeAtom('electrons', -5);
    expect(useChemistryUi.getState().atom.electrons).toBe(0);
    s.changeAtom('neutrons', 2);
    expect(useChemistryUi.getState().atom.neutrons).toBe(2);
    expect(useChemistryUi.getState().presetId).toBe('atom:free');
    s.applyPreset('table:radius:K');
    expect(useChemistryUi.getState().mode).toBe('table');
    expect(useChemistryUi.getState().selectedZ).toBe(19);
    expect(useChemistryUi.getState().tableColor).toBe('radius');
    s.applyPreset('does-not-exist');
    expect(useChemistryUi.getState().mode).toBe('table');
  });
});

describe('facts for the instructor and text mode', () => {
  it('atom mode reports counts, mass number and charge as analytic measurements and as text', () => {
    const input = { mode: 'atom' as const, atom: { protons: 11, neutrons: 12, electrons: 10 }, selectedZ: 1, tableColor: 'blocks' as const, molecule: 'H2O' };
    const ms = measurementsFor(input);
    const byId = Object.fromEntries(ms.map((m) => [m.id, m.value]));
    expect(byId.massNumber).toBe(23);
    expect(byId.charge).toBe(1);
    expect(ms.every((m) => m.source === 'analytic')).toBe(true);
    const text = textFacts(input).join(' ');
    expect(text).toContain('Sodium');
    expect(text).toContain('Na-23 +');
    expect(text).toContain('2, 8');
    expect(assumptionsFor('atom').join(' ')).toMatch(/Bohr/);
  });
  it('table mode reports electronegativity and valence; molecule mode reports domains and angles', () => {
    const table = measurementsFor({ mode: 'table', atom: { protons: 1, neutrons: 0, electrons: 1 }, selectedZ: 17, tableColor: 'electronegativity', molecule: 'H2O' });
    const t = Object.fromEntries(table.map((m) => [m.id, m.value]));
    expect(t.en).toBe(3.16);
    expect(t.valence).toBe(7);
    expect(t.ionCharge).toBe(-1);
    const mol = measurementsFor({ mode: 'molecule', atom: { protons: 1, neutrons: 0, electrons: 1 }, selectedZ: 1, tableColor: 'blocks', molecule: 'H2O' });
    const m = Object.fromEntries(mol.map((x) => [x.id, x.value]));
    expect(m.domains).toBe(4);
    expect(m.lonePairs).toBe(2);
    expect(m.idealAngle).toBe(109.5);
    expect(m.measuredAngle).toBe(104.5);
    expect(m.deltaEN).toBe(1.24);
    const lines = textFacts({ mode: 'molecule', atom: { protons: 1, neutrons: 0, electrons: 1 }, selectedZ: 1, tableColor: 'blocks', molecule: 'HF' }).join(' ');
    expect(lines).toContain('polar covalent');
    expect(lines).toMatch(/idealised VSEPR/i);
    expect(lines).toContain('nonmetals');
  });
});
