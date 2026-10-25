import type { Scenario } from '../scenario';

/**
 * Scenario 3 — Finding the library. "Where is…?", prepositions of place, imperatives.
 * Route: straight on, bank on the left; turn right at the bank; library next to the school, opposite the park.
 */
export const libraryScenario: Scenario = {
  id: 'library',
  title: 'Finding the library',
  setting: 'A busy street in the town centre. You are looking for the public library.',
  character: { name: 'Tom', role: 'a passer-by', avatar: 'passer-by' },
  turns: [
    {
      id: 'l1',
      characterLine: 'Hi there. You look lost. Can I help?',
      goal: 'Say excuse me and ask where the library is.',
      accepted: ['excuse me where is the library', 'yes please where is the library', 'excuse me is there a library near here', 'yes where is the library please'],
      patterns: ['^(excuse me |yes please |yes |sorry |hello )?(where is the library|is there a library near here|do you know where the library is|can you tell me where the library is)( please)?$'],
      feedback: [
        { id: 'what', match: ['what is the library'], message: 'To find a place ask **Where** is …?' },
        { id: 'missing-article', rule: 'missing-article', message: 'Use **the**: Where is **the** {found}?' },
        { id: 'inversion', rule: 'question-inversion', message: 'In a question the verb comes first: **Where is** the library?' },
        { id: 'no-library', missing: ['library'], message: 'Ask about the **library**.' },
      ],
      modelReply: 'Excuse me, where is the library?',
      vocabulary: ['excuse me', 'where', 'library'],
    },
    {
      id: 'l2',
      characterLine: 'The library? Sure. Do you know the bank on Market Street?',
      goal: 'Say no, sorry, you are new here.',
      accepted: ['no i am new here', 'no sorry i am new here', 'no i do not know i am new here', 'no i am new in this town'],
      patterns: ['^no( sorry)?( i do not know( it)?)?( sorry)? i am new (here|in town|in this town|in this city)$'],
      feedback: [
        { id: 'wrong-be', rule: 'wrong-be-form', message: 'With **I** use **am**: I am new here.' },
        { id: 'missing-be', rule: 'missing-be', message: 'Add the verb: I **am** new here.' },
        { id: 'said-yes', pattern: '^yes', message: 'You do not know the bank. Say **No, sorry. I am new here.**' },
        { id: 'no-new', missing: ['new'], message: 'Explain: I am **new here**.' },
      ],
      modelReply: "No, sorry. I'm new here.",
      vocabulary: ['no', 'new', 'here'],
    },
    {
      id: 'l3',
      characterLine: 'OK. Go straight on for two minutes. The bank is on the left.',
      goal: "Check you understand: repeat 'Straight on, then the bank is on the left?'",
      accepted: ['straight on then the bank is on the left', 'go straight on and the bank is on the left', 'straight on the bank is on the left', 'okay straight on then the bank is on the left'],
      patterns: ['^(okay |so )?(go )?straight on( for two minutes)?( and| then)? the bank is on the left$'],
      feedback: [
        { id: 'wrong-side', match: ['on the right'], message: 'Listen again: the bank is on the **left**.' },
        { id: 'in-left', match: ['in the left', 'at the left', 'to the left'], message: 'Say **on** the left.' },
        { id: 'missing-article', rule: 'missing-article', message: 'Use **the**: the {found}.' },
        { id: 'no-left', missing: ['left'], message: 'Say where the bank is: on the **left**.' },
      ],
      modelReply: 'OK. Straight on, then the bank is on the left?',
      vocabulary: ['straight on', 'bank', 'left'],
    },
    {
      id: 'l4',
      characterLine: 'Yes. At the bank, turn right. The library is next to the school.',
      goal: 'Ask: Is it far?',
      accepted: ['is it far', 'is it far from here', 'is the library far', 'okay is it far'],
      patterns: ['^(okay |thanks |thank you )?is (it|the library|that) far( from here| away)?$', '^(okay )?how far is it( from here)?$'],
      feedback: [
        { id: 'statement', match: ['it is far'], message: 'That is a statement. For a question put **is** first: **Is it** far?' },
        { id: 'no-far', missing: ['far'], message: 'Ask about distance with **far**: Is it far?' },
      ],
      modelReply: 'Is it far?',
      vocabulary: ['far'],
    },
    {
      id: 'l5',
      characterLine: "No, it's not far. About five minutes on foot.",
      goal: "Ask him to repeat: 'Sorry, can you say that again, please?'",
      accepted: ['sorry can you say that again please', 'can you repeat that please', 'sorry can you repeat that please', 'can you say that again please', 'pardon can you say that again please'],
      patterns: ['^(sorry |pardon |excuse me )?(can|could) you (say that again|repeat that|repeat|say it again|speak slowly|speak more slowly) please$'],
      feedback: [
        { id: 'repeating', match: ['repeating', 'saying'], message: 'After **can you** use the base form: can you **repeat** / **say**.' },
        { id: 'what', pattern: '^what$|^what did you say$', message: "'What?' is not polite. Say **Sorry, can you say that again, please?**" },
        { id: 'again-missing', match: ['say that please', 'say please'], message: 'Add **again**: say that **again**.' },
        { id: 'no-can', missing: ['can you', 'could you'], message: 'Start with **Can you …?**' },
        { id: 'no-please', rule: 'missing-please', message: 'Add **please**: Can you say that again, **please**?' },
      ],
      modelReply: 'Sorry, can you say that again, please?',
      vocabulary: ['excuse me'],
    },
    {
      id: 'l6',
      characterLine: 'Of course. Turn right at the bank. The library is next to the school, opposite the park.',
      goal: 'Repeat the directions: turn right at the bank, the library is next to the school.',
      accepted: ['turn right at the bank the library is next to the school', 'turn right at the bank and the library is next to the school', 'right at the bank then the library is next to the school', 'okay turn right at the bank the library is next to the school'],
      patterns: ['^(okay |so |thanks )?(turn |i turn |go )?right at the bank( and| then)?( the library is| it is)? next to the school( opposite the park)?$'],
      feedback: [
        { id: 'wrong-turn', match: ['turn left', 'left at the bank'], message: 'He said turn **right**.' },
        { id: 'next-the', match: ['next the school', 'next school', 'near to the school'], message: 'Say **next to the** school.' },
        { id: 'missing-article', rule: 'missing-article', message: 'Use **the**: **the** {found}.' },
        { id: 'no-next-to', missing: ['next to'], message: 'Where is the library? **Next to** the school.' },
      ],
      modelReply: 'OK: turn right at the bank, and the library is next to the school.',
      vocabulary: ['turn', 'right', 'bank', 'next to', 'school', 'library'],
    },
    {
      id: 'l7',
      characterLine: 'Perfect. Enjoy your book!',
      goal: 'Thank him and say goodbye.',
      accepted: ['thank you goodbye', 'thanks goodbye', 'thank you very much goodbye', 'thank you for your help bye', 'thanks bye'],
      patterns: ['^(thank you|thanks)( very much| a lot| so much)?( for your help)? (goodbye|bye|see you|have a nice day)$'],
      feedback: [
        { id: 'no-thanks', missing: ['thank you', 'thanks'], message: 'Say **thank you** first.' },
        { id: 'no-goodbye', missing: ['goodbye', 'bye', 'see you'], message: 'End with **Goodbye** or **See you**.' },
      ],
      modelReply: 'Thank you very much! Goodbye.',
      vocabulary: ['thank you', 'goodbye'],
    },
  ],
};
