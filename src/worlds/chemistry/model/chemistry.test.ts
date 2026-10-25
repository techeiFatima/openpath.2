import { describe, expect, it } from 'vitest';
import { averageAtomicMass, describeAtom, ISOTOPE_DATA } from './atom';
import { classifyBondByDifference, ionicFormulaBySymbols, octetCheck, predictBondBySymbols, totalValenceElectrons } from './bonding';
import { CONFIGURATION_EXCEPTIONS, electronConfiguration, ionConfiguration, parseConfiguration, positionFromConfiguration, predictedIonCharge, shellOccupancy, valenceElectrons } from './configuration';
import { ELEMENTS, elementBySymbol, elementByZ, groupOf, NOBLE_GASES } from './elements';
import { bondAngle, formulaCounts, lewisOf, MOLECULES, moleculeByFormula } from './molecules';

describe('element table', () => {
  it('has 118 elements with consecutive atomic numbers and unique symbols', () => {
    expect(ELEMENTS).toHaveLength(118);
    ELEMENTS.forEach((e, i) => expect(e.z).toBe(i + 1));
    expect(new Set(ELEMENTS.map((e) => e.symbol)).size).toBe(118);
    expect(new Set(ELEMENTS.map((e) => e.name)).size).toBe(118);
  });
  it('places elements in the expected periods, groups and blocks', () => {
    const check = (sym: string, period: number, group: number | null, block: string) => {
      const e = elementBySymbol(sym)!;
      expect([e.period, e.group, e.block], sym).toEqual([period, group, block]);
    };
    check('H', 1, 1, 's');
    check('He', 1, 18, 's');
    check('C', 2, 14, 'p');
    check('Na', 3, 1, 's');
    check('Cl', 3, 17, 'p');
    check('Ca', 4, 2, 's');
    check('Fe', 4, 8, 'd');
    check('Zn', 4, 12, 'd');
    check('Br', 4, 17, 'p');
    check('Kr', 4, 18, 'p');
    check('Ag', 5, 11, 'd');
    check('Cs', 6, 1, 's');
    check('Ce', 6, null, 'f');
    check('Lu', 6, 3, 'd');
    check('Hf', 6, 4, 'd');
    check('Au', 6, 11, 'd');
    check('Rn', 6, 18, 'p');
    check('U', 7, null, 'f');
    check('Og', 7, 18, 'p');
    for (const z of NOBLE_GASES) expect(groupOf(z), `Z=${z}`).toBe(18);
  });
  it('each period has the right number of elements', () => {
    const counts = new Map<number, number>();
    for (const e of ELEMENTS) counts.set(e.period, (counts.get(e.period) ?? 0) + 1);
    expect([...counts.values()]).toEqual([2, 8, 8, 18, 18, 32, 32]);
  });
  it('standard atomic masses increase with Z except the known inversions', () => {
    const inversions = new Set([18, 27, 52, 90]); // Ar>K, Co>Ni, Te>I, Th>Pa
    const standard = ELEMENTS.filter((e) => e.massKind === 'standard');
    for (let i = 0; i < standard.length - 1; i++) {
      const a = standard[i]!, b = standard[i + 1]!;
      if (a.atomicMass > b.atomicMass) expect(inversions.has(a.z), `${a.symbol} (${a.atomicMass}) > ${b.symbol} (${b.atomicMass})`).toBe(true);
    }
    expect(elementByZ(43)!.massKind).toBe('most-stable-isotope');
  });
  it('electronegativity is within the Pauling range and F is the maximum', () => {
    const withEN = ELEMENTS.filter((e) => e.electronegativity !== null);
    for (const e of withEN) expect(e.electronegativity!).toBeGreaterThan(0.6);
    expect(Math.max(...withEN.map((e) => e.electronegativity!))).toBe(elementBySymbol('F')!.electronegativity);
    expect(elementBySymbol('He')!.electronegativity).toBeNull();
  });
  it('looks elements up by symbol case-insensitively', () => {
    expect(elementBySymbol('na')?.name).toBe('Sodium');
    expect(elementBySymbol('X')).toBeUndefined();
  });
});

