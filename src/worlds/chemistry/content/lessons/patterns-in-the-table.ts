import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 3 — Patterns in the table.
 * Reference values (Pauling electronegativities from model/elements.ts):
 *   H 2.20, Li 0.98, Be 1.57, B 2.04, C 2.55, N 3.04, O 3.44, F 3.98
 *   Na 0.93, Mg 1.31, Cl 3.16, Br 2.96, I 2.66, K 0.82, Ca 1.00
 *   ΔEN(H, O) = 1.24;  ΔEN(Mg, O) = 2.13
 *   Valence electrons (configuration.ts): P 5, Ca 2 (ion 2+), Br 7 (Z = 35, period 4, group 17), S 6 (ion 2−)
 *   Radius trend is qualitative only in this world (no numeric radii are stored).
 */
export const patternsInTheTable: LessonSpec = {
  id: 'chemistry.patterns-in-the-table',
  worldId: 'atoms-molecules',
  title: 'Patterns in the table',
  subtitle: 'Size, electron-pulling power and the outer electrons that drive reactivity',
  minutes: 45,
  objectiveIds: ['chem.atom.trends', 'chem.atom.valence'],
  prerequisiteObjectiveIds: ['chem.atom.configuration', 'chem.atom.table-position'],
  standardRefs: [],
  accessibilitySummary:
    'The periodic table panel can colour each element by its Pauling electronegativity (a number from about 0.7 to 3.98) or show the qualitative direction of the atomic-radius trend with arrows. Selecting an element lists its period, group, block, number of valence electrons and the ion it tends to form.',
  validationTests: ['chemistry.test.ts: electronegativity is within the Pauling range and F is the maximum', 'chemistry.test.ts: valence electrons and predicted ion charges for main-group elements'],
  mastery: [
    { objectiveId: 'chem.atom.trends', level: 'proficient' },
    { objectiveId: 'chem.atom.valence', level: 'mastered' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'Which atom is bigger?',
      presets: ['table:blocks'],
      blocks: [
        { type: 'text', md: 'Sodium (Z = 11) and chlorine (Z = 17) sit in the same row. Chlorine has six more protons and six more electrons. Surely the atom with more stuff is bigger?' },
        {
          type: 'prediction',
          id: 'pred-radius',
          question: 'Which neutral atom has the larger radius: sodium or chlorine?',
          options: [
            { id: 'cl', text: 'Chlorine: more electrons take more room' },
            { id: 'na', text: 'Sodium: its outer electron is held more loosely' },
            { id: 'same', text: 'About the same: both have three shells' },
          ],
          correctId: 'na',
          revealPreset: 'table:radius',
          explanation: 'Sodium is the larger atom. Both use shell 3, but chlorine’s 17 protons pull that shell in much harder than sodium’s 11. Across a period, atoms get smaller.',
        },
        {
          type: 'prediction',
          id: 'pred-en',
          question: 'Electronegativity measures how strongly a bonded atom pulls shared electrons toward itself. Which element has the highest value?',
          options: [
            { id: 'f', text: 'Fluorine (top right, just before the noble gases)' },
            { id: 'fr', text: 'Francium (bottom left)' },
            { id: 'og', text: 'Oganesson (bottom right corner)' },
          ],
          correctId: 'f',
          revealPreset: 'table:electronegativity',
          explanation: 'Fluorine, at 3.98, tops the scale. Small atom, high nuclear charge, one electron short of a full shell. Noble gases mostly have no value because they rarely bond.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Read the trends',
      presets: ['table:electronegativity', 'table:radius'],
      blocks: [
        {
          type: 'sim-task',
          preset: 'table:electronegativity',
          instructions: 'With the table coloured by electronegativity, click each element from lithium to fluorine in period 2 and write down the values. Then do the same down group 17: F, Cl, Br, I.',
          observe: [
            'The direction the numbers change across period 2 (left to right)',
            'The direction they change down group 17 (top to bottom)',
            'Which corner of the table has the lowest values, and which the highest',
          ],
        },
        {
          type: 'sim-task',
          preset: 'table:radius',
          instructions: 'Switch to the atomic-radius view. The arrows show the direction in which atoms get bigger. Select sodium, then potassium, then chlorine and compare their period, group and valence-electron readouts.',
          observe: [
            'Which direction increases the number of shells (and therefore size)',
            'Why radius and electronegativity trends run in opposite directions',
            'That every element in a column shows the same valence-electron count',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Idealisations and limits: the radius view shows only the qualitative trend; this world stores no numeric radii, and real values depend on how a radius is defined (covalent, metallic, van der Waals). Electronegativity is the Pauling scale; other scales give different numbers. Trends have exceptions, especially in the d-block.' },
      ],
    },
    {
      kind: 'understand',
      title: 'One idea explains both trends',
      presets: ['table:electronegativity'],
      blocks: [
        { type: 'text', md: 'Two things decide how tightly an outer electron is held: how many shells sit between it and the nucleus (**shielding**), and how much positive charge the nucleus has.' },
        { type: 'text', md: '**Across a period** (left → right) protons are added to the nucleus but electrons go into the *same* shell. The pull on the outer shell grows, the atom shrinks, and the atom attracts bonding electrons more strongly: **radius decreases, electronegativity increases**.' },
        { type: 'text', md: '**Down a group** each step adds a whole new shell. The outer electron is farther away and shielded by more inner electrons: **radius increases, electronegativity decreases**.' },
        { type: 'equation', latex: '\\Delta EN = |EN_A - EN_B|', caption: 'Difference in electronegativity between two bonded atoms; used in the next lesson to classify bonds. H–O: |2.20 − 3.44| = 1.24.' },
        { type: 'text', md: 'The **valence electrons** are those in the outermost shell. For main-group elements the count is the group number (groups 1–2) or group number − 10 (groups 13–18). Elements with one or two valence electrons lose them easily (metals, forming 1+ or 2+ ions); those with six or seven gain electrons (nonmetals, forming 2− or 1− ions); eight means a full shell and almost no reactivity.' },
        { type: 'callout', tone: 'note', md: 'Reactivity follows the trends. Down group 1 the outer electron is easier to remove, so caesium reacts more violently than sodium. Down group 17 the atom attracts electrons less strongly, so fluorine is the most reactive halogen and iodine the least.' },
        { type: 'summary', points: ['Across a period: smaller atoms, higher electronegativity.', 'Down a group: larger atoms, lower electronegativity.', 'Valence electrons = group number (or group − 10); they set the ion charge and reactivity.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['table:electronegativity'],
      blocks: [
        { type: 'text', md: 'Use the table readouts. Electronegativity values are the Pauling values shown when you click an element.' },
        { type: 'problem', problemId: 'l3-radius-trend' },
        { type: 'problem', problemId: 'l3-en-read' },
        { type: 'problem', problemId: 'l3-en-order' },
        { type: 'problem', problemId: 'l3-valence' },
        { type: 'problem', problemId: 'l3-error' },
        { type: 'problem', problemId: 'l3-largest' },
      ],
    },
    {
      kind: 'apply',
      title: 'Predict behaviour',
      presets: ['table:blocks'],
      blocks: [
        { type: 'text', md: 'Use the valence-electron count to predict what an element does, not just where it sits.' },
        { type: 'problem', problemId: 'l3-ion-pred' },
        { type: 'problem', problemId: 'l3-explain' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Table hidden. Values you need are given in the questions.' },
        { type: 'problem', problemId: 'l3-demo-en-mgo' },
        { type: 'problem', problemId: 'l3-demo-find-element' },
        { type: 'problem', problemId: 'l3-demo-sulfur-ion' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Same shell + more protons ⇒ smaller and more electronegative (across).', 'New shell + more shielding ⇒ larger and less electronegative (down).', 'Valence electrons predict ion charge and reactivity; groups behave alike.'] },
        { type: 'text', md: 'Next: put two atoms together and use ΔEN and valence electrons to predict whether they transfer or share electrons.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l3-radius-trend', kind: 'multiple-choice', objectiveIds: ['chem.atom.trends'], category: 'conceptual', difficulty: 1,
      prompt: 'Why is a chlorine atom smaller than a sodium atom, even though it has more electrons?',
      options: [
        { id: 'a', text: 'Chlorine’s electrons are in the same outer shell as sodium’s but are pulled by 17 protons instead of 11.', feedback: 'Correct. Same shell, stronger nuclear pull, smaller atom.' },
        { id: 'b', text: 'Chlorine has fewer shells than sodium.', feedback: 'Both are in period 3 and use three shells.' },
        { id: 'c', text: 'Chlorine’s extra electrons repel each other and pack more tightly.', feedback: 'Electron repulsion would make an atom larger, not smaller. The nucleus is what pulls the shell in.' },
      ],
      correctId: 'a',
      hints: ['Compare the period (number of shells) of Na and Cl.', 'What grows as you move right along a period: shells or protons?'],
      solution: 'Na and Cl are both in period 3. Chlorine has 6 more protons attracting the same outer shell, so its outer electrons sit closer: the atom is smaller.',
    },
    {
      id: 'l3-en-read', kind: 'numeric', objectiveIds: ['chem.atom.trends'], category: 'computation', difficulty: 1,
      prompt: 'Using Pauling values H = 2.20 and O = 3.44, what is the electronegativity difference ΔEN for an H–O bond? (Number only.)',
      answer: { value: 1.24, absTol: 0.02 },
      misconceptions: [
        { id: 'sum', value: 5.64, feedback: 'You added the values. ΔEN is the difference: 3.44 − 2.20.' },
        { id: 'ratio', value: 1.56, relTol: 0.01, feedback: 'You divided. ΔEN is a difference, not a ratio.' },
      ],
      hints: ['ΔEN = |EN(O) − EN(H)|.'],
      solution: '3.44 − 2.20 = 1.24.',
    },
    {
      id: 'l3-en-order', kind: 'short-text', objectiveIds: ['chem.atom.trends'], category: 'procedural', difficulty: 2,
      prompt: 'List fluorine, chlorine and bromine in order of INCREASING electronegativity, using symbols separated by commas (e.g. "X, Y, Z").',
      accepted: ['Br, Cl, F', 'Br Cl F', 'Br < Cl < F', 'Br,Cl,F', 'bromine, chlorine, fluorine'],
      misconceptions: [
        { id: 'decreasing', accepted: ['F, Cl, Br', 'F Cl Br', 'F > Cl > Br', 'F,Cl,Br', 'fluorine, chlorine, bromine'], feedback: 'That is decreasing order. Electronegativity falls DOWN a group, so bromine is lowest and comes first.' },
      ],
      hints: ['All three are in group 17; which is at the top?', 'Electronegativity decreases down a group.'],
      solution: 'Br (2.96) < Cl (3.16) < F (3.98).',
      placeholder: 'e.g. X, Y, Z',
    },
    {
      id: 'l3-valence', kind: 'numeric', objectiveIds: ['chem.atom.valence'], category: 'computation', difficulty: 1,
      prompt: 'How many valence electrons does phosphorus (period 3, group 15) have? (Number only.)',
      answer: { value: 5, absTol: 0.1 },
      misconceptions: [
        { id: 'atomic-number', value: 15, feedback: '15 is the atomic number and the group number. For a p-block element the valence count is group − 10 = 5.' },
        { id: 'period', value: 3, feedback: '3 is the period (number of shells), not the number of electrons in the outer shell.' },
      ],
      hints: ['Configuration: [Ne] 3s2 3p3.', 'Count electrons in the highest shell, or compute group − 10.'],
      solution: '[Ne] 3s² 3p³ → 2 + 3 = 5 valence electrons (group 15 − 10 = 5).',
    },
    {
      id: 'l3-error', kind: 'multiple-choice', objectiveIds: ['chem.atom.trends'], category: 'error-identification', difficulty: 2,
      prompt: 'A student says: "Atomic radius increases from left to right across a period because each element has more electrons." Identify the error.',
      options: [
        { id: 'a', text: 'The direction is wrong: radius DEcreases across a period, because added protons pull the same shell closer.', feedback: 'Correct. More electrons in the same shell do not need more space when the nucleus pulls harder.' },
        { id: 'b', text: 'The reasoning is fine, but it only applies to the d-block.', feedback: 'The statement is wrong for the whole table. Across every period, main-group radii shrink.' },
        { id: 'c', text: 'There is no error.', feedback: 'Check sodium versus chlorine in the radius view: sodium is larger.' },
      ],
      correctId: 'a',
      hints: ['Compare Na and Cl.', 'What happens to the nuclear charge across a period?'],
      solution: 'Across a period electrons enter the same shell while the nuclear charge increases; the shell is pulled in. Radius decreases left to right.',
    },
    {
      id: 'l3-largest', kind: 'multiple-choice', objectiveIds: ['chem.atom.trends'], category: 'multi-step', difficulty: 3,
      prompt: 'Which neutral atom is the largest: sodium (Na), potassium (K), chlorine (Cl) or argon (Ar)?',
      options: [
        { id: 'na', text: 'Sodium', feedback: 'Sodium is the largest in period 3, but potassium has one more shell.' },
        { id: 'k', text: 'Potassium', feedback: 'Correct. Potassium is in period 4 (four shells) and at the far left (lowest nuclear pull on the outer electron).' },
        { id: 'cl', text: 'Chlorine', feedback: 'Chlorine is near the right of period 3: small for its period.' },
        { id: 'ar', text: 'Argon', feedback: 'Argon has the most protons of the period-3 trio and a full, tightly held shell: it is among the smallest.' },
      ],
      correctId: 'k',
      hints: ['First compare periods: who has the most shells?', 'Then, within a period, the leftmost atom is largest.'],
      solution: 'K is in period 4 (one more shell than Na, Cl, Ar) and in group 1. Both trends point to potassium as the largest.',
    },
    {
      id: 'l3-ion-pred', kind: 'short-text', objectiveIds: ['chem.atom.valence'], category: 'application', difficulty: 2,
      prompt: 'Calcium is in group 2. What charge does the calcium ion carry? Write it like "2+" or "1-".',
      accepted: ['2+', '+2', 'Ca2+', 'Ca 2+', 'Ca^2+', 'Ca^{2+}', 'plus 2', '2 plus'],
      misconceptions: [
        { id: 'negative', accepted: ['2-', '-2', 'Ca2-', 'Ca^2-'], feedback: 'Metals LOSE their few valence electrons, leaving a positive ion. Calcium with 2 electrons fewer is 2+.' },
        { id: 'one-plus', accepted: ['1+', '+1', 'Ca+'], feedback: 'Group 2 elements have two valence electrons and lose both: 2+.' },
        { id: 'six-minus', accepted: ['6-', '-6'], feedback: 'Gaining six electrons to fill the shell is far harder than losing two. Metals lose electrons.' },
      ],
      hints: ['Group 2 → 2 valence electrons.', 'Losing two electrons leaves the atom with two more protons than electrons.'],
      solution: 'Calcium is [Ar] 4s². Losing both 4s electrons gives Ca²⁺ with the argon configuration.',
      placeholder: 'e.g. 1+',
    },
    {
      id: 'l3-explain', kind: 'written', objectiveIds: ['chem.atom.valence', 'chem.atom.trends'], category: 'explanation', difficulty: 3,
      prompt: 'Potassium reacts more violently with water than sodium does, and lithium is gentler still. Explain this ordering using atomic structure.',
      modelAnswer: 'All three are group 1 metals with one valence electron; reacting with water means losing that electron. Going down the group the outer electron is in a higher shell, farther from the nucleus and shielded by more inner shells, so it is held more weakly and removed more easily. Lithium’s 2s electron is held hardest, potassium’s 4s electron least, so the reaction becomes more vigorous down the group.',
      rubric: ['Identifies the single valence electron common to group 1', 'Explains that the outer electron is farther away and more shielded down the group', 'Connects ease of losing the electron to reactivity ordering Li < Na < K'],
      hints: ['Which electron is involved in the reaction, and how tightly is it held in each atom?'],
      solution: 'See model answer.',
    },
    {
      id: 'l3-demo-en-mgo', kind: 'numeric', objectiveIds: ['chem.atom.trends'], category: 'transfer', difficulty: 2,
      prompt: 'Pauling electronegativities: Mg = 1.31, O = 3.44. Find ΔEN for a Mg–O pair. (Number only.)',
      answer: { value: 2.13, absTol: 0.02 },
      misconceptions: [
        { id: 'sum', value: 4.75, feedback: 'ΔEN is the difference, not the sum.' },
      ],
      hints: ['Subtract the smaller value from the larger.'],
      solution: '3.44 − 1.31 = 2.13. (In the next lesson: well above 1.7, and a metal with a nonmetal, so MgO is ionic.)',
    },
    {
      id: 'l3-demo-find-element', kind: 'numeric', objectiveIds: ['chem.atom.valence', 'chem.atom.trends'], category: 'transfer', difficulty: 3,
      prompt: 'An element in period 4 has seven valence electrons. What is its atomic number? (Number only.)',
      answer: { value: 35, absTol: 0.1 },
      misconceptions: [
        { id: 'chlorine', value: 17, feedback: 'Chlorine has seven valence electrons but is in period 3. Period 4 has 18 elements; go one row down.' },
        { id: 'seven', value: 7, feedback: '7 is the valence count, not Z. Seven valence electrons means group 17; find that column in period 4.' },
        { id: 'krypton', value: 36, feedback: 'Krypton (Z = 36) has eight valence electrons. One to the left is bromine.' },
      ],
      hints: ['Seven valence electrons → group 17 (the halogens).', 'Period 4 runs from K (19) to Kr (36).'],
      solution: 'Group 17, period 4 is bromine, Z = 35 ([Ar] 3d¹⁰ 4s² 4p⁵).',
    },
    {
      id: 'l3-demo-sulfur-ion', kind: 'short-text', objectiveIds: ['chem.atom.valence'], category: 'application', difficulty: 2,
      prompt: 'Sulfur is a nonmetal in group 16. What charge does the sulfide ion carry? Write it like "2+" or "1-".',
      accepted: ['2-', '-2', 'S2-', 'S 2-', 'S^2-', 'S^{2-}', 'minus 2', '2 minus'],
      misconceptions: [
        { id: 'positive', accepted: ['2+', '+2', 'S2+'], feedback: 'Nonmetals GAIN electrons to complete the shell. Six valence electrons + two gained = 8, giving a 2− ion.' },
        { id: 'six-plus', accepted: ['6+', '+6', 'S6+'], feedback: 'Losing six electrons is far harder than gaining two. Sulfur gains 2: S²⁻.' },
        { id: 'one-minus', accepted: ['1-', '-1', 'S-'], feedback: 'Group 16 has six valence electrons and needs two more for an octet: 2−.' },
      ],
      hints: ['Group 16 → 6 valence electrons.', 'How many more electrons complete the octet?'],
      solution: 'Sulfur is [Ne] 3s² 3p⁴, two short of an octet; gaining two gives S²⁻ with the argon configuration.',
      placeholder: 'e.g. 1-',
    },
  ],
};
