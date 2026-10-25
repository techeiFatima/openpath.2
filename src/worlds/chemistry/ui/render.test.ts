import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { elementByZ } from '../model/elements';
import { AtomBuilder } from './AtomBuilder';
import { Controls } from './Controls';
import { Measurements } from './Measurements';
import { ElementCard, enColor, PeriodicTable } from './PeriodicTable';
import { useChemistryUi } from './store';

/**
 * Server-side render smoke test for the DOM/SVG environments (the R3F molecule canvas needs
 * WebGL and is not rendered here). It catches runtime errors in the components and checks
 * that the idealisation labels and accessible names are present.
 *
 * Note: zustand v5 serves the store's *initial* state to server renders (useSyncExternalStore
 * server snapshot), so these assertions use the initial state (carbon-12, sodium selected,
 * block colouring) and exercise the state-dependent pieces through their props.
 */
describe('chemistry UI renders without a browser', () => {
  it('atom builder shows identity, notation and the Bohr-model caveat', () => {
    const html = renderToStaticMarkup(createElement(AtomBuilder));
    expect(html).toContain('Carbon');
    expect(html).toContain('C-12');
    expect(html).toContain('Bohr model: a teaching idealisation; electrons do not orbit in rings.');
    expect(html).toContain('aria-label="Add one proton"');
    expect(html).toContain('aria-label="Remove one electron"');
    expect(html).toContain('<svg');
    expect(html).toContain('[He] 2s2 2p2');
  });

  it('periodic table renders 118 element buttons with accessible names and block classes', () => {
    const html = renderToStaticMarkup(createElement(PeriodicTable));
    expect((html.match(/<button/g) ?? []).length).toBe(118);
    expect(html).toContain('block-d');
    expect(html).toContain('block-f');
    expect(html).toContain('aria-label="Sodium, atomic number 11, electronegativity 0.93"');
    expect(html).toContain('[Ne] 3s1');
    expect(html).toContain('one of two common conventions');
  });

  it('element card explains Aufbau exceptions and the electronegativity ramp only colours known values', () => {
    const cr = renderToStaticMarkup(createElement(ElementCard, { e: elementByZ(24)!, colorBy: 'electronegativity' }));
    expect(cr).toContain('half-filled 3d');
    expect(cr).toContain('[Ar] 3d5 4s1');
    const tc = renderToStaticMarkup(createElement(ElementCard, { e: elementByZ(43)!, colorBy: 'radius' }));
    expect(tc).toContain('best-known isotope');
    expect(enColor(3.98)).toMatch(/^hsl\(/);
    expect(enColor(null)).toBeUndefined();
    expect(enColor(0.79)).not.toBe(enColor(3.98));
  });

  it('controls and measurements render', () => {
    useChemistryUi.getState().applyPreset('atom:carbon-12');
    const html = renderToStaticMarkup(createElement('div', null, createElement(Controls), createElement(Measurements, { showText: true })));
    expect(html).toContain('Setup');
    expect(html).toContain('Atom builder');
    expect(html).toContain('Mass number');
    expect(html).toContain('Idealisations and data status');
    expect(html).toContain('Bohr model');
  });
});