describe('electron configuration', () => {
  it('total electrons = Z for all 118 elements, in both notations', () => {
    for (const e of ELEMENTS) {
      const cfg = electronConfiguration(e.z);
      expect(cfg.electrons, e.symbol).toBe(e.z);
      const sumFull = cfg.full.split(' ').reduce((s, t) => s + Number(t.slice(2)), 0);
      expect(sumFull, e.symbol).toBe(e.z);
      const reparsed = parseConfiguration(cfg.nobleGasCore);
      expect([...reparsed.values()].reduce((a, b) => a + b, 0), `${e.symbol} noble-gas notation`).toBe(e.z);
      expect(cfg.shells.reduce((a, b) => a + b, 0), e.symbol).toBe(e.z);
    }
  });
  it('matches known ground-state configurations', () => {
    const expectCfg = (sym: string, full: string) => expect(electronConfiguration(elementBySymbol(sym)!.z).full, sym).toBe(full);
    expectCfg('H', '1s1');
    expectCfg('C', '1s2 2s2 2p2');
    expectCfg('O', '1s2 2s2 2p4');
    expectCfg('Na', '1s2 2s2 2p6 3s1');
    expectCfg('Cl', '1s2 2s2 2p6 3s2 3p5');
    expectCfg('Fe', '1s2 2s2 2p6 3s2 3p6 3d6 4s2');
    expectCfg('Cr', '1s2 2s2 2p6 3s2 3p6 3d5 4s1');
    expectCfg('Cu', '1s2 2s2 2p6 3s2 3p6 3d10 4s1');
    expectCfg('Ag', '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 5s1');
    expectCfg('Au', '1s2 2s2 2p6 3s2 3p6 3d10 4s2 4p6 4d10 4f14 5s2 5p6 5d10 6s1');
  });
  it('uses noble-gas notation', () => {
    expect(electronConfiguration(20).nobleGasCore).toBe('[Ar] 4s2');
    expect(electronConfiguration(35).nobleGasCore).toBe('[Ar] 3d10 4s2 4p5');
    expect(electronConfiguration(1).nobleGasCore).toBe('1s1');
    expect(electronConfiguration(10).nobleGasCore).toBe('[He] 2s2 2p6');
    expect(electronConfiguration(46).nobleGasCore).toBe('[Kr] 4d10');
    expect(electronConfiguration(92).nobleGasCore).toBe('[Rn] 5f3 6d1 7s2');
  });
  it('flags exactly the documented exceptions', () => {
    const required = [24, 29, 41, 42, 44, 45, 46, 47, 78, 79, 57, 58, 64, 89, 90, 91, 92, 93, 96, 103];
    for (const z of required) expect(CONFIGURATION_EXCEPTIONS[z], `Z=${z}`).toBeDefined();
    for (const e of ELEMENTS) expect(electronConfiguration(e.z).isException, e.symbol).toBe(e.z in CONFIGURATION_EXCEPTIONS);
    expect(electronConfiguration(26).isException).toBe(false);
  });
  it('gives Bohr shells: Na = [2,8,1], Ar = [2,8,8], K = [2,8,8,1], Fe = [2,8,14,2]', () => {
    expect(shellOccupancy(11)).toEqual([2, 8, 1]);
    expect(shellOccupancy(18)).toEqual([2, 8, 8]);
    expect(shellOccupancy(19)).toEqual([2, 8, 8, 1]);
    expect(shellOccupancy(26)).toEqual([2, 8, 14, 2]);
  });
  it('handles ions: Na⁺ and Cl⁻ are isoelectronic with neon and argon; Fe²⁺ loses 4s first', () => {
    expect(ionConfiguration(11, 1).full).toBe('1s2 2s2 2p6');
    expect(ionConfiguration(17, -1).full).toBe('1s2 2s2 2p6 3s2 3p6');
    expect(ionConfiguration(26, 2).nobleGasCore).toBe('[Ar] 3d6');
    expect(ionConfiguration(26, 3).nobleGasCore).toBe('[Ar] 3d5');
    expect(ionConfiguration(8, -2).shells).toEqual([2, 8]);
    expect(shellOccupancy(11, 10)).toEqual([2, 8]);
  });
  it('valence electrons and predicted ion charges for main-group elements', () => {
    const v = (s: string) => valenceElectrons(elementBySymbol(s)!);
    const q = (s: string) => predictedIonCharge(elementBySymbol(s)!);
    expect([v('Na'), v('Mg'), v('Al'), v('C'), v('N'), v('O'), v('Cl'), v('Ne'), v('He')]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 2]);
    expect(v('Fe')).toBeNull();
    expect([q('Na'), q('Mg'), q('Al'), q('N'), q('O'), q('Cl'), q('Ar')]).toEqual([1, 2, 3, -3, -2, -1, 0]);
    expect(q('C')).toBeNull();
    expect(q('H')).toBeNull();
    expect(q('Fe')).toBeNull();
  });
  it('reads period and block back from the configuration', () => {
    for (const e of ELEMENTS) {
      const pos = positionFromConfiguration(electronConfiguration(e.z));
      expect(pos.period, e.symbol).toBe(e.period);
    }
    expect(positionFromConfiguration(electronConfiguration(26)).block).toBe('d');
    expect(positionFromConfiguration(electronConfiguration(17)).block).toBe('p');
    expect(positionFromConfiguration(electronConfiguration(17)).outerShellElectrons).toBe(7);
  });
});

