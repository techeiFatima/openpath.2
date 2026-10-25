import type { LessonSpec } from '@/core/world/spec';
import { accept } from '../answers';

/**
 * Lesson 3 — Finding the library (scenario `library`).
 * Reference answers:
 *   l3-ask-mc: a                 l3-fill-where-is: where is / where's      l3-prep-between: between
 *   l3-prep-on: on               l3-imperative-mc: a                      l3-error-id: a
 *   l3-fill-repeat: repeat       l3-written-route: (rubric)
 *   l3-apply-near: near          l3-apply-turn: turn / go                 l3-apply-written: (rubric)
 *   l3-demo-where: where         l3-demo-opposite: opposite               l3-demo-written: (rubric)
 */
export const findingTheLibrary: LessonSpec = {
  id: 'language.finding-the-library',
  worldId: 'conversation',
  title: 'Finding the library',
  subtitle: 'Excuse me, where is the library? Turn right at the bank.',
  minutes: 40,
  objectiveIds: ['lang.a1.ask-directions', 'lang.a1.follow-directions'],
  prerequisiteObjectiveIds: ['lang.a1.be-present'],
  standardRefs: [{ framework: 'CEFR', code: 'A1', summary: 'Ask where a place is and follow short simple directions.', verified: false }],
  accessibilitySummary:
    'The environment is a scripted conversation on a town street. A passer-by, Tom, gives directions one line at a time; a goal line tells you what to say; you type a reply and press Send. The coach gives rule-based feedback (question word order, the before place names, on the left); after two tries a model reply is shown. A phrasebook lists places, directions and prepositions; a readout counts turns, re-prompts and words used.',
  validationTests: ['grammar.test.ts: checkQuestionInversion', 'grammar.test.ts: missingArticle', 'scenario.test.ts: showModelReply moves on', 'content.test.ts: every model reply is accepted'],
  mastery: [
    { objectiveId: 'lang.a1.ask-directions', level: 'mastered' },
    { objectiveId: 'lang.a1.follow-directions', level: 'proficient' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'Lost in town',
      presets: ['scenario:library'],
      blocks: [
        { type: 'text', md: 'You need a book for your English class, but you do not know where the library is. A man sees you looking at your phone. Before you ask, guess how the conversation starts.' },
        {
          type: 'prediction',
          id: 'pred-polite-question',
          question: 'Which question is correct **and** polite for a stranger?',
          options: [
            { id: 'excuse', text: 'Excuse me, where is the library?' },
            { id: 'where-is', text: 'Where the library is?' },
            { id: 'library', text: 'Library? Where?' },
          ],
          correctId: 'excuse',
          revealPreset: 'scenario:library',
          explanation: 'Start with **Excuse me**, then put the verb first: **Where is** the library? "Where the library is?" has the wrong word order for a direct question.',
        },
        {
          type: 'prediction',
          id: 'pred-direction-word',
          question: 'Tom says the library is beside the school, on the same side of the street. Which word will he use?',
          options: [
            { id: 'next', text: 'next to' },
            { id: 'opposite', text: 'opposite' },
            { id: 'between', text: 'between' },
          ],
          correctId: 'next',
          revealPreset: 'scenario:library',
          explanation: '**Next to** = beside. **Opposite** = across the street from. **Between** = with one thing on each side.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Ask Tom the way',
      presets: ['scenario:library'],
      blocks: [
        { type: 'text', md: 'Each turn has a goal. Two turns ask you to **repeat** what Tom said: this is how real listeners check they understood. Press **Listen** to hear the line again before you repeat it.' },
        {
          type: 'sim-task',
          preset: 'scenario:library',
          instructions: 'Run the whole conversation. Then **Restart** and at the first turn type **Where the library is?** on purpose; at the third turn try **straight on bank on the left**. Read the coach’s feedback both times.',
          observe: [
            'The route: which side the bank is on, where you turn, and what the library is next to',
            'What the coach says about "Where the library is?"',
            'What the coach says when you leave out "the" before bank or school',
            'How many turns you completed without a model reply (readout)',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Tom follows a script and the town is invented. The feedback is rule-based: it checks question word order, a short list of place nouns for a missing **the**, and a few fixed phrases. It does not check spelling or punctuation.' },
      ],
    },
    {
      kind: 'understand',
      title: 'Where is…? and directions',
      presets: ['scenario:library'],
      blocks: [
        { type: 'text', md: 'A question about a place starts with **Where** + **is / are**, and then the place: *Where is the library?* *Where are the toilets?* With a stranger, start with **Excuse me**. Another A1 form is *Is there a bank near here?*' },
        {
          type: 'equation',
          latex: '\\begin{array}{ll} \\text{statement} & \\text{The library is next to the school.} \\\\ \\text{question} & \\text{Where is the library?} \\\\ \\text{yes / no question} & \\text{Is it far?} \\end{array}',
          caption: 'In a question the verb be moves in front of the subject.',
        },
        { type: 'text', md: '**Directions** use the imperative: the base form of the verb with no subject. *Turn left. Turn right at the bank. Go straight on. Cross the street.* Places take **the**: *the bank, the school, the library*.' },
        { type: 'text', md: '**Prepositions of place.** *next to* = beside. *opposite* = across the street. *between A and B* = with A on one side and B on the other. *behind* / *in front of*. *on the left* / *on the right* (always **on**).' },
        { type: 'text', md: '**Checking and repeating.** *Is it far?* *Sorry, can you say that again, please?* *Can you repeat that, please?* Then repeat the key words back: *Right at the bank, next to the school?*' },
        { type: 'callout', tone: 'note', md: 'The coach checks only: whether a direct question starts with its verb; whether **the** is missing before a place noun from a short list; whether **please** is present when you ask for repetition; and a few fixed wrong phrases (*in the left*, *next the school*). It cannot judge whether your directions actually lead to the library.' },
        { type: 'summary', points: ['Excuse me, **where is** the …? / Is there a … near here?', 'Imperatives for directions: Turn left / right, Go straight on.', 'next to, opposite, between … and …, **on** the left / right.', 'Check: Is it far? Sorry, can you say that again, please?'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['scenario:library'],
      blocks: [
        { type: 'text', md: 'Type the missing word(s). The street scene stays open on the right if you want to re-read the route.' },
        { type: 'problem', problemId: 'l3-ask-mc' },
        { type: 'problem', problemId: 'l3-fill-where-is' },
        { type: 'problem', problemId: 'l3-prep-between' },
        { type: 'problem', problemId: 'l3-prep-on' },
        { type: 'problem', problemId: 'l3-imperative-mc' },
        { type: 'problem', problemId: 'l3-error-id' },
        { type: 'problem', problemId: 'l3-fill-repeat' },
        { type: 'problem', problemId: 'l3-written-route' },
      ],
    },
    {
      kind: 'apply',
      title: 'A different place',
      presets: ['scenario:library'],
      blocks: [
        { type: 'text', md: 'Same pattern, new places. Run the conversation again and, where Tom accepts it, use the alternative forms: *Is there a library near here?* and *Can you repeat that, please?* Then try these.' },
        { type: 'problem', problemId: 'l3-apply-near' },
        { type: 'problem', problemId: 'l3-apply-turn' },
        { type: 'problem', problemId: 'l3-apply-written' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'The street and the phrasebook are hidden. Answer without hints to earn full mastery credit.' },
        { type: 'problem', problemId: 'l3-demo-where' },
        { type: 'problem', problemId: 'l3-demo-opposite' },
        { type: 'problem', problemId: 'l3-demo-written' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Excuse me, where is the …? / Is there a … near here?', 'Turn left / right at the …, go straight on.', 'next to, opposite, between, on the left; places take **the**.', 'Sorry, can you say that again, please?'] },
        { type: 'text', md: 'This completes the first three conversations. Objectives at *developing* come back for a short review in a few days; the Review tab of each lesson shows your evidence.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l3-ask-mc', kind: 'multiple-choice', objectiveIds: ['lang.a1.ask-directions'], category: 'conceptual', difficulty: 1,
      prompt: 'You want to find the station. Which question is correct and polite?',
      options: [
        { id: 'a', text: 'Excuse me, where is the station?', feedback: 'Correct: Excuse me + Where is + the station.' },
        { id: 'b', text: 'Station where?', feedback: 'Not a sentence. Use Where is the station?' },
        { id: 'c', text: 'Where the station is?', feedback: 'In a direct question the verb comes right after where: Where **is** the station?' },
      ],
      correctId: 'a',
      hints: ['Start with Excuse me.', 'Where + is + the place.'],
      solution: 'Excuse me, **where is** the station?',
    },
    {
      id: 'l3-fill-where-is', kind: 'short-text', objectiveIds: ['lang.a1.ask-directions'], category: 'procedural', difficulty: 1,
      prompt: 'Complete with **two words**: "Excuse me, ____ ____ the bank?"',
      accepted: accept('where is', "where's"),
      misconceptions: [
        { id: 'where-are', accepted: ['where are'], feedback: '"The bank" is one place: where **is** the bank?' },
        { id: 'what-is', accepted: ['what is', "what's"], feedback: '"What is the bank?" asks what a bank is. To find a place ask **Where is**.' },
        { id: 'where-the', accepted: ['where the'], feedback: 'The verb comes right after where: **Where is** the bank?' },
      ],
      placeholder: 'two words',
      hints: ['The question word for a place.', 'Where + is.'],
      solution: 'Excuse me, **where is** the bank? (where’s)',
    },
    {
      id: 'l3-prep-between', kind: 'short-text', objectiveIds: ['lang.a1.follow-directions'], category: 'procedural', difficulty: 2,
      prompt: 'The school is on one side of the library and the park is on the other side. Complete: "The library is ____ the school and the park."',
      accepted: accept('between'),
      misconceptions: [
        { id: 'next-to', accepted: ['next to'], feedback: '"Next to" is for one neighbour. With a thing on each side use **between** … and ….' },
        { id: 'opposite', accepted: ['opposite'], feedback: '"Opposite" means across the street. Here the library has the school on one side and the park on the other: **between**.' },
        { id: 'in', accepted: ['in', 'in the middle'], feedback: 'The word for "with one thing on each side" is **between**.' },
      ],
      placeholder: 'one word',
      hints: ['One thing on each side.', 'b…tw…n'],
      solution: 'The library is **between** the school and the park.',
    },
    {
      id: 'l3-prep-on', kind: 'short-text', objectiveIds: ['lang.a1.follow-directions'], category: 'procedural', difficulty: 1,
      prompt: 'Complete: "The bank is ____ the left."',
      accepted: accept('on'),
      misconceptions: [
        { id: 'in', accepted: ['in'], feedback: 'English says **on** the left / on the right.' },
        { id: 'at', accepted: ['at'], feedback: 'English says **on** the left / on the right.' },
        { id: 'to', accepted: ['to'], feedback: '"To the left" is a direction of movement. For a position say **on** the left.' },
      ],
      placeholder: 'one word',
      hints: ['It is the same word as in "on the table".'],
      solution: 'The bank is **on** the left.',
    },
    {
      id: 'l3-imperative-mc', kind: 'multiple-choice', objectiveIds: ['lang.a1.follow-directions'], category: 'procedural', difficulty: 2,
      prompt: 'Give a direction. Which sentence is correct?',
      options: [
        { id: 'a', text: 'Turn left at the bank.', feedback: 'Correct: base form, no subject.' },
        { id: 'b', text: 'You turning left at the bank.', feedback: 'Directions use the base form with no subject: Turn left.' },
        { id: 'c', text: 'To turn left the bank.', feedback: 'No "to", and "at" is needed before the place: Turn left **at** the bank.' },
      ],
      correctId: 'a',
      hints: ['Directions are commands.', 'Base verb + direction + at + place.'],
      solution: '**Turn left at the bank.**',
    },
    {
      id: 'l3-error-id', kind: 'multiple-choice', objectiveIds: ['lang.a1.follow-directions'], category: 'error-identification', difficulty: 2,
      prompt: 'A learner says: *"Go straight on and turn to right."* What is wrong?',
      options: [
        { id: 'a', text: '"turn to right" should be "turn right".', feedback: 'Correct: turn left / turn right, with no "to".' },
        { id: 'b', text: '"straight on" should be "straight in".', feedback: '"Go straight on" is correct.' },
        { id: 'c', text: 'Nothing is wrong.', feedback: 'Look at "turn to right": English says turn right.' },
      ],
      correctId: 'a',
      hints: ['Look at the last two words.', 'turn + left / right, nothing in between.'],
      solution: 'Go straight on and **turn right**.',
    },
    {
      id: 'l3-fill-repeat', kind: 'short-text', objectiveIds: ['lang.a1.ask-directions'], category: 'procedural', difficulty: 2,
      prompt: 'You did not understand. Complete: "Sorry, can you ____ that, please?"',
      accepted: accept('repeat'),
      misconceptions: [
        { id: 'say', accepted: ['say'], feedback: '"Say that" needs "again": say that **again**. With one word, use **repeat**.' },
        { id: 'repeating', accepted: ['repeating', 'repeats', 'repeated'], feedback: 'After "can you" use the base form: can you **repeat**.' },
        { id: 'again', accepted: ['again'], feedback: '"Can you again that" has no verb. Use **repeat**.' },
      ],
      placeholder: 'one word',
      hints: ['One verb that means "say again".', 'r…p…t'],
      solution: 'Sorry, can you **repeat** that, please?',
    },
    {
      id: 'l3-written-route', kind: 'written', objectiveIds: ['lang.a1.follow-directions'], category: 'explanation', difficulty: 2,
      prompt: 'Tom said: "Go straight on. The bank is on the left. At the bank, turn right. The library is next to the school." Explain the route to a friend in 2–3 sentences, using imperatives and at least two prepositions of place.',
      modelAnswer: 'Go straight on until the bank, which is on the left. Turn right at the bank. The library is next to the school, opposite the park.',
      rubric: ['Uses imperatives (go, turn) with no subject', 'Uses "on the left" or "on the right" correctly with on', 'Uses next to / opposite / between correctly', 'Places take "the" (the bank, the school)'],
      hints: ['Go … Turn … The library is … .'],
      solution: 'See the model answer.',
    },
    {
      id: 'l3-apply-near', kind: 'short-text', objectiveIds: ['lang.a1.ask-directions'], category: 'transfer', difficulty: 2,
      prompt: 'You are looking for a hospital. Complete: "Excuse me, is there a hospital ____ here?"',
      accepted: accept('near'),
      misconceptions: [
        { id: 'next', accepted: ['next', 'next to'], feedback: '"Next to here" is not used. Say **near** here.' },
        { id: 'nearby', accepted: ['nearby'], feedback: '"Nearby" stands alone ("a hospital nearby"). Before "here" use **near**.' },
        { id: 'close', accepted: ['close'], feedback: '"Close" needs "to": close to here. The simple form is **near** here.' },
      ],
      placeholder: 'one word',
      hints: ['Not far = …', 'n…r'],
      solution: 'Is there a hospital **near** here?',
    },
    {
      id: 'l3-apply-turn', kind: 'short-text', objectiveIds: ['lang.a1.follow-directions'], category: 'transfer', difficulty: 2,
      prompt: 'A tourist asks for the post office. It is on the right after the bank. Complete the direction: "Go straight on. At the bank, ____ right."',
      accepted: accept('turn', 'go'),
      misconceptions: [
        { id: 'turning', accepted: ['turning'], feedback: 'Directions use the base form: **turn** right.' },
        { id: 'turns', accepted: ['turns'], feedback: 'The imperative has no -s: **turn** right.' },
        { id: 'you-turn', accepted: ['you turn'], feedback: 'Leave out "you": at the bank, **turn** right.' },
      ],
      placeholder: 'one word',
      hints: ['The verb for changing direction.', 'Base form, no subject.'],
      solution: 'At the bank, **turn** right.',
    },
    {
      id: 'l3-apply-written', kind: 'written', objectiveIds: ['lang.a1.follow-directions', 'lang.a1.ask-directions'], category: 'application', difficulty: 3,
      prompt: 'A new neighbour asks you the way from the market to your home. Give directions in 3–4 sentences using imperatives and at least two prepositions of place.',
      modelAnswer: 'Go straight on along Market Street. Turn left at the bank. My house is on the right, next to the school and opposite a small park.',
      rubric: ['At least two imperatives (go, turn, cross)', 'At least two prepositions of place used correctly (next to, opposite, between, on the left / right)', 'Place names take "the"'],
      hints: ['Go … Turn … It is … .'],
      solution: 'See the model answer.',
    },
    {
      id: 'l3-demo-where', kind: 'short-text', objectiveIds: ['lang.a1.ask-directions'], category: 'application', difficulty: 2,
      prompt: 'Complete: "Excuse me, ____ is the bus station?"',
      accepted: accept('where'),
      misconceptions: [
        { id: 'what', accepted: ['what'], feedback: '"What is the bus station?" asks for a definition. For a place use **Where**.' },
        { id: 'how', accepted: ['how'], feedback: '"How" asks about manner. For a place use **Where**.' },
        { id: 'there', accepted: ['there'], feedback: '"There is" makes a statement. The question word is **Where**.' },
      ],
      placeholder: 'one word',
      hints: ['The question word for places.'],
      solution: 'Excuse me, **where** is the bus station?',
    },
    {
      id: 'l3-demo-opposite', kind: 'short-text', objectiveIds: ['lang.a1.follow-directions'], category: 'transfer', difficulty: 3,
      prompt: 'The café is across the street from the bank. Complete: "The café is ____ the bank."',
      accepted: accept('opposite'),
      misconceptions: [
        { id: 'next-to', accepted: ['next to'], feedback: '"Next to" means beside, on the same side. Across the street is **opposite**.' },
        { id: 'behind', accepted: ['behind'], feedback: '"Behind" means at the back of it. Across the street is **opposite**.' },
        { id: 'between', accepted: ['between'], feedback: '"Between" needs two things. Across the street is **opposite**.' },
      ],
      placeholder: 'one word',
      hints: ['Across the street = …', 'o…te'],
      solution: 'The café is **opposite** the bank.',
    },
    {
      id: 'l3-demo-written', kind: 'written', objectiveIds: ['lang.a1.ask-directions', 'lang.a1.follow-directions'], category: 'explanation', difficulty: 3,
      prompt: 'Write a four-line dialogue: ask a stranger politely for a place, receive directions with an imperative and a preposition, check you understood, and say thank you.',
      modelAnswer: 'A: Excuse me, where is the post office? B: Go straight on and turn left at the school. It’s opposite the bank. A: Left at the school, opposite the bank? B: Yes. A: Thank you very much!',
      rubric: ['Opens with Excuse me and a correct Where is …? question', 'The directions use an imperative and a preposition of place', 'The asker checks by repeating or asking "Is it far?" / "Can you repeat that, please?"', 'Ends with thanks'],
      hints: ['Ask → directions → check → thank.'],
      solution: 'See the model answer.',
    },
  ],
};
