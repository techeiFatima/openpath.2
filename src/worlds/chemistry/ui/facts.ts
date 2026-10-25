import type { Measurement } from '@/core/simulation/types';
import { describeAtom } from '../model/atom';
import { BOND_TYPE_LABELS, predictBond } from '../model/bonding';
import { electronConfiguration, ionConfiguration, predictedIonCharge, valenceElectrons } from '../model/configuration';
import { CATEGORY_LABELS, elementByZ, elementBySymbol } from '../model/elements';
import { moleculeByFormula } from '../model/molecules';
import type { AtomCounts, Mode, TableColor } from './presets';

/**
 * Facts about the current environment state, in two forms: `Measurement` items for the
 * instructor context and the readout panel (source 'analytic': everything here is looked up
 * or computed in closed form; nothing is simulated), and plain-text lines for text mode.
 */
export interface FactsInput {
  mode: Mode;
  atom: AtomCounts;
  selectedZ: number;
  tableColor: TableColor;
  molecule: string;
}

const M = (id: string, label: string, value: number, unit = '', formula?: string): Measurement => ({ id, label, value, unit, source: 'analytic', ...(formula ? { formula } : {}) });

export function measurementsFor(s: FactsInput): Measurement[] {
  if (s.mode === 'atom') {
    const d = describeAtom(s.atom.protons, s.atom.neutrons, s.atom.electrons);
    return [
      M('protons', 'Protons (Z)', d.protons),
      M('neutrons', 'Neutrons (N)', d.neutrons),
      M('electrons', 'Electrons', d.electrons),
      M('massNumber', 'Mass number', d.massNumber, '', 'A = Z + N'),
      M('charge', 'Charge', d.charge, 'e', 'q = Z - e^-'),
      M('shells', 'Occupied shells', d.shells.length),
    ];
  }
  if (s.mode === 'table') {
    const el = elementByZ(s.selectedZ);
    if (!el) return [];
    const out = [M('z', `${el.name}: atomic number`, el.z), M('mass', 'Atomic mass', el.atomicMass, 'u'), M('period', 'Period', el.period)];
    if (el.group !== null) out.push(M('group', 'Group', el.group));
    if (el.electronegativity !== null) out.push(M('en', 'Electronegativity (Pauling)', el.electronegativity));
    const v = valenceElectrons(el);
    if (v !== null) out.push(M('valence', 'Valence electrons', v));
    const q = predictedIonCharge(el);
    if (q !== null) out.push(M('ionCharge', 'Predicted ion charge', q, 'e'));
    return out;
  }
  const m = moleculeByFormula(s.molecule);
  if (!m) return [];
  const out = [M('atoms', `${m.name}: atoms`, m.atoms.length), M('bonds', 'Bonds', m.bonds.length)];
  if (m.vsepr) {
    out.push(M('domains', 'Electron domains (central atom)', m.vsepr.electronDomains, '', '\\text{domains} = \\text{bonds} + \\text{lone pairs}'));
    out.push(M('lonePairs', 'Lone pairs (central atom)', m.vsepr.lonePairs));
    out.push(M('idealAngle', `Ideal angle ${m.vsepr.angleLabel}`, m.vsepr.idealAngle, '°'));
    if (m.vsepr.measuredAngle !== null) out.push(M('measuredAngle', `Measured angle ${m.vsepr.angleLabel}`, m.vsepr.measuredAngle, '°'));
  }
  const first = m.bonds[0];
  if (first) {
    const a = elementBySymbol(m.atoms[first.a]!.element), b = elementBySymbol(m.atoms[first.b]!.element);
    const pred = a && b ? predictBond(a, b) : null;
    if (pred) out.push(M('deltaEN', `ΔEN (${a!.symbol}–${b!.symbol})`, Math.round(pred.deltaEN * 100) / 100, '', '\\Delta EN = |EN_A - EN_B|'));
  }
  return out;
}

export function assumptionsFor(mode: Mode): string[] {
  if (mode === 'atom') {
    return [
      'Bohr model: a teaching idealisation. Electrons occupy orbitals, not rings, and the nucleus is drawn vastly too large.',
      'Shell occupancy follows the Aufbau filling order (with the documented exceptions); cations lose outermost-shell electrons first.',
      'The builder reports counts only; it does not judge whether a nucleus with the chosen neutron number is stable.',
    ];
  }
  if (mode === 'table') {
    return [
      'Electronegativity values are the Pauling scale; other scales give different numbers. Noble gases and Z ≥ 104 have no value.',
      'The radius view shows the qualitative trend only; this world stores no numeric radii.',
      'Group 3 is shown as Sc, Y, Lu, Lr with La–Yb and Ac–No below (a convention; some tables put La and Ac in group 3).',
      'Element data were compiled from standard tables and have not been re-verified against the official IUPAC/NIST sources.',
    ];
  }
  return [
    'Idealised VSEPR geometry: positions use typical bond lengths and ideal angles (109.5°, 120°, 180°), not measured coordinates.',
    'Measured bond angles are literature values quoted to about ±0.5°.',
    'SO₂ and O₃ are drawn as one resonance form; real bond orders are intermediate.',
    'Bond type is predicted by the ΔEN rule of thumb (< 0.4 / 0.4–1.7 / > 1.7) combined with the metal/nonmetal criterion; real bonding is a continuum.',
    'NaCl shows one ion pair from a lattice; no discrete NaCl molecule exists in the solid.',
  ];
}

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''));

