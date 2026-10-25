import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 1 — Inside the atom.
 * Reference values (from model/atom.ts and model/elements.ts):
 *   C-14: Z = 6, A = 14, N = 8;  Cl-37: 17 p, 20 n;  U-238: 92 p, 146 n
 *   Mg²⁺: 12 p, 10 e → charge +2;  O²⁻: 8 p, 10 e;  S²⁻: 16 p, 16 n, 18 e → A = 32
 *   Average atomic mass of Cl from 34.969 u (75.76%) and 36.966 u (24.24%) = 35.45 u
 *   Average atomic mass of Cu from 62.930 u (69.15%) and 64.928 u (30.85%) = 63.55 u
 */
export const insideTheAtom: LessonSpec = {
  id: 'chemistry.inside-the-atom',
  worldId: 'atoms-molecules',
  title: 'Inside the atom',
  subtitle: 'Protons decide the element; neutrons and electrons change everything else',
  minutes: 40,
  objectiveIds: ['chem.atom.identity', 'chem.atom.isotopes', 'chem.atom.ions'],
  prerequisiteObjectiveIds: [],
  standardRefs: [],
  accessibilitySummary:
    'The atom builder shows three counters (protons, neutrons, electrons) with plus and minus buttons. A panel names the element, mass number, charge and isotope notation, and a Bohr-style diagram shows how many electrons sit in each shell. The diagram is a teaching idealisation: electrons do not orbit in rings.',
  validationTests: ['chemistry.test.ts: atom builder arithmetic', 'chemistry.test.ts: average atomic mass of chlorine from its isotopes', 'chemistry.test.ts: handles ions'],
  mastery: [
    { objectiveId: 'chem.atom.identity', level: 'mastered' },
    { objectiveId: 'chem.atom.isotopes', level: 'proficient' },
    { objectiveId: 'chem.atom.ions', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'What makes carbon carbon?',
      presets: ['atom:carbon-12'],
      blocks: [
        { type: 'text', md: 'Here is a carbon atom: 6 protons, 6 neutrons, 6 electrons. Carbon is in your pencil, your food and you. Suppose we start changing the parts.' },
        {
          type: 'prediction',
          id: 'pred-add-neutrons',
          question: 'We add two neutrons to the nucleus (6 protons, 8 neutrons, 6 electrons). What do we have now?',
          options: [
            { id: 'oxygen', text: 'Oxygen, because there are now 8 of the heavier particle and 8 is oxygen’s number' },
            { id: 'carbon', text: 'Still carbon, but a heavier version of it' },
            { id: 'ion', text: 'A carbon ion with a charge of 2+' },
          ],
          correctId: 'carbon',
          revealPreset: 'atom:carbon-14',
          explanation: 'The panel still says carbon. Only the number of protons decides the element. Extra neutrons make a heavier isotope, carbon-14, which is still chemically carbon (it is the one used in radiocarbon dating).',
        },
        {
          type: 'prediction',
          id: 'pred-remove-electron',
          question: 'Now take a sodium atom (11 protons, 12 neutrons, 11 electrons) and remove one electron. What changes?',
          options: [
            { id: 'neon', text: 'It becomes neon, because it now has 10 electrons like neon' },
            { id: 'charge', text: 'It is still sodium but now carries a charge of 1+' },
            { id: 'mass', text: 'Its mass number drops from 23 to 22' },
          ],
          correctId: 'charge',
          revealPreset: 'atom:na-ion',
          explanation: 'Still sodium (11 protons) but with 11 positive and only 10 negative charges: a sodium ion, Na⁺. Electrons have almost no mass, so the mass number stays 23. The electron arrangement does now look like neon’s, which is why Na⁺ is so stable.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Build atoms',
      presets: ['atom:free'],
      blocks: [
        { type: 'text', md: 'Use the **+** and **−** buttons. Watch which readouts change when you change each particle.' },
        {
          type: 'sim-task',
          preset: 'atom:hydrogen-1',
          instructions: 'Start from hydrogen (1 proton). Add protons one at a time up to 10, keeping neutrons equal to protons and electrons equal to protons.',
          observe: [
            'Which readout changes the element name: protons, neutrons or electrons?',
            'How the mass number relates to protons + neutrons',
            'How many electrons fit in the first ring before a second ring appears, and in the second',
          ],
        },
        {
          type: 'sim-task',
          preset: 'atom:chlorine',
          instructions: 'Load chlorine-35. Add one electron, then remove it and remove a second one. Then put electrons back to 17 and change neutrons from 18 to 20.',
          observe: [
            'The charge reading and sign when electrons outnumber protons, and when protons outnumber electrons',
            'That changing neutrons alters the mass number and the isotope notation but never the element or the charge',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Idealisations: the Bohr diagram shows electrons as dots in rings so you can count them per shell. Real electrons occupy fuzzy orbitals, not orbits, and the nucleus is drawn far too large (a real nucleus is about 1/100,000 of the atom’s width). The builder also lets you make nuclei that would not hold together, such as 6 protons with 30 neutrons; it reports counts, not stability.' },
      ],
    },
    {
      kind: 'understand',
      title: 'Three numbers describe an atom',
      presets: ['atom:carbon-12'],
      blocks: [
        { type: 'text', md: 'The **atomic number** $Z$ is the number of protons. It alone fixes which element you have. The **mass number** $A$ counts the heavy particles in the nucleus:' },
        { type: 'equation', latex: 'A = Z + N', caption: 'Z = protons, N = neutrons. Electrons are about 1/1800 the mass of a proton and are ignored in A.' },
        { type: 'text', md: 'Isotope notation puts both numbers on the symbol: $^{14}_{6}\\mathrm{C}$, or simply carbon-14. Atoms of the same element with different $N$ are **isotopes**: same chemistry, different mass.' },
        { type: 'text', md: 'A neutral atom has as many electrons as protons. Remove or add electrons and you get an **ion**:' },
        { type: 'equation', latex: '\\text{charge} = (\\text{protons}) - (\\text{electrons})', caption: 'Positive ions (cations) have lost electrons; negative ions (anions) have gained them.' },
        { type: 'text', md: 'The mass printed on the periodic table (35.45 for chlorine) is not a whole number because natural chlorine is a mixture of isotopes. It is the **abundance-weighted average**:' },
        { type: 'equation', latex: '\\bar{m} = \\sum_i (\\text{fraction}_i)\\times m_i', caption: 'Chlorine: 0.7576 × 34.969 + 0.2424 × 36.966 = 35.45 u.' },
        { type: 'callout', tone: 'note', md: 'A common slip is to use the mass number as the neutron count. For carbon-14, 14 is protons **plus** neutrons; the neutrons are 14 − 6 = 8.' },
        { type: 'summary', points: ['Protons → element. Neutrons → isotope (mass). Electrons → charge.', 'A = Z + N; charge = protons − electrons.', 'Tabulated atomic masses are weighted averages over natural isotopes.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['atom:free'],
      blocks: [
        { type: 'text', md: 'Work these with the periodic table in view. The atom builder stays open for checking.' },
        { type: 'problem', problemId: 'l1-identity' },
        { type: 'problem', problemId: 'l1-neutrons-c14' },
        { type: 'problem', problemId: 'l1-notation' },
        { type: 'problem', problemId: 'l1-ion-charge' },
        { type: 'problem', problemId: 'l1-avg-mass' },
        { type: 'problem', problemId: 'l1-error' },
      ],
    },
    {
      kind: 'apply',
      title: 'New atoms, same rules',
      presets: ['atom:oxygen'],
      blocks: [
        { type: 'text', md: 'Oxygen gains electrons rather than losing them. Decide what that does to the counts.' },
        { type: 'problem', problemId: 'l1-ion-electrons' },
        { type: 'problem', problemId: 'l1-explain' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'The environment is hidden. Solve without hints to earn full mastery credit.' },
        { type: 'problem', problemId: 'l1-demo-uranium' },
        { type: 'problem', problemId: 'l1-demo-copper' },
        { type: 'problem', problemId: 'l1-demo-sulfide-mass' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Z (protons) names the element; A = Z + N.', 'Isotopes: same Z, different N. Ions: same Z, different electron count.', 'Average atomic mass = Σ fraction × isotopic mass.'] },
        { type: 'text', md: 'Next lesson: where those electrons actually live, shell by shell, and why the periodic table has the shape it does.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l1-identity', kind: 'multiple-choice', objectiveIds: ['chem.atom.identity'], category: 'conceptual', difficulty: 1,
      prompt: 'Which single number decides whether an atom is carbon, nitrogen or oxygen?',
      options: [
        { id: 'a', text: 'The number of neutrons', feedback: 'Neutrons change the isotope, not the element. Carbon-12, -13 and -14 are all carbon.' },
        { id: 'b', text: 'The number of protons', feedback: 'Correct. The atomic number Z is the count of protons.' },
        { id: 'c', text: 'The number of electrons', feedback: 'Electrons change the charge. Na⁺ with 10 electrons is still sodium, not neon.' },
      ],
      correctId: 'b',
      hints: ['In the builder, change each particle in turn and watch the element name.', 'Only one of the three counters renames the element.'],
      solution: 'The number of protons (atomic number Z) defines the element. Neutrons change the isotope; electrons change the charge.',
    },
    {
      id: 'l1-neutrons-c14', kind: 'numeric', objectiveIds: ['chem.atom.identity'], category: 'computation', difficulty: 1,
      prompt: 'Carbon-14 is used in radiocarbon dating. How many neutrons does a carbon-14 atom have? (Enter a number only.)',
      answer: { value: 8, absTol: 0.1 },
      misconceptions: [
        { id: 'mass-number-as-neutrons', value: 14, feedback: '14 is the mass number: protons plus neutrons. Subtract the 6 protons.' },
        { id: 'protons-as-neutrons', value: 6, feedback: '6 is the number of protons (carbon’s atomic number). Neutrons = 14 − 6.' },
        { id: 'added', value: 20, feedback: 'You added 14 and 6. The mass number already includes the protons; subtract instead.' },
      ],
      hints: ['Carbon is element 6, so it has 6 protons.', 'Mass number A = protons + neutrons, so neutrons = A − Z.'],
      solution: 'N = A − Z = 14 − 6 = 8 neutrons.',
    },
    {
      id: 'l1-notation', kind: 'short-text', objectiveIds: ['chem.atom.identity'], category: 'procedural', difficulty: 2,
      prompt: 'An atom has 17 protons and 20 neutrons. Write it in hyphen notation (element symbol, hyphen, mass number), e.g. "C-12".',
      accepted: ['Cl-37', '37Cl', 'Cl 37', 'chlorine-37', 'Chlorine 37', '^37Cl', '37-Cl'],
      misconceptions: [
        { id: 'neutrons-as-mass', accepted: ['Cl-20', '20Cl', 'chlorine-20'], feedback: 'The mass number is protons + neutrons = 37, not the neutron count alone.' },
        { id: 'protons-as-mass', accepted: ['Cl-17', '17Cl', 'chlorine-17'], feedback: '17 is the atomic number. The mass number adds the 20 neutrons: 37.' },
        { id: 'wrong-element', accepted: ['Ca-37', 'K-37', 'Ar-37'], feedback: '17 protons is chlorine. Find Z = 17 on the table.' },
      ],
      hints: ['Element 17 on the periodic table is chlorine (Cl).', 'Mass number = 17 + 20.'],
      solution: 'Z = 17 → chlorine. A = 17 + 20 = 37. Notation: Cl-37 (or ³⁷Cl).',
      placeholder: 'e.g. C-12',
    },
    {
      id: 'l1-ion-charge', kind: 'numeric', objectiveIds: ['chem.atom.ions'], category: 'computation', difficulty: 1,
      prompt: 'A magnesium particle has 12 protons, 12 neutrons and 10 electrons. What is its charge? (Give the sign and number, e.g. "-1" or "+3".)',
      answer: { value: 2, absTol: 0.1 },
      misconceptions: [
        { id: 'sign-reversed', value: -2, feedback: 'Fewer electrons than protons means more positive than negative charge: the ion is positive, 2+.' },
        { id: 'added-counts', value: 22, feedback: 'Charge is protons minus electrons, not their sum.' },
        { id: 'neutron-charge', value: 0, feedback: 'Neutrons are neutral and do not affect charge; compare protons (12) with electrons (10).' },
      ],
      hints: ['Protons are +1 each, electrons −1 each, neutrons 0.', 'Charge = protons − electrons = 12 − 10.'],
      solution: 'Charge = 12 − 10 = +2. This is the magnesium ion Mg²⁺.',
    },
    {
      id: 'l1-avg-mass', kind: 'numeric', objectiveIds: ['chem.atom.isotopes'], category: 'multi-step', difficulty: 3,
      prompt: 'Natural chlorine is 75.76% chlorine-35 (mass 34.969 u) and 24.24% chlorine-37 (mass 36.966 u). Compute the average atomic mass in u. (Number only.)',
      answer: { value: 35.45, relTol: 0.002 },
      misconceptions: [
        { id: 'simple-mean', value: 35.97, relTol: 0.002, feedback: 'That is the plain average of the two masses. The isotopes are not equally abundant: weight each mass by its fraction.' },
        { id: 'percent-not-fraction', value: 3545, feedback: 'You used percentages instead of fractions. Divide by 100 (or your result by 100).' },
      ],
      hints: ['Convert percentages to fractions: 0.7576 and 0.2424.', 'Average = 0.7576 × 34.969 + 0.2424 × 36.966.'],
      solution: '0.7576 × 34.969 = 26.49; 0.2424 × 36.966 = 8.96; sum = 35.45 u, matching the periodic table.',
    },
    {
      id: 'l1-error', kind: 'multiple-choice', objectiveIds: ['chem.atom.ions', 'chem.atom.identity'], category: 'error-identification', difficulty: 2,
      prompt: 'A student writes: "Na⁺ has 10 protons and 11 electrons, which is why it is positive." What is wrong?',
      options: [
        { id: 'a', text: 'Nothing: a positive ion has more electrons than protons.', feedback: 'Electrons are negative. More electrons would make the ion negative.' },
        { id: 'b', text: 'Sodium always has 11 protons; Na⁺ has 11 protons and 10 electrons.', feedback: 'Correct. Forming an ion changes the electron count only; the proton count is what makes it sodium.' },
        { id: 'c', text: 'The numbers are right but the ion should be written Na⁻.', feedback: 'With 10 protons it would not be sodium at all. Protons never change in chemistry.' },
      ],
      correctId: 'b',
      hints: ['Which particle count can change when an ion forms?', 'Look up sodium’s atomic number.'],
      solution: 'Ions form by losing or gaining electrons. Na has 11 protons; Na⁺ keeps 11 protons and has 10 electrons: 11 − 10 = +1.',
    },
    {
      id: 'l1-ion-electrons', kind: 'numeric', objectiveIds: ['chem.atom.ions'], category: 'application', difficulty: 2,
      prompt: 'The oxide ion is O²⁻. How many electrons does it have? (Number only.)',
      answer: { value: 10, absTol: 0.1 },
      misconceptions: [
        { id: 'subtracted', value: 6, feedback: 'A negative charge means the ion has GAINED electrons: 8 + 2, not 8 − 2.' },
        { id: 'neutral', value: 8, feedback: '8 is the electron count of a neutral oxygen atom. The 2− charge means two extra electrons.' },
      ],
      hints: ['Oxygen is element 8: 8 protons.', 'Charge = protons − electrons, so −2 = 8 − electrons.'],
      solution: 'electrons = protons − charge = 8 − (−2) = 10.',
    },
    {
      id: 'l1-explain', kind: 'written', objectiveIds: ['chem.atom.isotopes'], category: 'explanation', difficulty: 3,
      prompt: 'Carbon-12 and carbon-14 take part in exactly the same chemical reactions, yet carbon-14 is radioactive and carbon-12 is not. Explain both facts in terms of the particles in each atom.',
      modelAnswer: 'Both atoms have 6 protons and therefore 6 electrons when neutral. Chemical behaviour is governed by the electrons (and the nuclear charge that holds them), which are identical, so their chemistry is the same. They differ only in neutrons: 6 versus 8. Stability of the nucleus depends on the balance of protons and neutrons; with 8 neutrons the carbon nucleus is unstable and eventually decays, which is a nuclear property, not a chemical one.',
      rubric: ['States that both have 6 protons (same element) and the same electron count', 'Attributes chemical behaviour to the electrons/nuclear charge', 'Attributes radioactivity to the neutron count (8 vs 6) and the nucleus, not the electrons'],
      hints: ['Which particles differ between the two atoms, and which particles take part in chemistry?'],
      solution: 'See model answer.',
    },
    {
      id: 'l1-demo-uranium', kind: 'numeric', objectiveIds: ['chem.atom.identity'], category: 'transfer', difficulty: 2,
      prompt: 'Uranium-238 is the most common isotope of uranium (atomic number 92). How many neutrons does one atom contain? (Number only.)',
      answer: { value: 146, absTol: 0.1 },
      misconceptions: [
        { id: 'mass-number-as-neutrons', value: 238, feedback: '238 is the mass number, protons plus neutrons.' },
        { id: 'protons', value: 92, feedback: '92 is the number of protons. Neutrons = 238 − 92.' },
      ],
      hints: ['N = A − Z.'],
      solution: 'N = 238 − 92 = 146 neutrons.',
    },
    {
      id: 'l1-demo-copper', kind: 'numeric', objectiveIds: ['chem.atom.isotopes'], category: 'transfer', difficulty: 3,
      prompt: 'Copper has two stable isotopes: copper-63 (62.930 u, 69.15%) and copper-65 (64.928 u, 30.85%). What average atomic mass should appear on the periodic table? (Number only, in u.)',
      answer: { value: 63.55, relTol: 0.002 },
      misconceptions: [
        { id: 'simple-mean', value: 63.93, relTol: 0.002, feedback: 'That is the unweighted mean. Multiply each mass by its abundance fraction first.' },
      ],
      hints: ['Fractions: 0.6915 and 0.3085.', 'Average = 0.6915 × 62.930 + 0.3085 × 64.928.'],
      solution: '0.6915 × 62.930 = 43.52; 0.3085 × 64.928 = 20.03; total 63.55 u.',
    },
    {
      id: 'l1-demo-sulfide-mass', kind: 'numeric', objectiveIds: ['chem.atom.identity', 'chem.atom.ions'], category: 'application', difficulty: 2,
      prompt: 'A particle has 16 protons, 16 neutrons and 18 electrons. What is its mass number? (Number only.)',
      answer: { value: 32, absTol: 0.1 },
      misconceptions: [
        { id: 'counted-electrons', value: 34, feedback: 'Electrons do not count toward the mass number. A = protons + neutrons only.' },
        { id: 'all-particles', value: 50, feedback: 'You added all three counts. Mass number is protons + neutrons; electrons are far too light to count.' },
        { id: 'charge', value: -2, feedback: 'That is the charge (16 − 18 = −2), not the mass number. A = 16 + 16.' },
      ],
      hints: ['Which particles live in the nucleus?', 'A = Z + N; the 18 electrons only tell you the charge (2−).'],
      solution: 'A = 16 + 16 = 32. The particle is the sulfide ion ³²S²⁻ (16 − 18 = −2).',
    },
  ],
};