describe('atom builder arithmetic', () => {
  it('describes carbon-14 and the sodium ion', () => {
    const c14 = describeAtom(6, 8, 6);
    expect(c14.element?.symbol).toBe('C');
    expect(c14.massNumber).toBe(14);
    expect(c14.charge).toBe(0);
    expect(c14.hyphenNotation).toBe('C-14');
    expect(c14.shells).toEqual([2, 4]);
    const na = describeAtom(11, 12, 10);
    expect(na.charge).toBe(1);
    expect(na.chargeLabel).toBe('+');
    expect(na.ionKind).toBe('cation');
    expect(na.shells).toEqual([2, 8]);
    expect(describeAtom(8, 8, 10).chargeLabel).toBe('2−');
  });
  it('average atomic mass of chlorine from its isotopes matches the table to 0.1%', () => {
    const avg = averageAtomicMass(ISOTOPE_DATA.Cl!);
    expect(Math.abs(avg / elementBySymbol('Cl')!.atomicMass - 1)).toBeLessThan(0.001);
    expect(Math.abs(averageAtomicMass(ISOTOPE_DATA.Cu!) / 63.55 - 1)).toBeLessThan(0.001);
    expect(Math.abs(averageAtomicMass(ISOTOPE_DATA.Mg!) / 24.31 - 1)).toBeLessThan(0.001);
    expect(Math.abs(averageAtomicMass(ISOTOPE_DATA.B!) / 10.81 - 1)).toBeLessThan(0.001);
  });
});

describe('bonding rules', () => {
  it('classifies by electronegativity difference with the stated thresholds', () => {
    expect(classifyBondByDifference(0)).toBe('nonpolar-covalent');
    expect(classifyBondByDifference(0.39)).toBe('nonpolar-covalent');
    expect(classifyBondByDifference(0.4)).toBe('polar-covalent');
    expect(classifyBondByDifference(1.7)).toBe('polar-covalent');
    expect(classifyBondByDifference(1.71)).toBe('ionic');
  });
  it('predicts bonds for common pairs and states the HF caveat', () => {
    expect(predictBondBySymbols('C', 'H')!.recommended).toBe('nonpolar-covalent');
    expect(predictBondBySymbols('H', 'O')!.recommended).toBe('polar-covalent');
    expect(predictBondBySymbols('Na', 'Cl')!.recommended).toBe('ionic');
    expect(predictBondBySymbols('H', 'O')!.negativeEnd?.symbol).toBe('O');
    const hf = predictBondBySymbols('H', 'F')!;
    expect(hf.byDifference).toBe('ionic');
    expect(hf.recommended).toBe('polar-covalent');
    expect(hf.caveat).toContain('nonmetals');
    expect(predictBondBySymbols('He', 'H')).toBeNull();
  });
  it('builds ionic formulas from group charges', () => {
    expect(ionicFormulaBySymbols('Mg', 'Cl')!.formula).toBe('MgCl2');
    expect(ionicFormulaBySymbols('Al', 'O')!.formula).toBe('Al2O3');
    expect(ionicFormulaBySymbols('Na', 'Cl')!.formula).toBe('NaCl');
    expect(ionicFormulaBySymbols('Ca', 'N')!.formula).toBe('Ca3N2');
    expect(ionicFormulaBySymbols('K', 'S')!.formulaPretty).toBe('K₂S');
    expect(ionicFormulaBySymbols('Mg', 'O')!.formula).toBe('MgO');
    expect(ionicFormulaBySymbols('C', 'O')).toBeNull();
    expect(ionicFormulaBySymbols('Na', 'Mg')).toBeNull();
  });
  it('octet check accepts correct water and rejects a wrong one', () => {
    const good = octetCheck({ atoms: [{ symbol: 'O', lonePairs: 2 }, { symbol: 'H', lonePairs: 0 }, { symbol: 'H', lonePairs: 0 }], bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }] });
    expect(good.issues).toEqual([]);
    expect(good.valenceAvailable).toBe(8);
    expect(good.atoms[0]!.status).toBe('ok');
    expect(good.atoms[1]!.status).toBe('duet');
    const bad = octetCheck({ atoms: [{ symbol: 'O', lonePairs: 3 }, { symbol: 'H', lonePairs: 0 }, { symbol: 'H', lonePairs: 0 }], bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }] });
    expect(bad.issues.length).toBeGreaterThan(0);
    expect(bad.atoms[0]!.status).toBe('over');
    const bf3 = octetCheck({ atoms: [{ symbol: 'B', lonePairs: 0 }, { symbol: 'F', lonePairs: 3 }, { symbol: 'F', lonePairs: 3 }, { symbol: 'F', lonePairs: 3 }], bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 1 }, { a: 0, b: 3, order: 1 }] });
    expect(bf3.issues).toEqual([]);
    expect(bf3.atoms[0]!.status).toBe('incomplete');
    expect(totalValenceElectrons(['C', 'O', 'O'])).toBe(16);
    expect(totalValenceElectrons(['Fe', 'O'])).toBeNull();
  });
});

