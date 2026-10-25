import type { LessonSpec } from '@/core/world/spec';
import { accept } from '../answers';

/**
 * Lesson 2 — At the market (scenario `market`; Apply uses `market-variant`).
 * Reference answers:
 *   l2-how-much-mc: b           l2-fill-are: are             l2-fill-is-it: is / 's
 *   l2-number-twelve: twelve    l2-plural-kilos: kilos       l2-polite-mc: b
 *   l2-error-id: a              l2-fill-yes-please: please / thank you / thanks
 *   l2-written-dialogue: (rubric)
 *   l2-apply-bread: is / 's     l2-apply-oranges: Can I have five oranges, please?
 *   l2-apply-written: (rubric)
 *   l2-demo-how-much: how much  l2-demo-rice: I'd like one kilo of rice, please (variants)
 *   l2-demo-written: (rubric)
 */
export const atTheMarket: LessonSpec = {
  id: 'language.at-the-market',
  worldId: 'conversation',
  title: 'At the market',
  subtitle: 'How much are the apples? Two kilos, please.',
  minutes: 40,
  objectiveIds: ['lang.a1.ask-price', 'lang.a1.request-politely'],
  prerequisiteObjectiveIds: ['lang.a1.be-present'],
  standardRefs: [{ framework: 'CEFR', code: 'A1', summary: 'Handle numbers, prices and simple polite requests when shopping.', verified: false }],
  accessibilitySummary:
    'The environment is a scripted conversation at a market stall. The shopkeeper, Omar, speaks one line at a time; a goal line tells you what to say; you type a reply and press Send. The coach gives rule-based feedback (How much vs How many, plurals after numbers, please); after two tries a model reply is shown. A phrasebook lists food words, numbers and polite phrases; a readout counts turns, re-prompts and words used.',
  validationTests: ['scenario.test.ts: a reply missing a required word triggers the specific feedback', 'grammar.test.ts: checkQuestionInversion', 'grammar.test.ts: missingPluralAfterNumber', 'content.test.ts: every model reply is accepted'],
  mastery: [
    { objectiveId: 'lang.a1.ask-price', level: 'mastered' },
    { objectiveId: 'lang.a1.request-politely', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'Saturday market',
      presets: ['scenario:market'],
      blocks: [
        { type: 'text', md: 'It is Saturday morning. You need apples, eggs and milk. Omar runs a stall at the market. Before you talk to him, guess how the shopping conversation goes.' },
        {
          type: 'prediction',
          id: 'pred-price-question',
          question: 'You want to know the price of the apples. Which question will Omar understand as a question about **price**?',
          options: [
            { id: 'much', text: 'How much are the apples?' },
            { id: 'many', text: 'How many are the apples?' },
            { id: 'cost', text: 'What cost apples?' },
          ],
          correctId: 'much',
          revealPreset: 'scenario:market',
          explanation: '**How much** asks about price (and amount). **How many** counts things ("How many eggs?"). "What cost apples?" is not an English sentence.',
        },
        {
          type: 'prediction',
          id: 'pred-polite-request',
          question: 'Omar says "Anything else?" You want six eggs. Which reply sounds polite?',
          options: [
            { id: 'please', text: 'Yes, six eggs, please.' },
            { id: 'give', text: 'Give me six eggs.' },
            { id: 'want', text: 'I want six eggs.' },
          ],
          correctId: 'please',
          revealPreset: 'scenario:market',
          explanation: 'Adding **please** makes a request polite. "Give me" is an order, and "I want" sounds direct in a shop.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Buy your shopping',
      presets: ['scenario:market'],
      blocks: [
        { type: 'text', md: 'Each turn has a goal. Type your reply and press **Send**. The coach checks a few things: the question word, the verb after *How much*, plurals after numbers, and **please**.' },
        {
          type: 'sim-task',
          preset: 'scenario:market',
          instructions: 'Run the whole conversation. Then **Restart** and, on purpose, type **Two kilo of apples** (no -s, no please) at the second turn and read the two pieces of feedback you get.',
          observe: [
            'The price of a kilo of apples and the price of six eggs (listen to Omar)',
            'What the coach says about "two kilo" and about a missing "please"',
            'Which forms of "How much …?" are accepted at the first turn (are / do … cost / is a kilo of)',
            'The total Omar asks for at the end, and how it adds up',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Omar follows a script and the prices are invented for practice. The feedback is rule-based: it knows a short list of countable nouns and a few question patterns, nothing more. It does not check spelling or punctuation.' },
      ],
    },
    {
      kind: 'understand',
      title: 'Prices, numbers and polite requests',
      presets: ['scenario:market'],
      blocks: [
        { type: 'text', md: 'To ask a price, use **How much** + the verb **be**. The verb agrees with the thing: *How much **is** the bread?* (one thing, or an uncountable thing) but *How much **are** the apples?* (plural). You can also say *How much **do** the apples **cost**?* or simply *How much **is it**?* for the total.' },
        {
          type: 'equation',
          latex: '\\begin{array}{ll} \\text{How much} + \\text{is} + \\text{singular / uncountable} & \\text{How much is the milk?} \\\\ \\text{How much} + \\text{are} + \\text{plural} & \\text{How much are the eggs?} \\\\ \\text{How many} + \\text{plural} & \\text{How many eggs do you want?} \\end{array}',
          caption: 'How much asks about price or amount; how many counts things.',
        },
        { type: 'text', md: '**Numbers 1–20:** one, two, three, four, five, six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen, sixteen, seventeen, eighteen, nineteen, twenty. After **two or more**, the noun is plural: *two kilo**s**, six egg**s**, three bottle**s***. *One kilo* stays singular.' },
        { type: 'text', md: '**Polite requests.** *I’d like two kilos of apples, please.* *Can I have six eggs, please?* Both end with **please**. To accept an offer: *Yes, please.* To refuse: *No, thank you.* When you hand over money: *Here you are.*' },
        { type: 'text', md: 'Some food words are **uncountable**: *milk, bread, rice, tea*. They have no plural and no *a*: *Do you have milk?* To count them, use a container or a measure: *a bottle of milk, a loaf of bread, a kilo of rice*.' },
        { type: 'callout', tone: 'note', md: 'The coach\u2019s feedback is rule-based and limited. It checks only: *How much* vs *How many*; whether a verb follows *How much*; singular nouns after a number (from a fixed list); and whether **please** is present. It cannot tell you whether a sentence is natural.' },
        { type: 'summary', points: ['How much **is** + singular / uncountable; How much **are** + plural; How many counts.', 'Two or more → plural noun: two kilo**s**.', 'I’d like … / Can I have …, **please**. Yes, please. No, thank you. Here you are.', 'Milk, bread, rice: no plural; use a bottle of / a loaf of / a kilo of.'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['scenario:market'],
      blocks: [
        { type: 'text', md: 'Type the missing word(s). Where a whole sentence is asked for, write it in full with a capital letter; punctuation is optional.' },
        { type: 'problem', problemId: 'l2-how-much-mc' },
        { type: 'problem', problemId: 'l2-fill-are' },
        { type: 'problem', problemId: 'l2-fill-is-it' },
        { type: 'problem', problemId: 'l2-number-twelve' },
        { type: 'problem', problemId: 'l2-plural-kilos' },
        { type: 'problem', problemId: 'l2-polite-mc' },
        { type: 'problem', problemId: 'l2-error-id' },
        { type: 'problem', problemId: 'l2-fill-yes-please' },
        { type: 'problem', problemId: 'l2-written-dialogue' },
      ],
    },
    {
      kind: 'apply',
      title: 'Oranges and bread',
      presets: ['scenario:market-variant'],
      blocks: [
        { type: 'text', md: 'One week later: new items, new prices. Oranges are three pounds a kilo and a loaf of bread is two pounds.' },
        {
          type: 'sim-task',
          preset: 'scenario:market-variant',
          instructions: 'Run the variant conversation. Ask the price of the oranges, ask for three kilos politely, ask for bread, and check the total before you pay.',
          observe: ['The total Omar names, and whether 3 × 3 + 2 matches it', 'Which request forms you used (I’d like / Can I have)', 'Whether you needed any model replies'],
        },
        { type: 'problem', problemId: 'l2-apply-bread' },
        { type: 'problem', problemId: 'l2-apply-oranges' },
        { type: 'problem', problemId: 'l2-apply-written' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'The stall and the phrasebook are hidden. Answer without hints to earn full mastery credit.' },
        { type: 'problem', problemId: 'l2-demo-how-much' },
        { type: 'problem', problemId: 'l2-demo-rice' },
        { type: 'problem', problemId: 'l2-demo-written' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['How much is / are …? asks the price; How many counts.', 'Two, three, … → plural noun.', 'I’d like … / Can I have …, please. Yes, please. No, thank you. Here you are.'] },
        { type: 'text', md: 'Next lesson: **Finding the library**, where you ask where places are and follow directions.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l2-how-much-mc', kind: 'multiple-choice', objectiveIds: ['lang.a1.ask-price'], category: 'conceptual', difficulty: 1,
      prompt: 'You want to know the price of the bananas. What do you ask?',
      options: [
        { id: 'a', text: 'How many are the bananas?', feedback: '"How many" counts things. For a price use **How much**.' },
        { id: 'b', text: 'How much are the bananas?', feedback: 'Correct: How much + are + plural noun.' },
        { id: 'c', text: 'What cost bananas?', feedback: 'This is not an English question. Use **How much are the bananas?**' },
      ],
      correctId: 'b',
      hints: ['Price → How much.', 'Bananas is plural → are.'],
      solution: 'How much **are** the bananas?',
    },
    {
      id: 'l2-fill-are', kind: 'short-text', objectiveIds: ['lang.a1.ask-price'], category: 'procedural', difficulty: 1,
      prompt: 'Complete: "How much ____ the eggs?"',
      accepted: accept('are'),
      misconceptions: [
        { id: 'singular-is', accepted: ['is'], feedback: '"Eggs" is plural, so the verb is **are**: How much are the eggs?' },
        { id: 'do-without-cost', accepted: ['do'], feedback: '"How much do the eggs?" needs "cost" at the end. Without it, use be: How much **are** the eggs?' },
        { id: 'cost-first', accepted: ['cost'], feedback: '"Cost" cannot come straight after "How much". Say How much **are** the eggs? or How much **do** the eggs **cost**?' },
      ],
      placeholder: 'is / are',
      hints: ['Is "the eggs" singular or plural?', 'plural → are.'],
      solution: 'How much **are** the eggs?',
    },
    {
      id: 'l2-fill-is-it', kind: 'short-text', objectiveIds: ['lang.a1.ask-price'], category: 'procedural', difficulty: 1,
      prompt: 'You want the total. Complete: "How much ____ it?"',
      accepted: accept('is', "'s"),
      misconceptions: [
        { id: 'are-with-it', accepted: ['are'], feedback: '"It" is singular, so the verb is **is**: How much is it?' },
        { id: 'do-with-it', accepted: ['do', 'does'], feedback: 'With "it" and no other verb, use be: How much **is** it?' },
      ],
      placeholder: 'is / are',
      hints: ['it → is.'],
      solution: 'How much **is** it? (or How much’s it? in fast speech)',
    },
    {
      id: 'l2-number-twelve', kind: 'short-text', objectiveIds: ['lang.a1.ask-price'], category: 'computation', difficulty: 1,
      prompt: 'Omar says the eggs are **12** for one pound. Write the number 12 in words.',
      accepted: accept('twelve'),
      misconceptions: [
        { id: 'twenty', accepted: ['twenty'], feedback: 'Twenty is 20. Twelve is 12.' },
        { id: 'two', accepted: ['two'], feedback: 'Two is 2. Twelve is 12.' },
        { id: 'twelf', accepted: ['twelf', 'twelv', 'tvelve'], feedback: 'Almost: the spelling is t-w-e-l-v-e.' },
      ],
      placeholder: 'number in words',
      hints: ['Ten, eleven, …', 'It starts with "tw" and ends with "lve".'],
      solution: '12 = **twelve**.',
    },
    {
      id: 'l2-plural-kilos', kind: 'short-text', objectiveIds: ['lang.a1.ask-price'], category: 'procedural', difficulty: 2,
      prompt: 'Complete with the correct form of **kilo**: "Three ____ of apples, please."',
      accepted: accept('kilos'),
      misconceptions: [
        { id: 'no-plural', accepted: ['kilo'], feedback: 'After **three** the noun is plural: three kilo**s**.' },
        { id: 'kiloes', accepted: ['kiloes'], feedback: 'Close: the plural of kilo is kilo**s** (no e).' },
      ],
      placeholder: 'kilo…',
      hints: ['How many kilos? More than one.', 'Add -s.'],
      solution: 'Three **kilos** of apples, please.',
    },
    {
      id: 'l2-polite-mc', kind: 'multiple-choice', objectiveIds: ['lang.a1.request-politely'], category: 'procedural', difficulty: 1,
      prompt: 'You want a kilo of apples. Which request is polite?',
      options: [
        { id: 'a', text: 'Give me apples.', feedback: '"Give me" is an order. Add please or use I’d like / Can I have.' },
        { id: 'b', text: "I'd like a kilo of apples, please.", feedback: 'Correct: I’d like … , please.' },
        { id: 'c', text: 'Apples. Now.', feedback: 'This sounds rude. Use a full polite request with please.' },
      ],
      correctId: 'b',
      hints: ['Polite requests end with please.', 'I’d like … or Can I have … ?'],
      solution: 'I’d like a kilo of apples, **please**.',
    },
    {
      id: 'l2-error-id', kind: 'multiple-choice', objectiveIds: ['lang.a1.ask-price', 'lang.a1.request-politely'], category: 'error-identification', difficulty: 2,
      prompt: 'A learner says: *"I would like two egg, please."* Find the mistake.',
      options: [
        { id: 'a', text: '"egg" should be "eggs": two needs a plural.', feedback: 'Correct: two egg**s**.' },
        { id: 'b', text: '"please" is in the wrong place.', feedback: '"…, please" at the end is exactly right.' },
        { id: 'c', text: '"would like" should be "will like".', feedback: '"I would like" (I’d like) is the polite request form; it is correct.' },
      ],
      correctId: 'a',
      hints: ['Look at the number and the noun after it.', 'two + …s'],
      solution: 'I would like two **eggs**, please.',
    },
    {
      id: 'l2-fill-yes-please', kind: 'short-text', objectiveIds: ['lang.a1.request-politely'], category: 'procedural', difficulty: 1,
      prompt: 'Omar asks "Do you want a bag?" You do. Complete the polite answer: "Yes, ____."',
      accepted: accept('please', 'thank you', 'thanks'),
      misconceptions: [
        { id: 'i-want', accepted: ['I want', 'I want a bag', 'give me'], feedback: '"I want" sounds direct in a shop. The short polite answer is Yes, **please**.' },
        { id: 'no', accepted: ['no'], feedback: 'You do want the bag. Say Yes, **please**.' },
      ],
      placeholder: 'one or two words',
      hints: ['One polite word is enough.', 'It is the same word you add to a request.'],
      solution: 'Yes, **please**. (Yes, thank you. is also fine.)',
    },
    {
      id: 'l2-written-dialogue', kind: 'written', objectiveIds: ['lang.a1.ask-price', 'lang.a1.request-politely'], category: 'explanation', difficulty: 2,
      prompt: 'Write a short shopping dialogue of four lines: ask the price of something, hear the price, ask for a quantity politely, and say thank you.',
      modelAnswer: 'A: How much are the onions? B: One pound a kilo. A: I’d like two kilos, please. B: Here you are. A: Thank you!',
      rubric: ['Asks the price with "How much is / are …?" using the right verb', 'Uses a number with a plural noun (two kilos, six eggs)', 'Makes the request with I’d like / Can I have … and ends it with please', 'Says thank you'],
      hints: ['Price → quantity → please → thank you.'],
      solution: 'See the model answer.',
    },
    {
      id: 'l2-apply-bread', kind: 'short-text', objectiveIds: ['lang.a1.ask-price'], category: 'transfer', difficulty: 2,
      prompt: 'At a bakery. Complete: "How much ____ the bread?"',
      accepted: accept('is', "'s"),
      misconceptions: [
        { id: 'are-uncountable', accepted: ['are'], feedback: '"Bread" is uncountable, so it takes the singular verb: How much **is** the bread?' },
        { id: 'do', accepted: ['do', 'does'], feedback: 'With no other verb use be: How much **is** the bread?' },
      ],
      placeholder: 'is / are',
      hints: ['Bread has no plural.', 'Uncountable → singular → is.'],
      solution: 'How much **is** the bread?',
    },
    {
      id: 'l2-apply-oranges', kind: 'short-text', objectiveIds: ['lang.a1.request-politely', 'lang.a1.ask-price'], category: 'transfer', difficulty: 3,
      prompt: 'You want **5** oranges. Write the full polite request, starting with "Can I have".',
      accepted: accept('Can I have five oranges, please?', 'Can I have 5 oranges, please?'),
      misconceptions: [
        { id: 'no-plural', accepted: accept('Can I have five orange, please?', 'Can I have 5 orange, please?'), feedback: 'After **five** the noun is plural: five orange**s**.' },
        { id: 'no-please', accepted: accept('Can I have five oranges', 'Can I have 5 oranges'), feedback: 'Add **please** at the end: Can I have five oranges, please?' },
        { id: 'the', accepted: accept('Can I have the five oranges, please?'), feedback: 'No "the" is needed when you ask for a quantity: Can I have five oranges, please?' },
      ],
      placeholder: 'Can I have …',
      hints: ['Can I have + number + plural noun + please.', 'Five + orange + s.'],
      solution: 'Can I have **five oranges, please**?',
    },
    {
      id: 'l2-apply-written', kind: 'written', objectiveIds: ['lang.a1.request-politely', 'lang.a1.ask-price'], category: 'application', difficulty: 3,
      prompt: 'You are at a clothes stall. Write 3–4 lines: greet the seller, ask the price of a shirt, ask for two shirts politely, and thank them.',
      modelAnswer: 'Good morning. How much is this shirt? … I’d like two shirts, please. Here you are. Thank you!',
      rubric: ['Starts with a greeting', 'Asks the price with "How much is …?" (one shirt → is)', 'Asks for two shirts with a plural and please', 'Thanks the seller'],
      hints: ['Greet → How much is …? → I’d like two …, please → thank you.'],
      solution: 'See the model answer.',
    },
    {
      id: 'l2-demo-how-much', kind: 'short-text', objectiveIds: ['lang.a1.ask-price'], category: 'application', difficulty: 2,
      prompt: 'Complete the price question with **two words**: "Good afternoon. ____ ____ are the tomatoes?"',
      accepted: accept('how much'),
      misconceptions: [
        { id: 'how-many', accepted: ['how many'], feedback: '"How many" counts the tomatoes. For the price ask **How much**.' },
        { id: 'what-price', accepted: ['what price', 'what cost'], feedback: 'The question for a price is **How much** are …?' },
      ],
      placeholder: 'two words',
      hints: ['The price question starts with How.', 'How m…'],
      solution: '**How much** are the tomatoes?',
    },
    {
      id: 'l2-demo-rice', kind: 'short-text', objectiveIds: ['lang.a1.request-politely'], category: 'transfer', difficulty: 3,
      prompt: 'Write a polite request for **one kilo of rice**, starting with "I’d like".',
      accepted: accept("I'd like one kilo of rice, please.", "I'd like a kilo of rice, please.", "I'd like 1 kilo of rice, please."),
      misconceptions: [
        { id: 'no-please', accepted: accept("I'd like one kilo of rice", "I'd like a kilo of rice"), feedback: 'Add **please** at the end.' },
        { id: 'plural-one', accepted: accept("I'd like one kilos of rice, please."), feedback: '**One** is singular: one kilo.' },
        { id: 'rices', accepted: accept("I'd like one kilo of rices, please."), feedback: 'Rice is uncountable: no -s.' },
      ],
      placeholder: "I'd like …",
      hints: ['I’d like + quantity + of rice + please.'],
      solution: 'I’d like **one kilo of rice, please**.',
    },
    {
      id: 'l2-demo-written', kind: 'written', objectiveIds: ['lang.a1.ask-price', 'lang.a1.request-politely'], category: 'explanation', difficulty: 3,
      prompt: 'Write a market dialogue of 4–6 lines in which you buy two things. Include a price question, a quantity with a plural, please, and "Here you are".',
      modelAnswer: 'A: Hello! How much are the potatoes? B: One pound a kilo. A: I’d like three kilos, please. And do you have milk? B: Yes, one bottle is one pound. A: One bottle, please. How much is it? B: Four pounds. A: Here you are. Thank you!',
      rubric: ['A price question with the correct verb', 'A quantity of two or more with a plural noun', 'At least one request ending in please', '"Here you are" when paying'],
      hints: ['Price → quantity → second item → total → pay → thanks.'],
      solution: 'See the model answer.',
    },
  ],
};
