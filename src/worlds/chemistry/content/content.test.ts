import { describe, expect, it } from 'vitest';
import { grade } from '@/core/assessment/grade';
import { validateGraph } from '@/core/curriculum/graph';
import { validateLesson } from '@/core/world/spec';
import { CATALOG } from '@/worlds/catalog';
import { CHEMISTRY_OBJECTIVES, CHEMISTRY_PREREQUISITES, CHEMISTRY_UNITS } from './curriculum';
import { CHEMISTRY_LESSONS, CHEMISTRY_WORLD } from './index';

const ALL_PROBLEMS = CHEMISTRY_LESSONS.flatMap((l) => l.problems.map((p) => ({ lesson: l.id, p })));
const byId = new Map(ALL_PROBLEMS.map((x) => [x.p.id, x.p]));

describe('chemistry content integrity', () => {
  it('every lesson passes structural validation', () => {
    for (const l of CHEMISTRY_LESSONS) expect(validateLesson(l), l.id).toEqual([]);
    expect(new Set(CHEMISTRY_LESSONS.map((l) => l.id)).size).toBe(4);
    expect(new Set(ALL_PROBLEMS.map((x) => x.p.id)).size).toBe(ALL_PROBLEMS.length);
    expect(CHEMISTRY_WORLD.lessonIds).toEqual(CHEMISTRY_LESSONS.map((l) => l.id));
    for (const l of CHEMISTRY_LESSONS) expect(l.worldId).toBe(CHEMISTRY_WORLD.id);
  });

  it('the catalog (which merges the chemistry slice) is referentially sound and acyclic', () => {
    expect(validateGraph(CATALOG)).toEqual([]);
    expect(CATALOG.objectives.filter((o) => o.id.startsWith('chem.')).length).toBe(CHEMISTRY_OBJECTIVES.length);
    const courseIds = new Set(CATALOG.courses.map((c) => c.id));
    for (const u of CHEMISTRY_UNITS) expect(courseIds.has(u.courseId), u.id).toBe(true);
    for (const o of CHEMISTRY_OBJECTIVES) expect(o.id.startsWith('chem.'), o.id).toBe(true);
    for (const o of CHEMISTRY_OBJECTIVES) for (const r of o.standardRefs) expect(r.verified, `${o.id}/${r.code}`).toBe(false);
  });

  it('lesson objectives and prerequisites exist in the chemistry slice', () => {
    const ids = new Set([...CHEMISTRY_OBJECTIVES, ...CHEMISTRY_PREREQUISITES].map((o) => o.id));
    for (const l of CHEMISTRY_LESSONS) {
      for (const o of l.objectiveIds) expect(ids.has(o), `${l.id}/${o}`).toBe(true);
      for (const o of l.prerequisiteObjectiveIds) expect(ids.has(o), `${l.id}/${o}`).toBe(true);
    }
  });

  it('each lesson meets the experience spec: prediction in Discover, sim-task + assumption in Explore, ≥6 problems over ≥6 categories', () => {
    for (const l of CHEMISTRY_LESSONS) {
      const discover = l.stages.find((s) => s.kind === 'discover')!;
      expect(discover.blocks.some((b) => b.type === 'prediction'), `${l.id} discover`).toBe(true);
      const explore = l.stages.find((s) => s.kind === 'explore')!;
      expect(explore.blocks.some((b) => b.type === 'sim-task' && b.observe.length > 0), `${l.id} explore`).toBe(true);
      expect(explore.blocks.some((b) => b.type === 'callout' && b.tone === 'assumption'), `${l.id} assumption`).toBe(true);
      expect(l.problems.length, l.id).toBeGreaterThanOrEqual(6);
      const cats = new Set(l.problems.map((p) => p.category));
      expect(cats.size, `${l.id} categories ${[...cats].join(',')}`).toBeGreaterThanOrEqual(6);
      for (const c of ['conceptual', 'computation', 'procedural', 'multi-step', 'error-identification', 'explanation'] as const) expect(cats.has(c), `${l.id} missing ${c}`).toBe(true);
      expect(cats.has('application') || cats.has('transfer'), `${l.id} application/transfer`).toBe(true);
      const demo = l.stages.find((s) => s.kind === 'demonstrate')!;
      expect(demo.blocks.some((b) => b.type === 'problem'), `${l.id} demonstrate`).toBe(true);
    }
  });

  it('every "mastered" requirement is attainable: ≥2 Demonstrate problems per objective, one of them transfer/application', () => {
    for (const l of CHEMISTRY_LESSONS) {
      const demo = l.stages.find((s) => s.kind === 'demonstrate')!;
      const demoProblems = demo.blocks.filter((b): b is Extract<typeof b, { type: 'problem' }> => b.type === 'problem').map((b) => l.problems.find((p) => p.id === b.problemId)!);
      for (const m of l.mastery) {
        const targeting = demoProblems.filter((p) => p.objectiveIds.includes(m.objectiveId) && p.kind !== 'written');
        if (m.level === 'mastered') {
          expect(targeting.length, `${l.id}/${m.objectiveId} independent problems`).toBeGreaterThanOrEqual(2);
          expect(targeting.some((p) => p.category === 'transfer' || p.category === 'application'), `${l.id}/${m.objectiveId} transfer`).toBe(true);
        }
        expect(l.problems.filter((p) => p.objectiveIds.includes(m.objectiveId) && p.kind !== 'written').length, `${l.id}/${m.objectiveId} distinct problems`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it('every preset referenced by a stage or block resolves', async () => {
    const { resolvePreset } = await import('@/worlds/chemistry/ui/presets');
    for (const l of CHEMISTRY_LESSONS) {
      for (const s of l.stages) {
        for (const p of s.presets ?? []) expect(resolvePreset(p), `${l.id}/${s.kind}/${p}`).not.toBeNull();
        for (const b of s.blocks) {
          if (b.type === 'prediction') expect(resolvePreset(b.revealPreset), `${l.id}/${b.id}`).not.toBeNull();
          if (b.type === 'sim-task') expect(resolvePreset(b.preset), `${l.id}/${s.kind}`).not.toBeNull();
        }
      }
    }
  });

  it('every reference solution grades as correct when entered as the answer', () => {
    for (const { lesson, p } of ALL_PROBLEMS) {
      if (p.kind === 'numeric') {
        const input = p.answer.unit ? `${p.answer.value} ${p.answer.unit}` : `${p.answer.value}`;
        expect(grade(p, input).status, `${lesson}/${p.id}`).toBe('correct');
      } else if (p.kind === 'expression') {
        expect(grade(p, p.answer).status, `${lesson}/${p.id}`).toBe('correct');
      } else if (p.kind === 'multiple-choice') {
        expect(grade(p, p.correctId).status, `${lesson}/${p.id}`).toBe('correct');
      } else if (p.kind === 'short-text') {
        for (const a of p.accepted) expect(grade(p, a).status, `${lesson}/${p.id}: ${a}`).toBe('correct');
      }
    }
  });

  it('short-text answers also grade correct with unicode sub/superscripts and different case', () => {
    const sup: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    const o = byId.get('l2-config-o')!;
    expect(grade(o, '1s² 2s² 2p⁴').status).toBe('correct');
    expect(grade(o, '[He] 2s^2 2p^4').status).toBe('correct');
    expect(grade(o, '1S2 2S2 2P4').status).toBe('correct');
    expect(grade(byId.get('l4-ionic-formula')!, 'MgCl₂').status).toBe('correct');
    expect(grade(byId.get('l4-demo-al2o3')!, 'Al₂O₃').status).toBe('correct');
    expect(grade(byId.get('l2-demo-br')!, `[Ar] 3d${sup['1']}${sup['0']} 4s${sup['2']} 4p${sup['5']}`).status).toBe('correct');
    expect(grade(byId.get('l2-ion-config')!, '[Ne]').status).toBe('correct');
  });

  it('every misconception is graded incorrect and attributed', () => {
    for (const { p } of ALL_PROBLEMS) {
      if (p.kind === 'numeric') {
        for (const m of p.misconceptions ?? []) {
          const r = grade(p, p.answer.unit ? `${m.value} ${p.answer.unit}` : `${m.value}`);
          expect(r.status, `${p.id}/${m.id}`).toBe('incorrect');
          expect(r.misconceptionId, `${p.id}/${m.id}`).toBe(m.id);
        }
      }
      if (p.kind === 'expression') {
        for (const m of p.misconceptions ?? []) {
          const r = grade(p, m.expression);
          expect(r.status, `${p.id}/${m.id}`).toBe('incorrect');
          expect(r.misconceptionId, `${p.id}/${m.id}`).toBe(m.id);
        }
      }
      if (p.kind === 'short-text') {
        for (const m of p.misconceptions ?? []) {
          for (const a of m.accepted) {
            const r = grade(p, a);
            expect(r.status, `${p.id}/${m.id}: ${a}`).toBe('incorrect');
            expect(r.misconceptionId, `${p.id}/${m.id}: ${a}`).toBe(m.id);
          }
        }
      }
      if (p.kind === 'multiple-choice') {
        for (const o of p.options) if (o.id !== p.correctId) expect(grade(p, o.id).status, `${p.id}/${o.id}`).toBe('incorrect');
      }
    }
  });

  it('numeric and short-text answers agree with the chemistry model', async () => {
    const { describeAtom, averageAtomicMass, ISOTOPE_DATA } = await import('@/worlds/chemistry/model/atom');
    const { electronConfiguration, ionConfiguration, positionFromConfiguration, predictedIonCharge, shellCapacity, valenceElectrons } = await import('@/worlds/chemistry/model/configuration');
    const { ELEMENTS, elementBySymbol } = await import('@/worlds/chemistry/model/elements');
    const { ionicFormulaBySymbols, predictBondBySymbols, totalValenceElectrons } = await import('@/worlds/chemistry/model/bonding');
    const { moleculeByFormula } = await import('@/worlds/chemistry/model/molecules');

    const expectNumeric = (id: string, value: number, rel = 0.002) => {
      const p = byId.get(id)!;
      if (p.kind !== 'numeric') throw new Error(id);
      expect(Math.abs(p.answer.value - value), id).toBeLessThanOrEqual(rel * Math.max(1, Math.abs(value)));
    };
    const expectAccepted = (id: string, value: string) => {
      const p = byId.get(id)!;
      if (p.kind !== 'short-text') throw new Error(id);
      expect(p.accepted, id).toContain(value);
    };
    const EN = (s: string) => elementBySymbol(s)!.electronegativity!;

    // Lesson 1
    expectNumeric('l1-neutrons-c14', describeAtom(6, 8, 6).massNumber - 6);
    expectNumeric('l1-ion-charge', describeAtom(12, 12, 10).charge);
    expectNumeric('l1-avg-mass', averageAtomicMass(ISOTOPE_DATA.Cl!));
    expectNumeric('l1-avg-mass', elementBySymbol('Cl')!.atomicMass);
    expectNumeric('l1-ion-electrons', 8 - describeAtom(8, 8, 10).charge);
    expectNumeric('l1-demo-uranium', 238 - elementBySymbol('U')!.z);
    expectNumeric('l1-demo-copper', averageAtomicMass(ISOTOPE_DATA.Cu!));
    expectAccepted('l1-notation', describeAtom(17, 20, 17).hyphenNotation);
    expectNumeric('l1-demo-sulfide-mass', describeAtom(16, 16, 18).massNumber);
    // Lesson 2
    expectNumeric('l2-shell-capacity', shellCapacity(3));
    expectNumeric('l2-demo-si-outer', positionFromConfiguration(electronConfiguration(14)).outerShellElectrons);
    expectAccepted('l2-config-o', electronConfiguration(8).full);
    expectAccepted('l2-config-cl-noble', electronConfiguration(17).nobleGasCore);
    expectAccepted('l2-config-fe', electronConfiguration(26).nobleGasCore);
    expectAccepted('l2-demo-br', electronConfiguration(35).nobleGasCore);
    expectAccepted('l2-ion-config', ionConfiguration(11, 1).full);
    expectAccepted('l2-identify', ELEMENTS.find((e) => electronConfiguration(e.z).nobleGasCore === '[Ar] 4s2')!.symbol);
    // Lesson 3
    expectNumeric('l3-en-read', Math.abs(EN('H') - EN('O')));
    expectNumeric('l3-valence', valenceElectrons(elementBySymbol('P')!)!);
    expectNumeric('l3-demo-en-mgo', Math.abs(EN('Mg') - EN('O')));
    expectNumeric('l3-demo-find-element', ELEMENTS.find((e) => e.period === 4 && valenceElectrons(e) === 7)!.z);
    expectAccepted('l3-ion-pred', `${predictedIonCharge(elementBySymbol('Ca')!)}+`);
    expectAccepted('l3-demo-sulfur-ion', `${Math.abs(predictedIonCharge(elementBySymbol('S')!)!)}-`);
    expect([EN('Br'), EN('Cl'), EN('F')]).toEqual([...[EN('Br'), EN('Cl'), EN('F')]].sort((a, b) => a - b));
    // Lesson 4
    expectNumeric('l4-delta-en', predictBondBySymbols('H', 'Cl')!.deltaEN);
    expect(predictBondBySymbols('H', 'Cl')!.recommended).toBe('polar-covalent');
    expect(predictBondBySymbols('Na', 'Cl')!.recommended).toBe('ionic');
    expect(predictBondBySymbols('H', 'F')!.recommended).toBe('polar-covalent');
    expect(predictBondBySymbols('C', 'S')!.recommended).toBe('nonpolar-covalent');
    expect(predictBondBySymbols('K', 'Br')!.recommended).toBe('ionic');
    expectNumeric('l4-valence-total', totalValenceElectrons(['C', 'O', 'O'])!);
    expectNumeric('l4-lone-pairs', moleculeByFormula('NH3')!.vsepr!.lonePairs);
    expectNumeric('l4-angle', moleculeByFormula('H2O')!.vsepr!.measuredAngle!);
    expectNumeric('l4-demo-domains', moleculeByFormula('SO2')!.vsepr!.electronDomains);
    expectAccepted('l4-ionic-formula', ionicFormulaBySymbols('Mg', 'Cl')!.formula);
    expectAccepted('l4-demo-al2o3', ionicFormulaBySymbols('Al', 'O')!.formula);
    expectAccepted('l4-demo-shape-bf3', moleculeByFormula('BF3')!.vsepr!.molecularGeometry);
  });
});