describe('curated molecules', () => {
  it('has at least 14 entries with unique formulas', () => {
    expect(MOLECULES.length).toBeGreaterThanOrEqual(14);
    expect(new Set(MOLECULES.map((m) => m.formula)).size).toBe(MOLECULES.length);
  });
  it('atom counts match the formula', () => {
    for (const m of MOLECULES) {
      const counts: Record<string, number> = {};
      for (const a of m.atoms) counts[a.element] = (counts[a.element] ?? 0) + 1;
      expect(counts, m.formula).toEqual(formulaCounts(m.formula));
      expect(m.lonePairs, m.formula).toHaveLength(m.atoms.length);
    }
  });
  it('every bond references existing, distinct atoms and every atom is bonded', () => {
    for (const m of MOLECULES) {
      const bonded = new Set<number>();
      for (const b of m.bonds) {
        expect(b.a, m.formula).not.toBe(b.b);
        expect(m.atoms[b.a], `${m.formula} bond ${b.a}`).toBeDefined();
        expect(m.atoms[b.b], `${m.formula} bond ${b.b}`).toBeDefined();
        bonded.add(b.a);
        bonded.add(b.b);
      }
      expect(bonded.size, m.formula).toBe(m.atoms.length);
    }
  });
  it('electron domains = bonded atoms + lone pairs on the central atom', () => {
    for (const m of MOLECULES) {
      if (!m.vsepr) continue;
      const bondsToCentral = m.bonds.filter((b) => b.a === m.vsepr!.centralIndex || b.b === m.vsepr!.centralIndex).length;
      expect(m.vsepr.electronDomains, m.formula).toBe(bondsToCentral + m.vsepr.lonePairs);
      expect(m.vsepr.lonePairs, m.formula).toBe(m.lonePairs[m.vsepr.centralIndex]);
    }
  });
  it('drawn Lewis structures account for all valence electrons and respect the octet/duet rule', () => {
    for (const m of MOLECULES) {
      if (m.bondClass === 'ionic') continue;
      const report = octetCheck(lewisOf(m));
      expect(report.valenceBalanced, `${m.formula}: drawn ${report.electronsDrawn} of ${report.valenceAvailable}`).toBe(true);
      const allowed = new Set(['ok', 'duet', 'incomplete', 'expanded']);
      for (const a of report.atoms) expect(allowed.has(a.status), `${m.formula} atom ${a.index} ${a.symbol} ${a.status}`).toBe(true);
      if (m.formula !== 'SO2') for (const a of report.atoms) expect(a.status, `${m.formula} ${a.symbol}`).not.toBe('expanded');
    }
  });
  it('idealised coordinates reproduce the ideal VSEPR angle and bond lengths are chemically plausible', () => {
    for (const m of MOLECULES) {
      for (const b of m.bonds) {
        const pa = m.atoms[b.a]!.position, pb = m.atoms[b.b]!.position;
        const d = Math.hypot(pa[0] - pb[0], pa[1] - pb[1], pa[2] - pb[2]);
        expect(d, `${m.formula} bond length`).toBeGreaterThan(0.7);
        expect(d, `${m.formula} bond length`).toBeLessThan(3);
      }
      if (!m.vsepr) continue;
      const c = m.vsepr.centralIndex;
      const neighbours = m.bonds.filter((b) => b.a === c || b.b === c).map((b) => (b.a === c ? b.b : b.a));
      if (neighbours.length >= 2) {
        // For ethene/methanol the angle checked is between two hydrogens on the central carbon, when present.
        const hs = neighbours.filter((i) => m.atoms[i]!.element === 'H');
        const [i, j] = hs.length >= 2 ? hs : neighbours;
        expect(bondAngle(m, i!, c, j!), m.formula).toBeCloseTo(m.vsepr.idealAngle, 0);
      }
    }
  });
  it('measured angles differ from ideal only where documented and the water case is right', () => {
    const w = moleculeByFormula('H2O')!;
    expect(w.vsepr!.idealAngle).toBe(109.5);
    expect(w.vsepr!.measuredAngle).toBe(104.5);
    expect(moleculeByFormula('NH3')!.vsepr!.molecularGeometry).toBe('trigonal pyramidal');
    expect(moleculeByFormula('nacl')!.vsepr).toBeNull();
  });
});
