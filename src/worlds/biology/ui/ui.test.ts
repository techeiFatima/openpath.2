import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Controls } from './Controls';
import { DnaScene } from './DnaScene';
import { dnaReadout } from './measurements';
import { EXAMPLE_GENE, PRESETS } from './presets';
import { Readout } from './Readout';
import { ScaleScene } from './ScaleScene';
import { useBiologyUi } from './store';

/**
 * Render smoke tests: the world is not yet wired into the registry, so WorldShell cannot be
 * mounted here. The panels and SVG scenes are rendered to static markup to catch runtime
 * errors (NaN attributes, undefined lookups) across presets and edge cases.
 */
const render = (el: Parameters<typeof renderToStaticMarkup>[0]) => renderToStaticMarkup(el);

// Server rendering makes zustand return the store's INITIAL snapshot. For these smoke tests the
// hook is replaced by a plain read of the live state (actions and api are passed through).
vi.mock('./store', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./store')>();
  const hook = () => mod.useBiologyUi.getState();
  Object.assign(hook, mod.useBiologyUi);
  return { ...mod, useBiologyUi: hook };
});

describe('scale scene', () => {
  it('renders every scale preset without NaN and labels objects as typical size', () => {
    for (const p of Object.values(PRESETS).filter((p) => p.panel === 'scale')) {
      const html = render(createElement(ScaleScene, { fov: p.fov!, selectedId: p.selectedId! }));
      expect(html, p.id).not.toMatch(/NaN|undefined/);
      expect(html, p.id).toContain('aria-hidden="true"');
      expect(html, p.id).toContain('typical size');
      expect(html, p.id).toContain('rule of thumb');
    }
  });
  it('shows the ant alone at a 2 cm field of view and never leaves the view empty across the slider', () => {
    const html = render(createElement(ScaleScene, { fov: 0.02, selectedId: 'ant' }));
    expect(html).toContain('Ant');
    expect(html).not.toContain('Adult human');
    for (let log = -10; log <= 0.47; log += 0.25) {
      const h = render(createElement(ScaleScene, { fov: 10 ** log, selectedId: 'ant' }));
      expect(h, `fov 1e${log}`).not.toContain('Keep zooming');
      expect(h, `fov 1e${log}`).not.toMatch(/NaN/);
    }
  });
});

describe('dna scene', () => {
  it('renders with and without a mutation, and with an incomplete codon', () => {
    const plain = dnaReadout({ coding: EXAMPLE_GENE, mutation: null });
    const html = render(createElement(DnaScene, { summary: plain.summary, mutation: plain.mutation }));
    expect(html).toContain('Met');
    expect(html).toContain('Stop');
    expect(html).not.toMatch(/NaN|undefined/);
    const mutated = dnaReadout({ coding: EXAMPLE_GENE, mutation: PRESETS['dna:frameshift']!.mutation! });
    const html2 = render(createElement(DnaScene, { summary: mutated.summary, mutation: mutated.mutation }));
    expect(html2).toContain('no stop codon');
    expect(html2).toContain('base-changed');
    const odd = dnaReadout({ coding: 'ATGA', mutation: null });
    expect(render(createElement(DnaScene, { summary: odd.summary, mutation: odd.mutation }))).not.toMatch(/NaN/);
  });
});

describe('controls and readout', () => {
  it('render for every preset with native labelled inputs and the same facts as text', () => {
    for (const p of Object.values(PRESETS)) {
      useBiologyUi.getState().applyPreset(p.id);
      const html = render(createElement('div', null, createElement(Controls), createElement(Readout)));
      expect(html, p.id).not.toMatch(/NaN|undefined/);
      expect(html, p.id).toContain('<select');
      expect(html, p.id).toContain('aria-live="polite"');
      if (p.panel === 'scale') {
        expect(html, p.id).toContain('Field of view');
        expect(html, p.id).toContain('Rule of thumb');
        expect(html, p.id).toContain('type="range"');
      } else {
        expect(html, p.id).toContain('Template 3′→5′');
        expect(html, p.id).toContain('Chargaff');
        expect(html, p.id).toContain('Genetic code table');
        if (p.mutation) expect(html, p.id).toContain('Mutation:');
      }
    }
  });
  it('keeps the last valid sequence when the learner types invalid characters', () => {
    const s = useBiologyUi.getState();
    s.applyPreset('dna:example');
    s.setCodingInput('ATGXXX');
    expect(useBiologyUi.getState().coding).toBe(EXAMPLE_GENE);
    const html = render(createElement(Controls));
    expect(html).toContain('Ignoring invalid characters');
    s.setCodingInput("5'-atg ttt-3'");
    expect(useBiologyUi.getState().coding).toBe('ATGTTT');
  });
  it('zoomTo puts the object at 60% of the view height and clamps the slider range', () => {
    const s = useBiologyUi.getState();
    s.zoomTo('red-blood-cell');
    expect(useBiologyUi.getState().fov).toBeCloseTo(7.5e-6 / 0.6, 12);
    s.setFov(1e3);
    expect(useBiologyUi.getState().fov).toBe(3);
    s.setFov(1e-20);
    expect(useBiologyUi.getState().fov).toBe(1e-10);
  });
});
