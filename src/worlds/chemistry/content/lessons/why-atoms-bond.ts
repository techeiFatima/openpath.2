import type { LessonSpec } from '@/core/world/spec';
import { formulaAnswers } from './helpers';

/**
 * Lesson 4 — Why atoms bond.
 * Reference values (model/bonding.ts, model/molecules.ts, model/elements.ts):
 *   ΔEN thresholds (rule of thumb): < 0.4 nonpolar covalent, 0.4–1.7 polar covalent, > 1.7 ionic
 *   ΔEN(H, Cl) = 3.16 − 2.20 = 0.96 (polar covalent);  ΔEN(H, F) = 1.78 (polar covalent despite the rule)
 *   ΔEN(Na, Cl) = 2.23 (ionic);  ΔEN(C, S) = 0.03 (nonpolar);  ΔEN(K, Br) = 2.14;  Mg + Cl → MgCl2;  Al + O → Al2O3
 *   Valence electrons: CO2 = 4 + 6 + 6 = 16;  NH3: N has 1 lone pair;  SO2: 3 electron domains on S
 *   H2O: 4 domains, 2 lone pairs, bent, ideal 109.5°, measured 104.5°;  BF3: trigonal planar, 120°
 */
export const whyAtomsBond: LessonSpec = {
  id: 'chemistry.why-atoms-bond',
  worldId: 'atoms-molecules',
  title: 'Why atoms bond',
  subtitle: 'Transfer or share? Then count the pairs and the shape follows',
  minutes: 55,
  objectiveIds: ['chem.bond.type', 'chem.bond.lewis', 'chem.bond.vsepr'],
  prerequisiteObjectiveIds: ['chem.atom.valence', 'chem.atom.trends'],
  standardRefs: [],
  accessibilitySummary:
    'The molecule viewer shows a ball-and-stick model of a chosen molecule in idealised VSEPR geometry, with the central atom’s lone pairs and electron domains, the geometry name, the ideal and measured bond angles, the bond type from electronegativity and whether the molecule is polar. In text mode the same facts are listed.',
  validationTests: ['chemistry.test.ts: classifies by electronegativity difference', 'chemistry.test.ts: builds ionic formulas from group charges', 'chemistry.test.ts: electron domains = bonded atoms + lone pairs', 'chemistry.test.ts: drawn Lewis structures account for all valence electrons'],
  mastery: [
    { objectiveId: 'chem.bond.type', level: 'mastered' },
    { objectiveId: 'chem.bond.lewis', level: 'proficient' },
    { objectiveId: 'chem.bond.vsepr', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'Two ways to finish a shell',
      presets: ['molecule:NaCl'],
      blocks: [
        { type: 'text', md: 'Sodium has one valence electron too many for a full shell; chlorine is one short. Hydrogen and oxygen are both short. Atoms solve the problem in two different ways.' },
        {
          type: 'prediction',
          id: 'pred-nacl',
          question: 'When sodium meets chlorine, what happens to sodium’s outer electron?',
          options: [
            { id: 'share', text: 'The two atoms share it between them' },
            { id: 'transfer', text: 'It moves completely to chlorine, leaving Na⁺ and Cl⁻' },
            { id: 'nothing', text: 'Nothing: both atoms keep their electrons and just stick together' },
          ],
          correctId: 'transfer',
          revealPreset: 'molecule:NaCl',
          explanation: 'With ΔEN = 2.23 and a metal facing a nonmetal, the electron transfers. The result is a pair of oppositely charged ions that attract: an ionic bond. In the solid each ion is surrounded by six of the other kind; there is no "NaCl molecule".',
        },
        {
          type: 'prediction',
          id: 'pred-water-shape',
          question: 'Water is H–O–H. Will the three atoms lie in a straight line?',
          options: [
            { id: 'linear', text: 'Yes: two bonds, so 180° apart' },
            { id: 'bent', text: 'No: the molecule is bent, with an angle near 105°' },
            { id: 'right', text: 'No: exactly 90°, because p orbitals are at right angles' },
          ],
          correctId: 'bent',
          revealPreset: 'molecule:H2O',
          explanation: 'Oxygen carries two lone pairs as well as the two bonds: four electron domains in a tetrahedral arrangement. The lone pairs take up two corners, so the H–O–H angle is bent (ideal 109.5°, measured 104.5°).',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Count domains, see shapes',
      presets: ['molecule:CH4', 'molecule:CO2'],
      blocks: [
        {
          type: 'sim-task',
          preset: 'molecule:CH4',
          instructions: 'Load methane, then ammonia (NH₃), then water (H₂O). All three have four electron domains around the central atom. Read the lone-pair count, the geometry name and both angles for each.',
          observe: [
            'How the molecular shape name changes as bonds are replaced by lone pairs (tetrahedral → trigonal pyramidal → bent)',
            'How the measured angle falls below 109.5° as lone pairs are added',
            'Which of the three molecules are polar, and what the C–H ΔEN is compared with O–H',
          ],
        },
        {
          type: 'sim-task',
          preset: 'molecule:CO2',
          instructions: 'Load carbon dioxide and then sulfur dioxide. Both have two bonded oxygens.',
          observe: [
            'Why CO₂ is linear (2 domains) but SO₂ is bent (3 domains: two bonds plus a lone pair)',
            'That CO₂ has polar bonds yet is a nonpolar molecule, while SO₂ is polar',
            'The bond type reported for Na–Cl, H–F and H–Cl, and the caveat shown for H–F',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Idealisations: the 3D models use idealised VSEPR geometry with typical bond lengths, not measured coordinates; the measured angle is reported separately. Lewis structures show one resonance form (SO₂, O₃). The ΔEN thresholds are a rule of thumb: real bonding is a continuum, and the metal/nonmetal distinction matters more than the exact number.' },
      ],
    },
    {
      kind: 'understand',
      title: 'From electronegativity to shape',
      presets: ['molecule:H2O'],
      blocks: [
        { type: 'text', md: '**Step 1: ionic or covalent?** A metal with a nonmetal transfers electrons (ionic). Two nonmetals share (covalent). The electronegativity difference tells you how unequal the sharing is:' },
        { type: 'equation', latex: '\\Delta EN < 0.4:\\ \\text{nonpolar covalent}\\qquad 0.4 \\le \\Delta EN \\le 1.7:\\ \\text{polar covalent}\\qquad \\Delta EN > 1.7:\\ \\text{ionic}', caption: 'Rule of thumb only. H–F (1.78) is covalent because both are nonmetals; many metal–nonmetal pairs below 1.7 are still called ionic.' },
        { type: 'text', md: '**Ionic formulas.** Ions combine so that the charges cancel. Mg²⁺ with Cl⁻ needs two chlorides: MgCl₂. Al³⁺ with O²⁻: two aluminiums (6+) balance three oxides (6−): Al₂O₃.' },
        { type: 'text', md: '**Step 2: the Lewis structure.** Add up the valence electrons (CO₂: 4 + 6 + 6 = 16). Join atoms with single bonds, complete the octets of outer atoms with lone pairs, and put any leftovers on the central atom. If the central atom is still short, convert lone pairs on outer atoms into double or triple bonds. Hydrogen is full with two electrons.' },
        { type: 'equation', latex: '\\text{electrons around an atom} = 2\\times(\\text{bond orders}) + 2\\times(\\text{lone pairs})', caption: 'Water: O has 2 bonds and 2 lone pairs → 4 + 4 = 8. Boron in BF₃ stops at 6: a stable exception.' },
        { type: 'text', md: '**Step 3: VSEPR.** Around the central atom, count **electron domains** = bonded atoms + lone pairs (a double or triple bond is still one domain). Domains repel and spread out: 2 → linear (180°), 3 → trigonal planar (120°), 4 → tetrahedral (109.5°). Lone pairs occupy corners but are invisible in the shape name: 4 domains with 1 lone pair is **trigonal pyramidal** (NH₃), with 2 lone pairs **bent** (H₂O). Lone pairs repel a little more, so real angles are a few degrees smaller.' },
        { type: 'text', md: '**Step 4: polar or not?** A molecule is polar if its bond dipoles do not cancel. Symmetric shapes with identical outer atoms (CO₂, CH₄, BF₃) are nonpolar even with polar bonds; bent or pyramidal molecules (H₂O, NH₃, SO₂) are polar.' },
        { type: 'summary', points: ['Metal + nonmetal → ionic (transfer); nonmetal + nonmetal → covalent (share); ΔEN grades the polarity.', 'Lewis: count valence electrons; octets (duet for H); B can stop at 6.', 'VSEPR: domains = bonds + lone pairs → 2 linear, 3 trigonal planar, 4 tetrahedral; lone pairs bend the shape and shrink the angle.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['molecule:NH3'],
      blocks: [
        { type: 'text', md: 'Pauling values: H 2.20, C 2.55, N 3.04, O 3.44, F 3.98, Na 0.93, Mg 1.31, Al 1.61, Cl 3.16. Formulas can be typed as `MgCl2`.' },
        { type: 'problem', problemId: 'l4-bond-type' },
        { type: 'problem', problemId: 'l4-delta-en' },
        { type: 'problem', problemId: 'l4-ionic-formula' },
        { type: 'problem', problemId: 'l4-valence-total' },
        { type: 'problem', problemId: 'l4-lone-pairs' },
        { type: 'problem', problemId: 'l4-error-hf' },
      ],
    },
    {
      kind: 'apply',
      title: 'Shapes and polarity',
      presets: ['molecule:H2O'],
      blocks: [
        { type: 'text', md: 'Now reason from domains to shape, and from shape to polarity.' },
        { type: 'problem', problemId: 'l4-shape-h2o' },
        { type: 'problem', problemId: 'l4-angle' },
        { type: 'problem', problemId: 'l4-explain' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Viewer hidden. Work from valence electrons and domain counts alone.' },
        { type: 'problem', problemId: 'l4-demo-al2o3' },
        { type: 'problem', problemId: 'l4-demo-domains' },
        { type: 'problem', problemId: 'l4-demo-shape-bf3' },
        { type: 'problem', problemId: 'l4-demo-nonpolar' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['ΔEN and metal/nonmetal together classify the bond; the 0.4/1.7 cut-offs are conventions.', 'Lewis structures account for every valence electron.', 'Electron domains set the shape; lone pairs bend it; symmetry decides polarity.'] },
        { type: 'text', md: 'You have now gone from a bare nucleus to the shape of a molecule. The next world (reactions and stoichiometry) is in design.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l4-bond-type', kind: 'multiple-choice', objectiveIds: ['chem.bond.type'], category: 'conceptual', difficulty: 1,
      prompt: 'Sodium (a metal, EN 0.93) and chlorine (a nonmetal, EN 3.16) form sodium chloride. What kind of bond holds it together and why?',
      options: [
        { id: 'a', text: 'Ionic: sodium transfers its valence electron to chlorine and the resulting ions attract.', feedback: 'Correct. Metal + nonmetal with ΔEN = 2.23: electron transfer.' },
        { id: 'b', text: 'Nonpolar covalent: the two atoms share a pair equally.', feedback: 'Equal sharing needs similar electronegativities. These differ by 2.23.' },
        { id: 'c', text: 'Polar covalent: a shared pair pulled toward chlorine.', feedback: 'With a metal and a nonmetal and such a large ΔEN, the electron is transferred rather than shared.' },
      ],
      correctId: 'a',
      hints: ['Is one element a metal and the other a nonmetal?', 'Compute ΔEN and compare with 1.7.'],
      solution: 'ΔEN = 3.16 − 0.93 = 2.23 > 1.7, and Na is a metal while Cl is a nonmetal: ionic bonding by electron transfer, giving Na⁺ and Cl⁻.',
    },
    {
      id: 'l4-delta-en', kind: 'numeric', objectiveIds: ['chem.bond.type'], category: 'computation', difficulty: 1,
      prompt: 'Compute ΔEN for the H–Cl bond (H 2.20, Cl 3.16) and classify it. Enter the number only; the classification is in the solution.',
      answer: { value: 0.96, absTol: 0.02 },
      misconceptions: [
        { id: 'sum', value: 5.36, feedback: 'You added the electronegativities. Subtract instead.' },
      ],
      hints: ['ΔEN = 3.16 − 2.20.'],
      solution: 'ΔEN = 0.96, between 0.4 and 1.7: polar covalent, with the negative end on chlorine.',
    },
    {
      id: 'l4-ionic-formula', kind: 'short-text', objectiveIds: ['chem.bond.type'], category: 'procedural', difficulty: 2,
      prompt: 'Magnesium (group 2) reacts with chlorine (group 17). Write the formula of the ionic compound formed (e.g. "NaCl").',
      accepted: formulaAnswers('MgCl2'),
      misconceptions: [
        { id: 'one-to-one', accepted: ['MgCl', 'mgcl'], feedback: 'Mg forms Mg²⁺ but Cl forms Cl⁻. Two chlorides are needed to balance one magnesium: MgCl₂.' },
        { id: 'swapped', accepted: ['Mg2Cl', 'mg2cl'], feedback: 'The subscripts are swapped. The 2+ ion needs TWO 1− ions: MgCl₂.' },
        { id: 'both-two', accepted: ['Mg2Cl2', 'mg2cl2'], feedback: 'Reduce to the simplest ratio: MgCl₂.' },
      ],
      hints: ['Mg²⁺ (loses 2), Cl⁻ (gains 1).', 'How many Cl⁻ balance one Mg²⁺?'],
      solution: 'Mg²⁺ + 2 Cl⁻ → MgCl₂. Charges: +2 + 2 × (−1) = 0.',
      placeholder: 'e.g. NaCl',
    },
    {
      id: 'l4-valence-total', kind: 'numeric', objectiveIds: ['chem.bond.lewis'], category: 'computation', difficulty: 2,
      prompt: 'How many valence electrons must a Lewis structure of CO₂ show in total? (Number only.)',
      answer: { value: 16, absTol: 0.1 },
      misconceptions: [
        { id: 'atomic-numbers', value: 22, feedback: 'You added atomic numbers (6 + 8 + 8). Only valence electrons count: C 4, O 6 each.' },
        { id: 'one-oxygen', value: 10, feedback: 'You counted only one oxygen. CO₂ has two: 4 + 6 + 6.' },
        { id: 'group-numbers', value: 46, feedback: 'Group numbers 14 and 16 are not valence counts; subtract 10 for p-block elements: 4 and 6.' },
      ],
      hints: ['Carbon: group 14 → 4 valence electrons. Oxygen: group 16 → 6.', 'Total = 4 + 2 × 6.'],
      solution: '4 + 6 + 6 = 16 electrons: two C=O double bonds (8) plus two lone pairs on each oxygen (8).',
    },
    {
      id: 'l4-lone-pairs', kind: 'numeric', objectiveIds: ['chem.bond.lewis'], category: 'multi-step', difficulty: 3,
      prompt: 'Ammonia, NH₃, has 8 valence electrons. After drawing the three N–H bonds, how many lone pairs sit on nitrogen? (Number only.)',
      answer: { value: 1, absTol: 0.1 },
      misconceptions: [
        { id: 'two-pairs', value: 2, feedback: 'Three bonds use 6 electrons, leaving 8 − 6 = 2 electrons: ONE pair, not two.' },
        { id: 'none', value: 0, feedback: 'Nitrogen has 5 valence electrons and only 3 are in bonds; the other two form a lone pair.' },
        { id: 'electrons-not-pairs', value: 5, feedback: '5 is nitrogen’s valence electron count. Lone pairs are counted in pairs after the bonds are drawn.' },
      ],
      hints: ['Valence electrons: N 5 + 3 × H 1 = 8.', 'Three single bonds use 6 electrons. What remains, and where does it go?'],
      solution: '8 − 6 = 2 electrons left → one lone pair on N. Nitrogen then has 6 + 2 = 8 electrons around it.',
    },
    {
      id: 'l4-error-hf', kind: 'multiple-choice', objectiveIds: ['chem.bond.type'], category: 'error-identification', difficulty: 3,
      prompt: 'A student computes ΔEN(H, F) = 3.98 − 2.20 = 1.78 and concludes "HF is an ionic compound because 1.78 > 1.7". What is wrong?',
      options: [
        { id: 'a', text: 'The arithmetic is wrong; ΔEN is actually below 1.7.', feedback: 'The subtraction is right: 1.78.' },
        { id: 'b', text: 'Nothing: HF is ionic.', feedback: 'HF is a gas of discrete covalent molecules; it is a classic case where the ΔEN rule misleads.' },
        { id: 'c', text: 'The 1.7 cut-off is only a rule of thumb; both H and F are nonmetals, so they share electrons in a very polar covalent bond.', feedback: 'Correct. Metal/nonmetal character decides transfer vs sharing; ΔEN then grades the polarity.' },
      ],
      correctId: 'c',
      hints: ['Is either hydrogen or fluorine a metal?', 'What does the simulation say when you load HF?'],
      solution: 'Two nonmetals share electrons. HF is a strongly polar covalent molecule; the thresholds are conventions that describe a continuum, not sharp boundaries.',
    },
    {
      id: 'l4-shape-h2o', kind: 'multiple-choice', objectiveIds: ['chem.bond.vsepr'], category: 'application', difficulty: 2,
      prompt: 'Oxygen in water has two bonds and two lone pairs. What are the electron-domain geometry and the molecular shape?',
      options: [
        { id: 'a', text: 'Linear domains; linear molecule', feedback: 'Two bonds alone would be linear, but the two lone pairs are also domains: four in total.' },
        { id: 'b', text: 'Tetrahedral domains; bent molecule', feedback: 'Correct. Four domains arrange tetrahedrally; two are lone pairs, so the atoms form a bent shape.' },
        { id: 'c', text: 'Trigonal planar domains; bent molecule', feedback: 'Three domains would be trigonal planar (as in SO₂). Water has four.' },
      ],
      correctId: 'b',
      hints: ['Domains = bonded atoms + lone pairs.', 'Four domains → tetrahedral arrangement; now hide the lone pairs.'],
      solution: '2 bonds + 2 lone pairs = 4 domains → tetrahedral electron geometry. With two corners occupied by lone pairs the H–O–H shape is bent.',
    },
    {
      id: 'l4-angle', kind: 'numeric', objectiveIds: ['chem.bond.vsepr'], category: 'computation', difficulty: 2,
      prompt: 'The ideal tetrahedral angle is 109.5°. What is the measured H–O–H bond angle in water, in degrees? (Number only.)',
      answer: { value: 104.5, absTol: 0.6 },
      misconceptions: [
        { id: 'ideal', value: 109.5, relTol: 0.002, feedback: '109.5° is the ideal tetrahedral angle. Lone pairs repel more strongly than bonds and squeeze the real angle to 104.5°.' },
        { id: 'trigonal', value: 120, relTol: 0.002, feedback: '120° is for three domains. Water has four.' },
        { id: 'linear', value: 180, relTol: 0.002, feedback: 'Water is bent, not linear.' },
        { id: 'right-angle', value: 90, relTol: 0.002, feedback: '90° would ignore the tetrahedral arrangement of the four domains; the measured value is 104.5°.' },
      ],
      hints: ['Lone pairs push bonding pairs closer together.', 'Read the "measured angle" in the molecule viewer for H₂O.'],
      solution: '104.5°, about 5° less than the ideal 109.5° because the two lone pairs repel the O–H bonds more strongly.',
    },
    {
      id: 'l4-explain', kind: 'written', objectiveIds: ['chem.bond.vsepr', 'chem.bond.type'], category: 'explanation', difficulty: 3,
      prompt: 'Both C=O bonds in CO₂ are polar (ΔEN = 0.89), yet CO₂ is a nonpolar molecule, while H₂O (ΔEN = 1.24 per bond) is polar. Explain the difference.',
      modelAnswer: 'Polarity of a molecule depends on whether the bond dipoles add up or cancel. CO₂ has two electron domains on carbon and no lone pairs, so it is linear: the two C=O dipoles are equal and point in opposite directions and cancel exactly. Water has four domains on oxygen, two of them lone pairs, so it is bent; the two O–H dipoles point partly in the same direction and add to a net dipole toward the oxygen. Shape, not just bond polarity, decides molecular polarity.',
      rubric: ['States that CO₂ is linear because of 2 domains / no lone pairs', 'States that H₂O is bent because of lone pairs (4 domains)', 'Explains cancellation of opposite dipoles vs a net dipole in a bent molecule'],
      hints: ['Compare the shapes first. In which one do the two bond dipoles point in opposite directions?'],
      solution: 'See model answer.',
    },
    {
      id: 'l4-demo-al2o3', kind: 'short-text', objectiveIds: ['chem.bond.type'], category: 'transfer', difficulty: 3,
      prompt: 'Aluminium (group 13) combines with oxygen (group 16). Write the formula of the ionic compound.',
      accepted: formulaAnswers('Al2O3'),
      misconceptions: [
        { id: 'one-to-one', accepted: ['AlO', 'alo'], feedback: 'Al³⁺ and O²⁻ do not balance one to one. Find the smallest multiples that give equal total charge.' },
        { id: 'swapped', accepted: ['Al3O2', 'al3o2'], feedback: 'Swapped subscripts: 3 × (+3) = +9 does not balance 2 × (−2) = −4. Two Al³⁺ (+6) balance three O²⁻ (−6).' },
        { id: 'al2o', accepted: ['Al2O', 'al2o'], feedback: 'Two Al³⁺ give +6; one O²⁻ gives −2. You need three oxides.' },
      ],
      hints: ['Al → Al³⁺ (3 valence electrons lost); O → O²⁻.', 'Lowest common multiple of 3 and 2 is 6.'],
      solution: '2 Al³⁺ (+6) + 3 O²⁻ (−6) → Al₂O₃.',
      placeholder: 'e.g. NaCl',
    },
    {
      id: 'l4-demo-domains', kind: 'numeric', objectiveIds: ['chem.bond.lewis', 'chem.bond.vsepr'], category: 'transfer', difficulty: 3,
      prompt: 'In sulfur dioxide, SO₂, sulfur is bonded to two oxygens and carries one lone pair. How many electron domains surround the sulfur atom? (Number only.)',
      answer: { value: 3, absTol: 0.1 },
      misconceptions: [
        { id: 'ignore-lone-pair', value: 2, feedback: 'The lone pair is a domain too: 2 bonded atoms + 1 lone pair = 3.' },
        { id: 'double-bond-counts-twice', value: 4, feedback: 'A double bond is one domain, not two. Count bonded atoms, not bond orders: 2 + 1 = 3.' },
      ],
      hints: ['Domains = bonded atoms + lone pairs on the central atom.', 'Double bonds count once.'],
      solution: '2 + 1 = 3 domains → trigonal planar arrangement; with one lone pair the molecule is bent (~119°).',
    },
    {
      id: 'l4-demo-shape-bf3', kind: 'short-text', objectiveIds: ['chem.bond.vsepr'], category: 'application', difficulty: 3,
      prompt: 'Boron trifluoride, BF₃: boron has three bonds and no lone pairs. Name the molecular shape.',
      accepted: ['trigonal planar', 'triangular planar', 'planar trigonal', 'trigonal'],
      misconceptions: [
        { id: 'pyramidal', accepted: ['trigonal pyramidal', 'pyramidal', 'trigonal pyramid'], feedback: 'Pyramidal needs a lone pair pushing the bonds down (as in NH₃). Boron has none, so the three bonds lie flat at 120°.' },
        { id: 'tetrahedral', accepted: ['tetrahedral'], feedback: 'Tetrahedral requires four domains. Boron has three.' },
        { id: 'bent', accepted: ['bent'], feedback: 'Bent describes two bonded atoms with lone pairs. BF₃ has three bonds and no lone pairs.' },
      ],
      hints: ['Three domains, no lone pairs.', 'Three domains spread out in a plane at 120°.'],
      solution: 'Trigonal planar, F–B–F = 120°. Boron has only six electrons around it: an accepted exception to the octet rule.',
      placeholder: 'shape name',
    },
    {
      id: 'l4-demo-nonpolar', kind: 'multiple-choice', objectiveIds: ['chem.bond.type'], category: 'application', difficulty: 3,
      prompt: 'Pauling values: K 0.82, Br 2.96, H 2.20, O 3.44, C 2.55, S 2.58. Which pair forms an essentially nonpolar covalent bond?',
      options: [
        { id: 'kbr', text: 'K and Br', feedback: 'ΔEN = 2.14 and a metal with a nonmetal: ionic (KBr).' },
        { id: 'ho', text: 'H and O', feedback: 'ΔEN = 1.24: polar covalent.' },
        { id: 'cs', text: 'C and S', feedback: 'Correct. ΔEN = 0.03, well under 0.4, and both are nonmetals: the pair shares almost equally.' },
      ],
      correctId: 'cs',
      hints: ['Compute ΔEN for each pair.', 'Nonpolar covalent needs ΔEN < 0.4 and two nonmetals.'],
      solution: 'C–S: |2.55 − 2.58| = 0.03 → nonpolar covalent. H–O (1.24) is polar covalent; K–Br (2.14, metal + nonmetal) is ionic.',
    },
  ],
};
