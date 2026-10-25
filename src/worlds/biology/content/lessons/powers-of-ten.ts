import type { LessonSpec } from '@/core/world/spec';

/**
 * Lesson 1 — Powers of ten: the scale of life.
 * Reference values (typical sizes from model/scale.ts):
 *   human 1.7 m; hand 0.18 m; ant 3 mm; egg cell 100 µm; cheek cell 55 µm; red blood cell 7.5 µm;
 *   E. coli 2 µm; mitochondrion 1.5 µm; influenza 100 nm; ribosome 25 nm; DNA width 2 nm;
 *   glucose 1 nm; water 0.3 nm; hydrogen atom 0.1 nm.
 *   human / red blood cell = 1.7 / 7.5e-6 = 2.27e5;  log10(hand / E. coli) = log10(9e4) = 4.95 ≈ 5
 *   ant / pollen grain (30 µm) = 100;  cheek cell / influenza = 550;  DNA width / hydrogen = 20
 * Rule of thumb (labelled as such): naked eye ≳ 0.1 mm; light microscope ≳ 200 nm; electron microscope below.
 */
export const powersOfTen: LessonSpec = {
  id: 'cell.powers-of-ten',
  worldId: 'cell',
  title: 'Powers of ten',
  subtitle: 'From a person to an atom in ten steps',
  minutes: 40,
  objectiveIds: ['bio.scale.powers-of-ten', 'bio.scale.microscopy'],
  prerequisiteObjectiveIds: ['math.alg.powers-roots', 'bio.cell.basics'],
  standardRefs: [],
  accessibilitySummary:
    'The scale explorer shows objects drawn at their true size relative to a field of view that you zoom with a slider from 3 metres down to 0.1 nanometres. A readout lists the field of view, each visible object with its typical size, the ratio between a selected object and a reference object, and which observing tool (naked eye, light microscope, electron microscope) could resolve the selected object.',
  validationTests: ['scale.test.ts: human / red blood cell ≈ 2.3e5', 'scale.test.ts: SI formatting', 'scale.test.ts: microscope rule of thumb'],
  mastery: [
    { objectiveId: 'bio.scale.powers-of-ten', level: 'mastered' },
    { objectiveId: 'bio.scale.microscopy', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'How small is a cell?',
      presets: ['scale:human'],
      blocks: [
        { type: 'text', md: 'You are made of trillions of cells, but you have never seen one with your bare eyes. How much smaller than you is a single cell? Most people guess far too big.' },
        {
          type: 'prediction',
          id: 'pred-rbc-ratio',
          question: 'A red blood cell is about 7.5 µm across. Roughly how many red blood cells, laid side by side, would stretch the height of an adult (1.7 m)?',
          options: [
            { id: 'thousand', text: 'About a thousand (10³)' },
            { id: 'hundred-thousand', text: 'About two hundred thousand (2 × 10⁵)' },
            { id: 'billion', text: 'About a billion (10⁹)' },
          ],
          correctId: 'hundred-thousand',
          revealPreset: 'scale:cell',
          explanation: '1.7 m ÷ 7.5 × 10⁻⁶ m ≈ 2.3 × 10⁵. The explorer has zoomed from the human scale to the cell scale: the field of view shrank by more than four powers of ten and the person vanished long ago.',
        },
        {
          type: 'prediction',
          id: 'pred-virus-tool',
          question: 'A school light microscope can show you bacteria. Can it show you a flu virus (about 100 nm)?',
          options: [
            { id: 'yes', text: 'Yes, with the highest-power lens' },
            { id: 'no', text: 'No: it is below what visible light can resolve' },
          ],
          correctId: 'no',
          revealPreset: 'scale:virus',
          explanation: 'Visible light has wavelengths of roughly 400–700 nm, so a light microscope cannot separate details much finer than about 200 nm (rule of thumb). A 100 nm virus needs an electron microscope. The readout now says so.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Zoom',
      presets: ['scale:free', 'scale:cell'],
      blocks: [
        {
          type: 'sim-task',
          preset: 'scale:human',
          instructions: 'Drag the **field of view** slider slowly from 3 m down to 0.1 nm. Each step of 1 on the slider is one power of ten. Watch the scale bar and the list of visible objects.',
          observe: [
            'How many powers of ten you pass between the person and the first cell that appears',
            'Which object is the last one you could see with the naked eye (rule of thumb: about 0.1 mm)',
            'The field of view at which the readout switches from "light microscope" to "electron microscope"',
            'How wide the DNA double helix is compared with a water molecule',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Simplifications: every object is drawn with one **typical size** (real cells, organisms and even atoms vary; the ranges are shown in the readout). Shapes are schematic. The microscope thresholds are rules of thumb, not instrument specifications: a good light microscope resolves a little better than 200 nm, and the naked eye limit depends on the person and the lighting.' },
        { type: 'text', md: 'Now pick a **selected object** and a **reference object** in the readout. Try red blood cell vs E. coli, then mitochondrion vs E. coli. Which pair surprised you?' },
      ],
    },
    {
      kind: 'understand',
      title: 'Orders of magnitude',
      presets: ['scale:cell'],
      blocks: [
        { type: 'text', md: 'Biology spans at least ten powers of ten in length, from a 1.7 m person to a 0.1 nm hydrogen atom. The only comfortable way to compare such sizes is with **ratios** and **powers of ten**.' },
        { type: 'equation', latex: '\\text{ratio} = \\frac{\\text{size}_A}{\\text{size}_B}, \\qquad \\text{orders of magnitude} = \\log_{10}\\left(\\frac{\\text{size}_A}{\\text{size}_B}\\right)', caption: 'A ratio of 1000 is three orders of magnitude; a ratio of 2.3 × 10⁵ is about 5.4 orders of magnitude.' },
        { type: 'text', md: 'SI prefixes are powers of ten in disguise. Convert everything to metres before dividing:' },
        { type: 'equation', latex: '1\\ \\text{mm} = 10^{-3}\\ \\text{m}, \\quad 1\\ \\text{µm} = 10^{-6}\\ \\text{m}, \\quad 1\\ \\text{nm} = 10^{-9}\\ \\text{m}', caption: 'Each prefix step is a factor of 1000. The most common slip is treating µm and mm as the same.' },
        { type: 'text', md: 'Typical landmarks (order-of-magnitude values, not exact): cells ~10 µm (1 to 100 µm), bacteria ~1 µm, viruses ~100 nm, proteins and ribosomes ~10 nm, small molecules ~1 nm, atoms ~0.1 nm.' },
        { type: 'callout', tone: 'note', md: '**Which tool sees what (rule of thumb).** Naked eye: features down to about 0.1 mm (a human egg cell is just visible). Light microscope: down to about 200 nm, limited by the wavelength of visible light, so cells, nuclei, bacteria and mitochondria are visible but viruses and ribosomes are not. Electron microscope: below 200 nm, down to the size of large molecules.' },
        { type: 'summary', points: ['Compare sizes by dividing, after converting to metres.', 'Orders of magnitude = log₁₀ of the ratio; each SI prefix step is 10³.', 'Naked eye ≳ 0.1 mm; light microscope ≳ 200 nm; electron microscope below (rule of thumb).'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['scale:cell'],
      blocks: [
        { type: 'text', md: 'Use the typical sizes from the explorer. Enter lengths in metres (for example `7.5e-6`) or as bare numbers for ratios.' },
        { type: 'problem', problemId: 'l1-ratio-human-rbc' },
        { type: 'problem', problemId: 'l1-si-prefix' },
        { type: 'problem', problemId: 'l1-orders-hand-ecoli' },
        { type: 'problem', problemId: 'l1-which-tool' },
        { type: 'problem', problemId: 'l1-prefix-error' },
        { type: 'problem', problemId: 'l1-scale-bar' },
      ],
    },
    {
      kind: 'apply',
      title: 'Apply',
      presets: ['scale:free'],
      blocks: [
        { type: 'text', md: 'Nothing here is in the explorer’s list. Decide for yourself how to compare.' },
        { type: 'problem', problemId: 'l1-pollen-ant' },
        { type: 'problem', problemId: 'l1-explain-light-limit' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'The explorer is hidden. Solve without hints for full mastery credit.' },
        { type: 'problem', problemId: 'l1-demo-dna-hydrogen' },
        { type: 'problem', problemId: 'l1-demo-image-tool' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Convert to metres, then divide: ratios and log₁₀ make huge ranges manageable.', 'Cells ~10 µm, bacteria ~1 µm, viruses ~100 nm, molecules ~1 nm, atoms ~0.1 nm (typical).', 'Rule of thumb: naked eye ≳ 0.1 mm, light microscope ≳ 200 nm, electron microscope below.'] },
        { type: 'text', md: 'If the prefix conversions felt shaky, revisit **Powers, roots and scientific notation** before the next lesson, where sequences replace sizes.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l1-ratio-human-rbc', kind: 'numeric', objectiveIds: ['bio.scale.powers-of-ten'], category: 'computation', difficulty: 1,
      prompt: 'An adult is 1.7 m tall and a red blood cell is 7.5 µm across. How many times taller is the person than the cell? Enter a number.',
      answer: { value: 1.7 / 7.5e-6, relTol: 0.03 },
      misconceptions: [
        { id: 'um-as-mm', value: 1.7 / 7.5e-3, feedback: 'You treated 7.5 µm as 7.5 mm. A micrometre is 10⁻⁶ m, a thousand times smaller than a millimetre.' },
        { id: 'inverted', value: 7.5e-6 / 1.7, feedback: 'You divided the small size by the large one. "How many times taller" means person ÷ cell.' },
      ],
      hints: ['Convert 7.5 µm to metres first: 7.5 × 10⁻⁶ m.', 'Divide 1.7 by 7.5 × 10⁻⁶.'],
      solution: '1.7 m ÷ (7.5 × 10⁻⁶ m) = 2.27 × 10⁵ ≈ 230,000 red blood cells end to end.',
    },
    {
      id: 'l1-si-prefix', kind: 'short-text', objectiveIds: ['bio.scale.powers-of-ten'], category: 'procedural', difficulty: 1,
      prompt: 'Write 0.0000075 m using the most suitable SI prefix (number and unit, e.g. `3 mm`).',
      accepted: ['7.5 µm', '7.5 um', '7.5 μm', '7.5 micrometres', '7.5 micrometers', '7.5 microns', '7.5µm', '7.5um'],
      placeholder: 'e.g. 3 mm',
      misconceptions: [
        { id: 'mm', accepted: ['7.5 mm', '7.5mm', '7.5 millimetres', '7.5 millimeters'], feedback: '7.5 mm would be 0.0075 m. Count the zeros again: 0.0000075 m = 7.5 × 10⁻⁶ m, and 10⁻⁶ is micro.' },
        { id: 'nm', accepted: ['7.5 nm', '7.5nm', '7500 nm', '7500nm'], feedback: 'Nanometres are 10⁻⁹ m. 0.0000075 m is 7.5 × 10⁻⁶ m, which is micrometres (7500 nm is numerically right but not the most suitable prefix).' },
      ],
      hints: ['Write the number in scientific notation first.', '10⁻⁶ corresponds to the prefix micro (µ).'],
      solution: '0.0000075 m = 7.5 × 10⁻⁶ m = 7.5 µm, the size of a red blood cell.',
    },
    {
      id: 'l1-orders-hand-ecoli', kind: 'numeric', objectiveIds: ['bio.scale.powers-of-ten'], category: 'computation', difficulty: 2,
      prompt: 'A hand is about 0.18 m long; an E. coli cell is about 2 µm long. How many orders of magnitude separate them? Round to the nearest whole number.',
      answer: { value: 5, absTol: 0.5 },
      misconceptions: [
        { id: 'ratio-not-log', value: 9e4, feedback: 'That is the ratio itself (9 × 10⁴). Orders of magnitude means the power of ten: log₁₀(9 × 10⁴) ≈ 4.95, so about 5.' },
        { id: 'um-as-mm', value: 2, relTol: 0.1, feedback: 'If you got about 2, you probably treated 2 µm as 2 mm. A micrometre is 10⁻⁶ m.' },
      ],
      hints: ['Compute the ratio 0.18 / (2 × 10⁻⁶).', 'Take log₁₀ of the ratio, or count how many factors of 10 fit.'],
      solution: '0.18 / (2 × 10⁻⁶) = 9 × 10⁴. log₁₀(9 × 10⁴) = 4.95 ≈ 5 orders of magnitude.',
    },
    {
      id: 'l1-which-tool', kind: 'multiple-choice', objectiveIds: ['bio.scale.microscopy'], category: 'conceptual', difficulty: 1,
      prompt: 'Using the rule of thumb (naked eye ≳ 0.1 mm, light microscope ≳ 200 nm), which tool is the simplest that can show a mitochondrion (about 1.5 µm long)?',
      options: [
        { id: 'eye', text: 'The naked eye', feedback: '1.5 µm is 0.0015 mm, far below the 0.1 mm naked-eye limit.' },
        { id: 'light', text: 'A light microscope', feedback: 'Correct: 1.5 µm = 1500 nm is above the ~200 nm light-microscope limit, so mitochondria are visible (though small) in a light microscope.' },
        { id: 'electron', text: 'Only an electron microscope', feedback: 'An electron microscope shows far more detail, but it is not required: 1500 nm is well above the 200 nm light limit.' },
      ],
      correctId: 'light',
      hints: ['Convert 1.5 µm to nanometres and compare with 200 nm.'],
      solution: '1.5 µm = 1500 nm > 200 nm, so a light microscope suffices; it is far below 0.1 mm = 100 µm, so the naked eye cannot.',
    },
    {
      id: 'l1-prefix-error', kind: 'multiple-choice', objectiveIds: ['bio.scale.powers-of-ten'], category: 'error-identification', difficulty: 2,
      prompt: 'A student writes: "A cheek cell is 55 µm and a flu virus is 100 nm. Since 100 is bigger than 55, the virus is about twice the size of the cell." Where is the mistake?',
      options: [
        { id: 'none', text: 'There is no mistake.', feedback: 'Compare the prefixes: µm and nm are different powers of ten.' },
        { id: 'prefix', text: 'The numbers have different prefixes. 55 µm = 55,000 nm, so the cell is about 550 times larger than the virus.', feedback: 'Correct. Always convert to the same unit before comparing.' },
        { id: 'round', text: 'The student should have rounded 55 to 60 first.', feedback: 'Rounding does not change the direction of the comparison; the prefixes do.' },
      ],
      correctId: 'prefix',
      hints: ['Write both sizes in nanometres.'],
      solution: '55 µm = 55 × 10⁻⁶ m = 55,000 nm. 55,000 / 100 = 550: the cell is about 550 times wider than the virus.',
    },
    {
      id: 'l1-scale-bar', kind: 'numeric', objectiveIds: ['bio.scale.powers-of-ten'], category: 'multi-step', difficulty: 3,
      prompt: 'In a micrograph the scale bar labelled 10 µm is 80 pixels long. A cell in the same image is 60 pixels across. What is the real size of the cell, in metres?',
      answer: { value: 7.5e-6, unit: 'm', relTol: 0.02 },
      misconceptions: [
        { id: 'pixel-fraction', value: 0.75, feedback: '60/80 = 0.75 is the fraction of the scale bar, not a length. Multiply by the bar’s real length, 10 µm.' },
        { id: 'inverted', value: 1.333e-5, feedback: 'You divided the other way (80/60). The cell is shorter than the bar, so it must be smaller than 10 µm.' },
      ],
      hints: ['Work out how many metres one pixel represents: 10 µm / 80 px.', 'Multiply by 60 px, then express in metres (1 µm = 10⁻⁶ m).'],
      solution: '10 µm / 80 px = 0.125 µm per px. 60 px × 0.125 µm/px = 7.5 µm = 7.5 × 10⁻⁶ m: the size of a red blood cell.',
    },
    {
      id: 'l1-pollen-ant', kind: 'numeric', objectiveIds: ['bio.scale.powers-of-ten'], category: 'transfer', difficulty: 3,
      prompt: 'A grain of pollen is about 30 µm across. An ant is about 3 mm long. How many pollen grains, laid in a row, would equal the ant’s length? Enter a number.',
      answer: { value: 100, relTol: 0.02 },
      misconceptions: [
        { id: 'inverted', value: 0.01, feedback: 'You divided the pollen size by the ant size. "How many grains make an ant" means ant ÷ pollen.' },
        { id: 'um-as-mm', value: 0.1, feedback: 'You treated 30 µm as 30 mm. A micrometre is 10⁻³ of a millimetre.' },
      ],
      hints: ['Put both lengths in the same unit: 3 mm = 3000 µm.', 'Divide 3000 µm by 30 µm.'],
      solution: '3 mm = 3 × 10⁻³ m; 30 µm = 3 × 10⁻⁵ m. Ratio = 3 × 10⁻³ / 3 × 10⁻⁵ = 100 grains.',
    },
    {
      id: 'l1-explain-light-limit', kind: 'written', objectiveIds: ['bio.scale.microscopy'], category: 'explanation', difficulty: 3,
      prompt: 'A classmate says: "If we just add a stronger lens, a light microscope could show a virus." Explain, using the rule of thumb for resolution, why that does not work and what tool is needed.',
      modelAnswer: 'Magnifying more does not add detail: a light microscope cannot separate two points closer together than roughly half the wavelength of visible light, about 200 nm (rule of thumb). A flu virus is about 100 nm, below that limit, so a stronger lens just produces a bigger blur. An electron microscope uses electrons with far shorter wavelengths and can resolve details well below 200 nm, so it is the tool for viruses, ribosomes and large molecules.',
      rubric: ['Distinguishes magnification from resolution', 'States the ~200 nm rule-of-thumb limit and links it to the wavelength of visible light', 'Compares the virus size (~100 nm) with the limit', 'Names the electron microscope as the appropriate tool'],
      hints: ['Think about the difference between making an image bigger and adding new detail to it.'],
      solution: 'See model answer.',
    },
    {
      id: 'l1-demo-dna-hydrogen', kind: 'numeric', objectiveIds: ['bio.scale.powers-of-ten'], category: 'application', difficulty: 3,
      prompt: 'The DNA double helix is about 2 nm wide. A hydrogen atom is about 0.1 nm across. How many hydrogen atoms would span the width of the helix? Enter a number.',
      answer: { value: 20, relTol: 0.02 },
      misconceptions: [
        { id: 'inverted', value: 0.05, feedback: 'You divided atom by helix. The helix is wider, so the answer must be greater than 1.' },
        { id: 'subtracted', value: 1.9, feedback: 'You subtracted the sizes. "How many atoms span the width" is a ratio: 2 ÷ 0.1.' },
      ],
      hints: ['Both sizes are already in nanometres, so divide directly.'],
      solution: '2 nm / 0.1 nm = 20 hydrogen atoms across.',
    },
    {
      id: 'l1-demo-image-tool', kind: 'multiple-choice', objectiveIds: ['bio.scale.microscopy'], category: 'transfer', difficulty: 3,
      prompt: 'A published image shows a structure labelled "150 nm across" in clear detail. By the rule of thumb, which instrument must have produced it?',
      options: [
        { id: 'eye', text: 'A camera with no microscope', feedback: '150 nm is several hundred times smaller than the ~0.1 mm (100,000 nm) naked-eye limit.' },
        { id: 'light', text: 'A standard light microscope', feedback: '150 nm is below the ~200 nm light-microscope limit; the structure would be a blur.' },
        { id: 'electron', text: 'An electron microscope', feedback: 'Correct: resolving 150 nm detail is below the light limit (~200 nm), so electrons were needed.' },
      ],
      correctId: 'electron',
      hints: ['Compare 150 nm with the two thresholds: 0.1 mm (100,000 nm) and 200 nm.'],
      solution: '150 nm < 200 nm, so a light microscope cannot resolve it; an electron microscope can.',
    },
  ],
};