/** Plain-language facts for text mode (the same information as the visual environment). */
export function textFacts(s: FactsInput): string[] {
  if (s.mode === 'atom') {
    const d = describeAtom(s.atom.protons, s.atom.neutrons, s.atom.electrons);
    const el = d.element;
    const lines = [
      `${d.protons} protons, ${d.neutrons} neutrons, ${d.electrons} electrons.`,
      el ? `Element: ${el.name} (${el.symbol}), atomic number ${el.z}.` : 'No element has that many protons.',
      `Mass number A = ${d.protons} + ${d.neutrons} = ${d.massNumber}.`,
      `Charge = ${d.protons} − ${d.electrons} = ${d.charge > 0 ? '+' : ''}${d.charge}: ${d.ionKind}.`,
      `Notation: ${d.hyphenNotation}.`,
    ];
    if (d.shells.length) lines.push(`Shell occupancy (Bohr model, idealised): ${d.shells.join(', ')}.`);
    if (el && d.electrons > 0) {
      try {
        const cfg = d.charge === 0 ? electronConfiguration(el.z) : ionConfiguration(el.z, d.charge);
        lines.push(`Electron configuration: ${cfg.full} (${cfg.nobleGasCore}).${cfg.isException ? ' This element is an exception to the Aufbau order.' : ''}`);
      } catch {
        /* electron count beyond the subshells we model */
      }
    }
    return lines;
  }
  if (s.mode === 'table') {
    const el = elementByZ(s.selectedZ);
    if (!el) return [];
    const cfg = electronConfiguration(el.z);
    const v = valenceElectrons(el);
    const q = predictedIonCharge(el);
    return [
      `${el.name} (${el.symbol}), Z = ${el.z}, atomic mass ${fmt(el.atomicMass)} u${el.massKind === 'most-stable-isotope' ? ' (mass number of the best-known isotope; no stable isotope)' : ''}.`,
      `Period ${el.period}, ${el.group === null ? 'f-block (no group number)' : `group ${el.group}`}, ${el.block}-block. ${CATEGORY_LABELS[el.category]}. State at STP: ${el.stateAtSTP}.`,
      `Electron configuration: ${cfg.nobleGasCore} (full: ${cfg.full}).${cfg.isException ? ' Exception to the Aufbau order.' : ''}`,
      el.electronegativity === null ? 'Electronegativity: no accepted Pauling value.' : `Electronegativity (Pauling): ${el.electronegativity}.`,
      v === null ? 'Valence electron count is ambiguous for d- and f-block elements.' : `Valence electrons: ${v}.${q === null ? '' : ` Predicted ion: ${q === 0 ? 'none (noble gas)' : `${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '−'}`}.`}`,
      s.tableColor === 'radius'
        ? 'Radius trend (qualitative): atoms get smaller from left to right across a period and larger down a group.'
        : 'Electronegativity trend: increases left to right across a period and decreases down a group; fluorine is highest (3.98).',
    ];
  }
  const m = moleculeByFormula(s.molecule);
  if (!m) return [];
  const lines = [
    `${m.name}, ${m.formulaPretty}: ${m.atoms.length} atoms, ${m.bonds.length} bond${m.bonds.length === 1 ? '' : 's'} (${m.bonds.map((b) => `${m.atoms[b.a]!.element}${b.order === 1 ? '–' : b.order === 2 ? '=' : '≡'}${m.atoms[b.b]!.element}`).join(', ')}).`,
    `Bond type: ${m.bondClass}. Molecule: ${m.polarity}.`,
  ];
  if (m.vsepr) {
    const c = m.atoms[m.vsepr.centralIndex]!.element;
    lines.push(`Central atom ${c}: ${m.vsepr.electronDomains} electron domains (${m.vsepr.electronDomains - m.vsepr.lonePairs} bonded atoms + ${m.vsepr.lonePairs} lone pair${m.vsepr.lonePairs === 1 ? '' : 's'}) → electron geometry ${m.vsepr.electronGeometry}, molecular shape ${m.vsepr.molecularGeometry}.`);
    lines.push(`Ideal ${m.vsepr.angleLabel} angle ${m.vsepr.idealAngle}°${m.vsepr.measuredAngle !== null ? `; measured ${m.vsepr.measuredAngle}°` : ''}.`);
  } else {
    lines.push(m.bondClass === 'ionic' ? 'No VSEPR shape: ionic lattice.' : 'Diatomic: trivially linear; VSEPR shape names do not apply.');
  }
  lines.push(`Lone pairs per atom: ${m.atoms.map((a, i) => `${a.element} ${m.lonePairs[i]}`).join(', ')}.`);
  const first = m.bonds[0];
  if (first) {
    const a = elementBySymbol(m.atoms[first.a]!.element), b = elementBySymbol(m.atoms[first.b]!.element);
    const pred = a && b ? predictBond(a, b) : null;
    if (pred) lines.push(`ΔEN(${a!.symbol}, ${b!.symbol}) = ${pred.deltaEN.toFixed(2)} → ${BOND_TYPE_LABELS[pred.recommended]} by the rule of thumb.${pred.caveat ? ` ${pred.caveat}` : ''}`);
  }
  lines.push(`Note: ${m.notes}`);
  lines.push('Geometry shown is idealised VSEPR geometry, not a measured structure.');
  return lines;
}
