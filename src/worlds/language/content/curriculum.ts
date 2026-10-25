import type { Concept, CoverageStatus, LearningObjective, StandardRef, Topic, Unit } from '@/core/curriculum/types';

/**
 * Curriculum slice implemented by Conversation Street (English A1).
 *
 * Standard references point at the CEFR A1 level. The summaries are short paraphrases in
 * our own words of what an A1 speaker can typically do in these situations; they do not
 * reproduce official descriptor text and have not been checked against the official
 * source, so `verified` is false.
 */
const cefrA1 = (summary: string): StandardRef => ({
  framework: 'CEFR',
  code: 'A1',
  summary,
  url: 'https://www.coe.int/en/web/common-european-framework-reference-languages/level-descriptions',
  verified: false,
  verificationNote: 'Paraphrase in our own words of the general A1 level; not checked against official descriptor wording.',
});

/** Prerequisites from other parts of the catalog: none, A1 is the entry level of the English course. */
export const LANGUAGE_PREREQUISITES: LearningObjective[] = [];

export const LANGUAGE_UNITS: Unit[] = [{ id: 'lang.a1.survival-talk', courseId: 'lang.a1.english', name: 'Everyday conversations' }];

export const LANGUAGE_TOPICS: Topic[] = [
  { id: 'lang.a1.meeting-people', unitId: 'lang.a1.survival-talk', name: 'Meeting people' },
  { id: 'lang.a1.shopping', unitId: 'lang.a1.survival-talk', name: 'Shopping and prices' },
  { id: 'lang.a1.getting-around', unitId: 'lang.a1.survival-talk', name: 'Getting around town' },
];

export const LANGUAGE_CONCEPTS: Concept[] = [
  { id: 'lang.a1.greetings', topicId: 'lang.a1.meeting-people', name: 'Greetings and introductions', summary: 'Hello, my name is…, I am from…, How are you? Fine, thank you. And you?' },
  { id: 'lang.a1.verb-be', topicId: 'lang.a1.meeting-people', name: 'The verb be', summary: 'am / is / are with I, you, he, she, it, we, they; short forms I’m, he’s, it’s.' },
  { id: 'lang.a1.numbers-prices', topicId: 'lang.a1.shopping', name: 'Numbers and prices', summary: 'Numbers 1–20, How much is/are…?, plurals after a number.' },
  { id: 'lang.a1.polite-requests', topicId: 'lang.a1.shopping', name: 'Polite requests', summary: 'I’d like…, Can I have…, please, thank you, yes please / no thank you.' },
  { id: 'lang.a1.wh-questions', topicId: 'lang.a1.getting-around', name: 'Asking where', summary: 'Excuse me, where is…? Is there a … near here? Can you say that again, please?' },
  { id: 'lang.a1.place-prepositions', topicId: 'lang.a1.getting-around', name: 'Directions and prepositions of place', summary: 'Turn left/right, go straight on; next to, opposite, between, on the left.' },
];

export const LANGUAGE_OBJECTIVES: LearningObjective[] = [
  {
    id: 'lang.a1.greet-introduce',
    conceptId: 'lang.a1.greetings',
    statement: 'Greet someone, give your name, say where you are from, and answer "How are you?" with simple fixed phrases.',
    cognitiveLevel: 'apply',
    prerequisiteIds: [],
    standardRefs: [cefrA1('Can introduce themselves and others and exchange basic personal details such as where they live and who they know, provided the other person speaks slowly.')],
  },
  {
    id: 'lang.a1.be-present',
    conceptId: 'lang.a1.verb-be',
    statement: 'Use am / is / are correctly with I, you, he, she, it, we and they in short statements and questions, including the short forms I’m, he’s and it’s.',
    cognitiveLevel: 'apply',
    prerequisiteIds: [],
    standardRefs: [cefrA1('Can use a small set of memorised sentence patterns about themselves and people they know.')],
  },
  {
    id: 'lang.a1.ask-price',
    conceptId: 'lang.a1.numbers-prices',
    statement: 'Ask what something costs with "How much is / are …?" and understand and say prices and quantities using the numbers 1–20.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['lang.a1.be-present'],
    standardRefs: [cefrA1('Can handle numbers, quantities and prices in simple everyday transactions such as shopping.')],
  },
  {
    id: 'lang.a1.request-politely',
    conceptId: 'lang.a1.polite-requests',
    statement: 'Ask for things politely with "I’d like …" or "Can I have …, please?" and accept or refuse an offer with "Yes, please" / "No, thank you".',
    cognitiveLevel: 'apply',
    prerequisiteIds: [],
    standardRefs: [cefrA1('Can ask people for things and give people things, using basic polite forms.')],
  },
  {
    id: 'lang.a1.ask-directions',
    conceptId: 'lang.a1.wh-questions',
    statement: 'Ask where a place is with "Excuse me, where is …?" or "Is there a … near here?", check understanding, and ask for repetition.',
    cognitiveLevel: 'apply',
    prerequisiteIds: ['lang.a1.be-present'],
    standardRefs: [cefrA1('Can ask simple questions about where places are and ask the other person to repeat or speak more slowly.')],
  },
  {
    id: 'lang.a1.follow-directions',
    conceptId: 'lang.a1.place-prepositions',
    statement: 'Understand and repeat simple directions using "turn left / right", "go straight on" and prepositions of place such as next to, opposite, between and on the left.',
    cognitiveLevel: 'understand',
    prerequisiteIds: [],
    standardRefs: [cefrA1('Can follow short, simple directions, for example how to get from one place to another on foot.')],
  },
];

export const LANGUAGE_COVERAGE: CoverageStatus[] = LANGUAGE_OBJECTIVES.map((o) => ({
  objectiveId: o.id,
  planned: true,
  authored: true,
  implemented: true,
  scientificallyReviewed: false,
  learnerTested: false,
  notes: 'Rule-based feedback validated by automated tests; English content not yet reviewed by a second language teacher; Dari glosses await native-speaker review.',
}));
