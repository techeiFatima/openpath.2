import type { Topic, Unit } from '@/core/curriculum/types';

/**
 * Planned unit → topic maps for every course in the catalog (Phase 4 scaffolding).
 *
 * Status: PLANNED. Nothing here is authored content; it is the skeleton that objectives,
 * lessons and assessments will be attached to. Units that an implemented world already
 * provides (see each world's curriculum.ts) are merged by the catalog; where a world
 * ships a unit with the same name as a planned one here, the planned one is dropped so
 * coverage reports count it once.
 *
 * Sources used as structural references (names paraphrased, nothing reproduced):
 * CCSS-M domains and clusters (K–12 mathematics), NGSS DCIs (K–12 science), MAA CUPM
 * guide (undergraduate mathematics), typical OpenStax table-of-contents structure for
 * university science, and CEFR level descriptions for language. Reuse terms for all of
 * these are documented in docs/03-resource-registry.md.
 */
type UnitMap = Record<string, [unit: string, topics: string[]][]>;

export const PLANNED_UNITS: UnitMap = {
  // ───────────── Mathematics ─────────────
  'math.prek.numbers': [
    ['Counting to 20', ['Counting objects one by one', 'Number names and numerals', 'Counting on and back']],
    ['How many? Comparing', ['More, fewer, the same', 'Matching groups', 'Ordering numbers']],
    ['Ten as a group', ['Ten frames', 'Teen numbers as ten and some more']],
  ],
  'math.prek.shapes': [
    ['Shapes around us', ['Circles, squares, triangles, rectangles', 'Solid shapes', 'Shapes in different positions']],
    ['Position and space', ['Above, below, beside, between', 'Left and right', 'Puzzles and composing shapes']],
    ['Patterns', ['Repeating patterns', 'Growing patterns', 'Sorting by attribute']],
  ],
  'math.prek.operations': [
    ['Joining and separating', ['Adding with objects', 'Taking away', 'Number bonds within 10']],
    ['Measuring', ['Longer and shorter', 'Heavier and lighter', 'Comparing capacity', 'Time of day']],
  ],
  'math.el.number': [
    ['Place value', ['Tens and ones', 'Hundreds', 'Thousands and beyond', 'Rounding']],
    ['Addition and subtraction', ['Strategies within 20', 'Multi-digit with regrouping', 'Word problems']],
    ['Multiplication and division', ['Equal groups and arrays', 'Facts to 10 × 10', 'Multi-digit multiplication', 'Division with remainders']],
    ['Factors and multiples', ['Factor pairs', 'Prime and composite', 'Multiples and patterns']],
    ['Number lines', ['Whole numbers on a line', 'Fractions on a line', 'Negative numbers introduced']],
  ],
  'math.el.fractions': [
    ['Understanding fractions', ['Unit fractions', 'Equivalent fractions', 'Comparing fractions']],
    ['Operating with fractions', ['Adding and subtracting like denominators', 'Unlike denominators', 'Multiplying fractions', 'Dividing unit fractions']],
    ['Decimals', ['Tenths and hundredths', 'Decimal place value', 'Adding and subtracting decimals', 'Fractions ↔ decimals']],
  ],
  'math.el.geometry': [
    ['Shapes and angles', ['Classifying polygons', 'Lines, rays, angles', 'Symmetry']],
    ['Measurement', ['Length, mass, volume units', 'Unit conversions', 'Time and money']],
    ['Area, perimeter, volume', ['Perimeter', 'Area of rectangles', 'Volume of prisms']],
  ],
  'math.el.data': [
    ['Data', ['Picture and bar graphs', 'Line plots', 'Reading tables']],
    ['Reasoning', ['Multi-step word problems', 'Estimation', 'Explaining a strategy']],
  ],
  'math.ms.ratios': [
    ['Ratios and rates', ['Ratio language', 'Unit rates', 'Ratio tables and double number lines']],
    ['Percent', ['Percent of a quantity', 'Percent change', 'Discounts, tax, interest']],
    ['Proportional relationships', ['Constant of proportionality', 'Graphs of proportional relationships', 'Scale drawings']],
  ],
  'math.ms.number': [
    ['Integers', ['Negative numbers on the line', 'Adding and subtracting integers', 'Multiplying and dividing integers']],
    ['Rational numbers', ['Fractions and decimals as rationals', 'Operations with rationals', 'Order and absolute value']],
    ['Exponents and roots', ['Integer exponents', 'Scientific notation', 'Square and cube roots', 'Irrational numbers']],
  ],
  'math.ms.algebra': [
    ['Expressions', ['Variables and expressions', 'Equivalent expressions', 'Distributive property']],
    ['Equations and inequalities', ['One-step and two-step equations', 'Multi-step equations', 'Inequalities on a line']],
    ['Functions', ['What a function is', 'Linear functions and rate of change', 'Comparing functions']],
    ['Systems', ['Solving graphically', 'Substitution and elimination']],
  ],
  'math.ms.geometry': [
    ['The Coordinate Plane', ['Plotting Points', 'Distance and midpoints']],
    ['Transformations', ['Translations, reflections, rotations', 'Dilations and similarity', 'Congruence']],
    ['Angles and triangles', ['Angle relationships', 'Triangle angle sum', 'Pythagorean theorem']],
    ['Area and volume', ['Area of polygons and circles', 'Surface area', 'Volume of cylinders, cones, spheres']],
  ],
  'math.ms.stats': [
    ['Statistics', ['Measures of centre', 'Measures of spread', 'Histograms and box plots', 'Sampling']],
    ['Probability', ['Simple probability', 'Compound events', 'Simulation']],
  ],
  'math.hs.algebra-1': [
    ['Equations and Formulas', ['Literal Equations', 'Linear equations and inequalities', 'Absolute value']],
    ['Linear Functions', ['Slope and Linear Equations', 'Forms of linear equations', 'Systems of linear equations']],
    ['Exponents and Radicals', ['Powers and Roots', 'Exponential growth and decay']],
    ['Polynomials and factoring', ['Operations on polynomials', 'Factoring', 'Solving quadratics by factoring']],
    ['Data and modelling', ['Scatter plots and lines of fit', 'Residuals', 'Piecewise functions']],
  ],
  'math.hs.geometry': [
    ['Foundations and constructions', ['Points, lines, planes', 'Compass and straightedge constructions', 'Logic and conjecture']],
    ['Proof', ['Two-column and paragraph proofs', 'Triangle congruence proofs', 'Parallel lines proofs']],
    ['Similarity and trigonometry', ['Similar triangles', 'Right-triangle trigonometry', 'Laws of sines and cosines']],
    ['Circles', ['Arcs, chords, tangents', 'Inscribed angles', 'Equations of circles']],
    ['Measurement in 2D and 3D', ['Area and volume formulas', 'Cavalieri’s principle', 'Density problems']],
  ],
  'math.hs.algebra-2': [
    ['Quadratic Functions and Transformations', ['Standard, Vertex and Factored Forms', 'Graph Transformations', 'Complex solutions']],
    ['Polynomial functions', ['End behaviour and zeros', 'Polynomial division', 'Graphing polynomials']],
    ['Rational and radical functions', ['Rational expressions', 'Asymptotes', 'Radical equations']],
    ['Exponential and logarithmic functions', ['Exponential models', 'Logarithms and their properties', 'Solving exponential equations']],
    ['Sequences and series', ['Arithmetic and geometric sequences', 'Series and sigma notation']],
  ],
  'math.hs.trig-precalc': [
    ['Trigonometric functions', ['The unit circle', 'Graphs of sine and cosine', 'Identities']],
    ['Complex numbers', ['Arithmetic and the complex plane', 'Polar form', 'Roots of unity']],
    ['Vectors and matrices', ['Vectors in the plane', 'Matrix operations', 'Transformations with matrices']],
    ['Functions in depth', ['Composition and inverses', 'Parametric equations', 'Polar coordinates']],
  ],
  'math.hs.stats': [
    ['Describing data', ['Distributions', 'Normal distribution', 'Standard deviation']],
    ['Probability', ['Conditional probability', 'Independence', 'Expected value']],
    ['Inference', ['Sampling distributions', 'Confidence intervals', 'Significance tests']],
    ['Modelling', ['Linear and exponential models', 'Residual analysis', 'Simulation']],
  ],
  'math.hs.calculus': [
    ['Limits and Derivatives', ['Limits', 'Rates of Change and Tangent Lines', 'The Derivative and Basic Rules', 'Product, quotient and chain rules']],
    ['Applications of derivatives', ['Extrema and curve sketching', 'Optimisation', 'Related rates']],
    ['Accumulation and Integrals', ['Riemann Sums and the Definite Integral', 'Antiderivatives and substitution', 'Area and volume applications']],
  ],
  'math.uni.calc-1': [
    ['Limits and continuity', ['Formal definition of a limit', 'Continuity', 'Intermediate value theorem']],
    ['Differentiation', ['Rules and implicit differentiation', 'Mean value theorem', 'L’Hôpital’s rule']],
    ['Integration', ['Fundamental theorem', 'Techniques of integration', 'Improper integrals']],
    ['Sequences and series', ['Convergence tests', 'Power series', 'Taylor series']],
  ],
  'math.uni.calc-3': [
    ['Vectors and space', ['Dot and cross products', 'Lines and planes', 'Vector-valued functions']],
    ['Partial derivatives', ['Limits in several variables', 'Gradient and directional derivatives', 'Optimisation and Lagrange multipliers']],
    ['Multiple integrals', ['Double and triple integrals', 'Change of variables', 'Applications']],
    ['Vector calculus', ['Line and surface integrals', 'Green, Stokes and divergence theorems']],
  ],
  'math.uni.linear-algebra': [
    ['Systems and matrices', ['Row reduction', 'Matrix algebra', 'Inverses and determinants']],
    ['Vector spaces', ['Subspaces, span, independence', 'Basis and dimension', 'Rank and nullity']],
    ['Linear transformations', ['Matrices of transformations', 'Change of basis', 'Geometry of 2D and 3D transformations']],
    ['Eigenvalues', ['Eigenvectors and diagonalisation', 'Orthogonality and projections', 'Singular value decomposition']],
  ],
  'math.uni.diff-eq': [
    ['First-order equations', ['Separable and linear equations', 'Modelling with first-order ODEs', 'Numerical methods']],
    ['Second-order equations', ['Constant coefficients', 'Oscillations and resonance', 'Variation of parameters']],
    ['Systems', ['Linear systems and phase portraits', 'Nonlinear systems and stability']],
    ['Transforms and series', ['Laplace transforms', 'Series solutions', 'Introduction to PDEs']],
  ],
  'math.uni.discrete': [
    ['Logic and proof', ['Propositional and predicate logic', 'Proof techniques', 'Induction']],
    ['Sets, relations, functions', ['Set operations', 'Equivalence relations', 'Cardinality']],
    ['Combinatorics', ['Counting principles', 'Binomial coefficients', 'Recurrences']],
    ['Graph theory', ['Paths and connectivity', 'Trees', 'Colouring and planarity']],
  ],
  'math.uni.probability': [
    ['Probability foundations', ['Axioms and conditional probability', 'Random variables', 'Common distributions']],
    ['Expectation and limits', ['Expectation and variance', 'Law of large numbers', 'Central limit theorem']],
    ['Statistical inference', ['Estimators', 'Hypothesis testing', 'Regression']],
  ],
  'math.uni.optimization': [
    ['Optimisation', ['Convexity', 'Gradient methods', 'Linear programming']],
    ['Numerical analysis', ['Floating-point error', 'Root finding and interpolation', 'Numerical integration and ODE solvers']],
  ],
  'math.uni.analysis': [
    ['The real numbers', ['Completeness', 'Sequences and limits', 'Series']],
    ['Continuity and differentiation', ['Epsilon-delta continuity', 'Uniform continuity', 'Mean value theorem revisited']],
    ['Integration', ['Riemann integral rigorously', 'Sequences of functions', 'Uniform convergence']],
  ],
  'math.uni.algebra': [
    ['Groups', ['Definitions and examples', 'Subgroups and cosets', 'Homomorphisms and quotients']],
    ['Rings and fields', ['Rings and ideals', 'Polynomial rings', 'Field extensions']],
    ['Number theory', ['Divisibility and congruences', 'Primes', 'Quadratic reciprocity']],
  ],
  'math.uni.complex-topology': [
    ['Complex analysis', ['Holomorphic functions', 'Cauchy’s theorem', 'Residues']],
    ['Topology', ['Metric and topological spaces', 'Compactness and connectedness', 'Fundamental group']],
    ['Combinatorics', ['Generating functions', 'Extremal combinatorics', 'Probabilistic method']],
  ],
  // ───────────── Physics ─────────────
  'phys.ms.physical-science': [
    ['Motion', ['Describing motion', 'Speed and graphs', 'Forces change motion']],
    ['Energy', ['Kinetic and potential energy', 'Energy transfer and conservation', 'Thermal energy']],
    ['Waves', ['Properties of waves', 'Sound', 'Light and the electromagnetic spectrum']],
    ['Electricity and magnetism', ['Circuits', 'Magnets and electromagnets']],
  ],
  'phys.hs.mechanics': [
    ['Kinematics', ['Position, velocity, acceleration', 'Motion graphs', 'Projectile motion']],
    ['Forces and Newton’s Laws', ['Newton’s Laws', 'Circular Motion', 'Friction and inclines']],
    ['Gravitation and Orbits', ['Universal Gravitation', 'Orbital Motion', 'Energy in Gravitational Fields']],
    ['Energy and momentum', ['Work and energy', 'Conservation of energy', 'Momentum and collisions']],
  ],
  'phys.hs.waves-optics': [
    ['Oscillations and waves', ['Simple harmonic motion', 'Wave properties', 'Superposition and standing waves']],
    ['Sound', ['Pitch, loudness, Doppler effect', 'Resonance']],
    ['Light and optics', ['Reflection and refraction', 'Lenses and mirrors', 'Interference and diffraction']],
  ],
  'phys.hs.em': [
    ['Electrostatics', ['Charge and Coulomb’s law', 'Electric fields and potential']],
    ['Circuits', ['Current, voltage, resistance', 'Series and parallel circuits', 'Power']],
    ['Magnetism', ['Magnetic fields and forces', 'Electromagnetic induction', 'Generators and motors']],
  ],
  'phys.hs.thermo-fluids': [
    ['Thermodynamics', ['Temperature and heat', 'Laws of thermodynamics', 'Heat engines']],
    ['Fluids', ['Pressure and buoyancy', 'Fluid flow and Bernoulli']],
  ],
  'phys.uni.mechanics': [
    ['Newtonian mechanics', ['Vectors and kinematics in 3D', 'Dynamics of particles', 'Rotational dynamics']],
    ['Oscillations', ['Damped and driven oscillators', 'Coupled oscillators and normal modes']],
    ['Analytical mechanics', ['Lagrangian mechanics', 'Hamiltonian mechanics', 'Central forces']],
  ],
  'phys.uni.em': [
    ['Electrostatics and magnetostatics', ['Gauss’s law', 'Potential and conductors', 'Biot–Savart and Ampère']],
    ['Electrodynamics', ['Faraday’s law', 'Maxwell’s equations', 'Electromagnetic waves']],
  ],
  'phys.uni.modern': [
    ['Relativity', ['Lorentz transformations', 'Relativistic energy and momentum']],
    ['Quantum mechanics', ['Wave–particle duality', 'Schrödinger equation', 'Hydrogen atom and spin']],
  ],
  'phys.uni.stat-thermo': [
    ['Thermodynamics', ['Laws and potentials', 'Phase transitions']],
    ['Statistical physics', ['Ensembles', 'Quantum statistics']],
  ],
  // ───────────── Chemistry ─────────────
  'chem.ms.matter': [
    ['Matter', ['States of matter and particle model', 'Physical and chemical properties', 'Mixtures and separation']],
    ['Changes', ['Physical vs chemical changes', 'Conservation of mass', 'Energy in changes']],
  ],
  'chem.hs.atoms': [
    ['Atomic Structure', ['Subatomic particles', 'Isotopes and ions', 'Atomic models and evidence']],
    ['Electron Configurations', ['Shells and subshells', 'Writing configurations', 'Valence electrons']],
    ['The Periodic Table', ['Organisation of the table', 'Periodic trends', 'Families and reactivity']],
  ],
  'chem.hs.bonding': [
    ['Bonding', ['Ionic bonding', 'Covalent bonding', 'Metallic bonding']],
    ['Molecular Geometry', ['Lewis structures', 'VSEPR shapes', 'Polarity and intermolecular forces']],
    ['Formulas and Naming', ['Ionic compounds', 'Molecular compounds', 'Acids']],
  ],
  'chem.hs.reactions': [
    ['Chemical Reactions', ['Balancing equations', 'Reaction types', 'Redox basics']],
    ['Stoichiometry', ['The mole', 'Mass–mole–particle conversions', 'Limiting reagents and yield']],
    ['Gases', ['Gas laws', 'Ideal gas equation', 'Kinetic molecular theory']],
    ['Solutions', ['Concentration', 'Solubility', 'Dilution']],
  ],
  'chem.hs.equilibrium': [
    ['Acids and Bases', ['Definitions', 'pH', 'Titration']],
    ['Equilibrium', ['Equilibrium constant', 'Le Châtelier’s principle']],
    ['Kinetics', ['Rate laws', 'Collision theory and catalysts']],
    ['Thermochemistry', ['Enthalpy', 'Calorimetry', 'Entropy and spontaneity']],
  ],
  'chem.uni.general': [
    ['Quantum chemistry', ['Atomic orbitals', 'Molecular orbital theory']],
    ['Thermodynamics and equilibrium', ['Gibbs energy', 'Aqueous equilibria']],
    ['Electrochemistry', ['Galvanic cells', 'Electrolysis', 'Nernst equation']],
  ],
  'chem.uni.organic': [
    ['Structure and bonding', ['Hybridisation', 'Functional groups', 'Stereochemistry']],
    ['Reactions', ['Substitution and elimination', 'Addition reactions', 'Carbonyl chemistry']],
    ['Spectroscopy', ['NMR', 'IR and mass spectrometry']],
  ],
  'chem.uni.biochem': [
    ['Biomolecules', ['Proteins', 'Carbohydrates and lipids', 'Nucleic acids']],
    ['Metabolism', ['Enzyme kinetics', 'Glycolysis and respiration']],
  ],
  // ───────────── Biology ─────────────
  'bio.ms.life': [
    ['Cells', ['Cells as the unit of life', 'Organelles', 'Cells to organisms']],
    ['Organisms', ['Body systems', 'Growth and reproduction', 'Behaviour']],
    ['Heredity', ['Traits and inheritance', 'Variation']],
    ['Ecosystems', ['Food webs', 'Matter and energy cycling', 'Human impact']],
  ],
  'bio.hs.cells': [
    ['Cell structure and function', ['Membranes and transport', 'Organelles and compartments', 'Cell communication']],
    ['Biomolecules', ['Carbohydrates, lipids, proteins', 'Enzymes', 'Energy and ATP']],
    ['DNA and Gene Expression', ['DNA structure and replication', 'Transcription and translation', 'Gene regulation']],
    ['Cell division', ['Mitosis', 'Meiosis', 'Cell cycle control']],
  ],
  'bio.hs.genetics-evolution': [
    ['Genetics', ['Mendelian inheritance', 'Punnett squares and probability', 'Chromosomes and sex linkage']],
    ['Molecular genetics', ['Mutations', 'Biotechnology']],
    ['Evolution', ['Natural selection', 'Evidence for evolution', 'Speciation and phylogeny']],
  ],
  'bio.hs.physiology-ecology': [
    ['Human anatomy and physiology', ['Circulatory and respiratory systems', 'Digestive and excretory systems', 'Nervous and endocrine systems', 'Immune system']],
    ['Ecology', ['Populations', 'Communities and ecosystems', 'Biogeochemical cycles']],
  ],
  'bio.uni.molecular': [
    ['Molecular biology', ['Gene expression in depth', 'Recombinant DNA', 'Genomics']],
    ['Microbiology', ['Bacteria and archaea', 'Viruses', 'Microbial growth']],
    ['Immunology', ['Innate immunity', 'Adaptive immunity', 'Vaccines']],
  ],
  'bio.uni.advanced': [
    ['Biochemistry', ['Metabolic pathways', 'Signal transduction']],
    ['Developmental and systems biology', ['Development', 'Neuroscience', 'Systems biology']],
  ],
  // ───────────── Language (English; Dari/Pashto support designed in) ─────────────
  'lang.pre-a1.english': [
    ['Sounds and letters', ['The alphabet', 'Common sounds', 'Reading first words']],
    ['First words', ['Greetings', 'Numbers 1–10', 'Colours and classroom objects']],
  ],
  'lang.a1.english': [
    ['Meeting people', ['Greetings and introductions', 'Be and pronouns', 'Countries and nationalities']],
    ['Everyday life', ['Numbers and prices', 'Shopping and food', 'Daily routines and present simple']],
    ['Getting around', ['Places in town', 'Directions and prepositions', 'Imperatives']],
    ['Family and home', ['Family members', 'Possessives', 'There is / there are']],
  ],
  'lang.a2.english': [
    ['Past and future', ['Past simple', 'Going to and will', 'Telling a story']],
    ['Daily communication', ['Making arrangements', 'Shopping and services', 'Health and the body']],
    ['Reading and writing', ['Short messages and emails', 'Simple notices and signs', 'Describing people and places']],
  ],
  'lang.b1.english': [
    ['Expressing yourself', ['Opinions and reasons', 'Comparisons', 'Present perfect and experience']],
    ['Work and study', ['Describing jobs and studies', 'Applications and interviews', 'Formal and informal register']],
    ['Narrative and media', ['Narrative tenses', 'News and reports', 'Summarising']],
  ],
  'lang.b2.english': [
    ['Academic language', ['Argument and evidence', 'Note-taking and summaries', 'Academic vocabulary']],
    ['Professional communication', ['Presentations', 'Emails and reports', 'Negotiation']],
    ['Grammar in depth', ['Conditionals', 'Passive voice', 'Reported speech']],
  ],
  'lang.c1.english': [
    ['Nuance and style', ['Idiom and collocation', 'Register and tone', 'Rhetorical devices']],
    ['Extended discourse', ['Essays', 'Debates', 'Critical reading']],
  ],
  'lang.c2.english': [
    ['Mastery', ['Subtle meaning and implication', 'Literary and specialised texts', 'Editing and precision']],
  ],
};

const slug = (s: string) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const PLANNED_UNIT_LIST: Unit[] = [];
export const PLANNED_TOPIC_LIST: Topic[] = [];
for (const [courseId, units] of Object.entries(PLANNED_UNITS)) {
  for (const [unitName, topics] of units) {
    const unitId = `${courseId}.${slug(unitName)}`;
    PLANNED_UNIT_LIST.push({ id: unitId, courseId, name: unitName });
    for (const t of topics) PLANNED_TOPIC_LIST.push({ id: `${unitId}.${slug(t)}`, unitId, name: t });
  }
}
