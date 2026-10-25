import type { LessonSpec } from '@/core/world/spec';
import { configurationAnswers } from './helpers';

/**
 * Lesson 2 — Where electrons live.
 * Reference values (from model/configuration.ts):
 *   O: 1s2 2s2 2p4 ([He] 2s2 2p4);  Cl: [Ne] 3s2 3p5;  Fe: [Ar] 3d6 4s2;  Cr: [Ar] 3d5 4s1 (exception)
 *   Na⁺: 1s2 2s2 2p6 = [Ne];  Br: [Ar] 3d10 4s2 4p5;  Ca: [Ar] 4s2
 *   Shell capacities 2n²: n = 1 → 2, n = 2 → 8, n = 3 → 18;  Na shells [2, 8, 1];  K shells [2, 8, 8, 1]
 *   Si outer shell: 4 electrons (period 3, group 14)
 */
export const whereElectronsLive: LessonSpec = {
  id: 'chemistry.where-electrons-live',
  worldId: 'atoms-molecules',
  title: 'Where electrons live',
  subtitle: 'Shells, subshells and why the periodic table has its shape',
  minutes: 50,
  objectiveIds: ['chem.atom.shells', 'chem.atom.configuration', 'chem.atom.table-position'],
  prerequisiteObjectiveIds: ['chem.atom.identity', 'chem.atom.ions'],
  standardRefs: [],
  accessibilitySummary:
    'The atom builder draws electrons as dots on concentric rings (shells) and lists the electron configuration in full and noble-gas notation. The periodic table panel highlights the s, p, d and f blocks and shows the configuration of any element you select.',
  validationTests: ['chemistry.test.ts: total electrons = Z for all 118 elements', 'chemistry.test.ts: matches known ground-state configurations', 'chemistry.test.ts: gives Bohr shells', 'chemistry.test.ts: handles ions'],
  mastery: [
    { objectiveId: 'chem.atom.configuration', level: 'mastered' },
    { objectiveId: 'chem.atom.shells', level: 'proficient' },
    { objectiveId: 'chem.atom.table-position', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'Eleven electrons, how many rings?',
      presets: ['atom:carbon-12'],
      blocks: [
        { type: 'text', md: 'Electrons are not scattered randomly around the nucleus. They fill **shells**, and each shell has a limited capacity. Carbon’s six electrons sit as 2 + 4. What about bigger atoms?' },
        {
          type: 'prediction',
          id: 'pred-sodium-shells',
          question: 'Sodium has 11 electrons. How will the builder arrange them?',
          options: [
            { id: 'one-ring', text: 'All 11 in one big ring' },
            { id: '2-8-1', text: '2 in the first shell, 8 in the second, 1 in the third' },
            { id: '2-9', text: '2 in the first shell and 9 in the second' },
          ],
          correctId: '2-8-1',
          revealPreset: 'atom:sodium',
          explanation: 'The first shell holds at most 2, the second at most 8. The eleventh electron must start a third shell, alone. That lonely outer electron is why sodium is so reactive.',
        },
        {
          type: 'prediction',
          id: 'pred-potassium-shells',
          question: 'Potassium has 19 electrons. The third shell can hold up to 18. Where does electron number 19 go?',
          options: [
            { id: '2-8-9', text: 'Into the third shell: 2, 8, 9' },
            { id: '2-8-8-1', text: 'Into a fourth shell: 2, 8, 8, 1' },
            { id: '2-8-8-1-neg', text: 'It cannot be placed; potassium must be an ion' },
          ],
          correctId: '2-8-8-1',
          revealPreset: 'atom:potassium',
          explanation: 'Surprise: the 4s subshell fills before 3d, so after 8 electrons in shell 3 the next one starts shell 4. Shells have sub-levels, and their energies overlap. This is exactly why potassium sits under sodium in the table.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Fill the shells',
      presets: ['atom:hydrogen-1', 'table:blocks'],
      blocks: [
        {
          type: 'sim-task',
          preset: 'atom:hydrogen-1',
          instructions: 'Add protons and electrons together, one at a time, from hydrogen up to argon (18). Watch the shell diagram and the configuration line under it.',
          observe: [
            'At which electron numbers a new ring starts (2, 10, 18)',
            'How the configuration text grows: 1s, then 2s and 2p, then 3s and 3p',
            'That the noble-gas notation collapses the full inner shells into a symbol like [Ne]',
          ],
        },
        {
          type: 'sim-task',
          preset: 'table:blocks',
          instructions: 'In the periodic table, click sodium, potassium and rubidium (group 1), then fluorine, chlorine and bromine (group 17). Read the noble-gas configuration shown for each.',
          observe: [
            'Elements in the same column end with the same pattern (ns1 for group 1; ns2 np5 for group 17)',
            'The period number equals the highest shell number in the configuration',
            'Which block (s, p, d, f) each element is in, and which subshell is being filled there',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Idealisations: the ring diagram counts electrons per shell; real electrons are spread in orbitals of different shapes (s spherical, p dumbbell-shaped). The filling order shown is the Aufbau rule; about twenty elements (such as chromium, copper, silver and gold) are known exceptions, and the table marks them.' },
      ],
    },
    {
      kind: 'understand',
      title: 'Shells, subshells, and the filling order',
      presets: ['atom:sodium'],
      blocks: [
        { type: 'text', md: 'Shell $n$ can hold at most' },
        { type: 'equation', latex: 'N_{\\max} = 2n^2', caption: 'n = 1 → 2 electrons; n = 2 → 8; n = 3 → 18; n = 4 → 32.' },
        { type: 'text', md: 'Each shell is divided into **subshells**: $s$ (2 electrons), $p$ (6), $d$ (10), $f$ (14). Shell 1 has only 1s; shell 2 has 2s and 2p; shell 3 has 3s, 3p, 3d; and so on.' },
        { type: 'text', md: 'Three rules build a configuration. **Aufbau**: fill the lowest-energy subshell first. **Pauli**: at most two electrons per orbital. **Hund**: within a subshell, spread electrons over the orbitals singly before pairing.' },
        { type: 'equation', latex: '1s\\;2s\\;2p\\;3s\\;3p\\;4s\\;3d\\;4p\\;5s\\;4d\\;5p\\;6s\\;4f\\;5d\\;6p\\;7s\\;5f\\;6d\\;7p', caption: 'Filling (Aufbau) order. Note 4s before 3d: that is why potassium is 2, 8, 8, 1.' },
        { type: 'text', md: 'Sodium: $1s^2\\,2s^2\\,2p^6\\,3s^1$. The first ten electrons are exactly neon’s, so we abbreviate: **[Ne] 3s¹**. Iron: [Ar] 3d⁶ 4s² (we usually write the subshells in shell order, 3d before 4s, even though 4s filled first; both orders are accepted here).' },
        { type: 'callout', tone: 'warning', md: 'Exceptions: chromium is [Ar] 3d⁵ 4s¹ and copper is [Ar] 3d¹⁰ 4s¹, not 3d⁴ 4s² and 3d⁹ 4s². A half-filled or filled d subshell is slightly lower in energy. The same happens for Mo, Ag, Au and others; the table lists them.' },
        { type: 'text', md: 'Reading the table from a configuration: the **period** is the highest shell number; the **block** is the subshell being filled (s, p, d or f); for main-group elements the **group** follows from the outer-shell count (ns¹ → group 1, ns² np⁵ → group 17).' },
        { type: 'text', md: 'Ions: a cation has lost its outermost electrons. Na⁺ is 1s² 2s² 2p⁶, the same as neon. Cl⁻ gains one electron to become [Ne] 3s² 3p⁶, the same as argon.' },
        { type: 'summary', points: ['Shell n holds 2n² electrons in s, p, d, f subshells of 2, 6, 10, 14.', 'Fill in Aufbau order (4s before 3d); noble-gas notation hides the full core.', 'Period = highest shell; block = subshell being filled; same column ⇒ same outer pattern.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['table:blocks'],
      blocks: [
        { type: 'text', md: 'Write configurations as text like `1s2 2s2 2p4` or `[He] 2s2 2p4` (carets such as `2p^4` are fine).' },
        { type: 'problem', problemId: 'l2-shell-capacity' },
        { type: 'problem', problemId: 'l2-config-o' },
        { type: 'problem', problemId: 'l2-config-cl-noble' },
        { type: 'problem', problemId: 'l2-config-fe' },
        { type: 'problem', problemId: 'l2-error-cr' },
        { type: 'problem', problemId: 'l2-position' },
      ],
    },
    {
      kind: 'apply',
      title: 'Read the table backwards',
      presets: ['table:blocks'],
      blocks: [
        { type: 'text', md: 'Now go from configuration to element, and from atom to ion.' },
        { type: 'problem', problemId: 'l2-identify' },
        { type: 'problem', problemId: 'l2-ion-config' },
        { type: 'problem', problemId: 'l2-explain' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'Environment hidden. No table, no builder: build the configuration from the rules.' },
        { type: 'problem', problemId: 'l2-demo-br' },
        { type: 'problem', problemId: 'l2-demo-si-outer' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['2n² per shell; 2, 6, 10, 14 per s, p, d, f subshell.', 'Aufbau order with 4s before 3d; Cr and Cu are the classic exceptions.', 'Noble-gas notation; period, block and group read straight off the configuration.'] },
        { type: 'text', md: 'Next: the outer electrons explain the trends in size and electron-pulling power across the table.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l2-shell-capacity', kind: 'numeric', objectiveIds: ['chem.atom.shells'], category: 'computation', difficulty: 1,
      prompt: 'What is the maximum number of electrons the third shell (n = 3) can hold? (Number only.)',
      answer: { value: 18, absTol: 0.1 },
      misconceptions: [
        { id: 'octet', value: 8, feedback: '8 is how many electrons shell 3 holds in argon, but 3d adds 10 more: the full capacity is 2n² = 18.' },
        { id: 'two-n', value: 6, feedback: 'You may have used 2n. The capacity is 2n², so 2 × 9 = 18.' },
        { id: 'n-squared', value: 9, feedback: 'n² = 9 is the number of orbitals; each holds two electrons, so 18.' },
      ],
      hints: ['Use 2n².', 'Shell 3 contains 3s (2) + 3p (6) + 3d (10).'],
      solution: '2n² = 2 × 3² = 18, i.e. 3s² 3p⁶ 3d¹⁰.',
    },
    {
      id: 'l2-config-o', kind: 'short-text', objectiveIds: ['chem.atom.configuration'], category: 'procedural', difficulty: 1,
      prompt: 'Write the full electron configuration of oxygen (Z = 8).',
      accepted: configurationAnswers(8, 'any'),
      misconceptions: [
        { id: 'neon', accepted: ['1s2 2s2 2p6', '1s^2 2s^2 2p^6'], feedback: 'That is ten electrons (neon). Oxygen has only eight: 1s2 2s2 2p4.' },
        { id: 'skipped-2s', accepted: ['1s2 2p6', '1s^2 2p^6'], feedback: '2s fills before 2p. Two electrons go into 2s first, leaving four for 2p.' },
        { id: 'six-electrons', accepted: ['1s2 2s2 2p2', '1s^2 2s^2 2p^2'], feedback: 'That is carbon (6 electrons). Count to eight.' },
      ],
      hints: ['Oxygen has 8 electrons.', 'Fill 1s (2), then 2s (2), then put the rest in 2p.'],
      solution: '1s² 2s² 2p⁴ (= [He] 2s² 2p⁴). 2 + 2 + 4 = 8.',
      placeholder: 'e.g. 1s2 2s2 2p2',
    },
    {
      id: 'l2-config-cl-noble', kind: 'short-text', objectiveIds: ['chem.atom.configuration'], category: 'procedural', difficulty: 2,
      prompt: 'Write the electron configuration of chlorine (Z = 17) in noble-gas notation.',
      accepted: configurationAnswers(17, 'noble-gas'),
      misconceptions: [
        { id: 'wrong-core', accepted: ['[Ar] 3s2 3p5', '[Ar]3s2 3p5'], feedback: 'The core must be the noble gas BEFORE chlorine, which is neon. Argon comes after.' },
        { id: 'sulfur', accepted: ['[Ne] 3s2 3p4', '[Ne]3s2 3p4'], feedback: 'That is 16 electrons (sulfur). Chlorine has 17: 3p5.' },
        { id: 'full-not-noble', accepted: ['1s2 2s2 2p6 3s2 3p5'], feedback: 'Correct electrons, but the question asks for noble-gas notation: replace 1s2 2s2 2p6 with [Ne].' },
      ],
      hints: ['Which noble gas comes just before chlorine? Neon (10 electrons).', 'Chlorine has 17 − 10 = 7 more electrons, going into 3s and 3p.'],
      solution: '[Ne] 3s² 3p⁵.',
      placeholder: 'e.g. [Ne] 3s1',
    },
    {
      id: 'l2-config-fe', kind: 'short-text', objectiveIds: ['chem.atom.configuration'], category: 'multi-step', difficulty: 3,
      prompt: 'Write the electron configuration of iron (Z = 26) in noble-gas notation.',
      accepted: configurationAnswers(26, 'noble-gas'),
      misconceptions: [
        { id: 'skipped-4s', accepted: ['[Ar] 3d8', '[Ar]3d8'], feedback: '4s fills before 3d. Two electrons go into 4s, leaving six for 3d: [Ar] 3d6 4s2.' },
        { id: 'd-before-s-count', accepted: ['[Ar] 3d6', '[Ar]3d6'], feedback: 'That is only 24 electrons (and happens to be Fe²⁺). Neutral iron also has 4s2.' },
        { id: 'skipped-d', accepted: ['[Ar] 4s2 4p6', '[Ar]4s2 4p6'], feedback: 'After 4s the next subshell to fill is 3d, not 4p.'},
      ],
      hints: ['Argon accounts for 18 electrons; iron has 8 more.', 'Order after [Ar]: 4s (2 electrons), then 3d.', '4s2 takes two, so 3d gets 6.'],
      solution: '[Ar] 3d⁶ 4s² (written in shell order; [Ar] 4s² 3d⁶ in filling order is also accepted). 18 + 2 + 6 = 26.',
      placeholder: 'e.g. [Ar] 4s2',
    },
    {
      id: 'l2-error-cr', kind: 'multiple-choice', objectiveIds: ['chem.atom.configuration'], category: 'error-identification', difficulty: 3,
      prompt: 'A student writes the configuration of chromium (Z = 24) as [Ar] 3d⁴ 4s². The electron count is right. What is wrong?',
      options: [
        { id: 'a', text: 'Nothing: that is what the Aufbau order gives.', feedback: 'The Aufbau order does give 3d4 4s2, but chromium is a known exception to it.' },
        { id: 'b', text: 'Chromium is an exception: its ground state is [Ar] 3d⁵ 4s¹, with a half-filled d subshell.', feedback: 'Correct. A half-filled 3d is slightly more stable, so one 4s electron moves to 3d.' },
        { id: 'c', text: 'Chromium should be [Ar] 3d⁶, because 4s empties into 3d for all transition metals.', feedback: 'Only cations lose their 4s electrons. Neutral chromium keeps one 4s electron: 3d5 4s1.' },
      ],
      correctId: 'b',
      hints: ['Check the exceptions list in the periodic table panel.', 'What is special about five electrons in five d orbitals?'],
      solution: 'Cr is [Ar] 3d⁵ 4s¹ (exception). The same shift happens for Cu ([Ar] 3d¹⁰ 4s¹), Mo, Ag, Au and several others.',
    },
    {
      id: 'l2-position', kind: 'multiple-choice', objectiveIds: ['chem.atom.table-position'], category: 'conceptual', difficulty: 2,
      prompt: 'An element has the configuration [Ne] 3s² 3p³. Where is it in the periodic table?',
      options: [
        { id: 'a', text: 'Period 3, group 15 (p-block)', feedback: 'Correct: highest shell 3 → period 3; 5 outer electrons (s2 p3) → group 15. It is phosphorus.' },
        { id: 'b', text: 'Period 3, group 5', feedback: 'Groups 3–12 are the d-block. With 5 outer electrons in s and p, the element is in group 15.' },
        { id: 'c', text: 'Period 2, group 15', feedback: 'The highest occupied shell is 3, so the element is in period 3, not 2.' },
      ],
      correctId: 'a',
      hints: ['Period = highest shell number appearing.', 'Outer electrons 2 + 3 = 5; main-group number = 10 + outer electrons for the p-block.'],
      solution: 'Highest shell is 3 → period 3; 3s² 3p³ gives 5 valence electrons → group 15, the p-block. Element: phosphorus (Z = 15).',
    },
    {
      id: 'l2-identify', kind: 'short-text', objectiveIds: ['chem.atom.table-position'], category: 'application', difficulty: 2,
      prompt: 'Which element has the ground-state configuration [Ar] 4s²? Give the symbol or name.',
      accepted: ['Ca', 'calcium'],
      misconceptions: [
        { id: 'potassium', accepted: ['K', 'potassium'], feedback: 'Potassium is [Ar] 4s1: one electron beyond argon. Two electrons beyond argon is calcium.' },
        { id: 'argon', accepted: ['Ar', 'argon'], feedback: 'Argon is the core. The element has two MORE electrons than argon.' },
        { id: 'magnesium', accepted: ['Mg', 'magnesium'], feedback: 'Magnesium is [Ne] 3s2. The core here is argon, so look one period lower.' },
      ],
      hints: ['Argon has 18 electrons; add 2.', 'Z = 20.'],
      solution: '18 + 2 = 20 electrons → calcium (Ca), period 4, group 2.',
      placeholder: 'symbol or name',
    },
    {
      id: 'l2-ion-config', kind: 'short-text', objectiveIds: ['chem.atom.configuration'], category: 'transfer', difficulty: 3,
      prompt: 'Write the electron configuration of the sodium ion Na⁺ (full or noble-gas notation).',
      accepted: [...configurationAnswers(11, 'any', 1), '[Ne]'],
      misconceptions: [
        { id: 'neutral-atom', accepted: ['1s2 2s2 2p6 3s1', '[Ne] 3s1', '[Ne]3s1'], feedback: 'That is the neutral atom. Na⁺ has LOST one electron: remove the 3s1.' },
        { id: 'added-electron', accepted: ['1s2 2s2 2p6 3s2', '[Ne] 3s2', '[Ne]3s2'], feedback: 'A positive ion has fewer electrons, not more. Remove the outer electron instead.' },
      ],
      hints: ['Na⁺ has 11 − 1 = 10 electrons.', 'Remove the outermost electron (3s1) from sodium’s configuration.'],
      solution: '1s² 2s² 2p⁶, identical to neon ([Ne]).',
      placeholder: 'e.g. 1s2 2s2 2p6 3s1',
    },
    {
      id: 'l2-explain', kind: 'written', objectiveIds: ['chem.atom.table-position'], category: 'explanation', difficulty: 3,
      prompt: 'Sodium and potassium react with water in very similar ways. Using their electron configurations, explain why.',
      modelAnswer: 'Sodium is [Ne] 3s¹ and potassium is [Ar] 4s¹. Both have a single electron in an s subshell outside a noble-gas core. Chemical reactions involve the outermost (valence) electrons, so atoms with the same outer pattern behave alike: both readily lose that one electron to form a 1+ ion with a noble-gas configuration. That shared pattern is what puts them in the same column (group 1).',
      rubric: ['Gives both configurations ([Ne] 3s1 and [Ar] 4s1 or equivalent)', 'Identifies the single outer s electron as the common feature', 'Links chemical behaviour to the valence electrons and the 1+ ion'],
      hints: ['Write the noble-gas configuration of each. What is identical?'],
      solution: 'See model answer.',
    },
    {
      id: 'l2-demo-br', kind: 'short-text', objectiveIds: ['chem.atom.configuration', 'chem.atom.table-position'], category: 'transfer', difficulty: 4,
      prompt: 'Write the electron configuration of bromine (Z = 35) in noble-gas notation.',
      accepted: configurationAnswers(35, 'noble-gas'),
      misconceptions: [
        { id: 'skipped-3d', accepted: ['[Ar] 4s2 4p5', '[Ar]4s2 4p5'], feedback: 'That is only 25 electrons. After 4s comes 3d (10 electrons) before 4p.' },
        { id: 'kr-core', accepted: ['[Kr] 4s2 4p5', '[Kr]4s2 4p5'], feedback: 'Krypton comes AFTER bromine. The core is argon.' },
        { id: 'chlorine', accepted: ['[Ne] 3s2 3p5', '[Ne]3s2 3p5'], feedback: 'That is chlorine, one period up. Bromine is in period 4.' },
      ],
      hints: ['Argon core = 18; bromine has 17 more.', 'Order after [Ar]: 4s (2), 3d (10), 4p (5).'],
      solution: '[Ar] 3d¹⁰ 4s² 4p⁵. 18 + 2 + 10 + 5 = 35. Period 4, group 17.',
      placeholder: 'e.g. [Ar] 4s2',
    },
    {
      id: 'l2-demo-si-outer', kind: 'numeric', objectiveIds: ['chem.atom.configuration', 'chem.atom.table-position', 'chem.atom.shells'], category: 'application', difficulty: 2,
      prompt: 'Silicon (Z = 14) is in period 3, group 14. How many electrons are in its outermost shell? (Number only.)',
      answer: { value: 4, absTol: 0.1 },
      misconceptions: [
        { id: 'group-number', value: 14, feedback: '14 is the group number (and Z). For the p-block subtract 10: 14 − 10 = 4 outer electrons.' },
        { id: 'period', value: 3, feedback: '3 is the period: the shell NUMBER, not the number of electrons in it.' },
        { id: 'shell-capacity', value: 8, feedback: '8 would be a full s + p outer shell (a noble gas). Silicon has 3s2 3p2.' },
      ],
      hints: ['Configuration: [Ne] 3s2 3p2.', 'Count the electrons in shell 3.'],
      solution: '[Ne] 3s² 3p² → 2 + 2 = 4 electrons in shell 3. Group 14 ↔ 4 valence electrons.',
    },
  ],
};
