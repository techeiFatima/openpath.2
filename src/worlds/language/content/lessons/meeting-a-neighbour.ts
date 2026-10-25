import type { LessonSpec } from '@/core/world/spec';
import { accept } from '../answers';

/**
 * Lesson 1 — Meeting a neighbour (scenario `neighbour`).
 * Reference answers:
 *   l1-polite-greeting: a        l1-fill-name: My            l1-fill-be-from: am / 'm
 *   l1-fill-she-is: is / 's      l1-pronoun-mc: b            l1-error-id: a
 *   l1-fill-and-you: And         l1-written-intro: (rubric)
 *   l1-apply-meet: meet          l1-apply-he: He             l1-apply-written: (rubric)
 *   l1-demo-are: are             l1-demo-is-not: is / 's     l1-demo-written: (rubric)
 */
export const meetingANeighbour: LessonSpec = {
  id: 'language.meeting-a-neighbour',
  worldId: 'conversation',
  title: 'Meeting a neighbour',
  subtitle: 'Hello, my name is… Where are you from?',
  minutes: 35,
  objectiveIds: ['lang.a1.greet-introduce', 'lang.a1.be-present'],
  prerequisiteObjectiveIds: [],
  standardRefs: [{ framework: 'CEFR', code: 'A1', summary: 'Introduce yourself and exchange basic personal details.', verified: false }],
  accessibilitySummary:
    'The environment is a scripted conversation. A neighbour called Sara speaks one line at a time; a goal line tells you what to say; you type a reply and press Send. A coach line gives rule-based feedback when a reply is not accepted; after two tries a model reply is shown and the conversation moves on. A phrasebook lists the lesson vocabulary with example sentences, and a readout counts turns, re-prompts and words used.',
  validationTests: ['scenario.test.ts: an accepted reply advances', 'scenario.test.ts: after two re-prompts the engine shows the model reply', 'grammar.test.ts: checkBe', 'content.test.ts: every model reply is accepted'],
  mastery: [
    { objectiveId: 'lang.a1.greet-introduce', level: 'proficient' },
    { objectiveId: 'lang.a1.be-present', level: 'mastered' },
  ],
  stages: [
    {
      kind: 'discover',
      title: 'Someone at the door',
      presets: ['scenario:neighbour'],
      blocks: [
        { type: 'text', md: 'You have just moved into a new flat. A woman from the flat next door comes to say hello. In English, first meetings follow a small, fixed pattern. Guess the pattern before you hear it.' },
        {
          type: 'prediction',
          id: 'pred-first-line',
          question: 'Sara sees you at your door. What will she say **first**?',
          options: [
            { id: 'greet', text: "Hello! I'm Sara." },
            { id: 'from', text: 'Where are you from?' },
            { id: 'bye', text: 'Goodbye.' },
          ],
          correctId: 'greet',
          revealPreset: 'scenario:neighbour',
          explanation: 'People start with a greeting and their name. Questions like "Where are you from?" come after the names.',
        },
        {
          type: 'prediction',
          id: 'pred-polite-reply',
          question: 'Sara says "Hello! I’m Sara." Which reply is polite and natural?',
          options: [
            { id: 'full', text: "Hello, Sara. I'm Amina." },
            { id: 'name-only', text: 'Amina.' },
            { id: 'question', text: 'You live here?' },
          ],
          correctId: 'full',
          revealPreset: 'scenario:neighbour',
          explanation: 'Answer a greeting with a greeting, then give your name with **I’m …** or **My name is …**. One word alone sounds cold.',
        },
      ],
    },
    {
      kind: 'explore',
      title: 'Talk to Sara',
      presets: ['scenario:neighbour'],
      blocks: [
        { type: 'text', md: 'Read Sara’s line, read the **goal**, type your reply and press **Send**. Use **Listen** to hear her line if your browser can speak. If a reply is not accepted the coach tells you what to change; after two tries you see a model reply.' },
        {
          type: 'sim-task',
          preset: 'scenario:neighbour',
          instructions: 'Run the whole conversation once. Then press **Restart** and do it again with different information: another name, another city. On the second run, type **I from Kabul** once on purpose and read the coach’s feedback.',
          observe: [
            'What the coach says when you leave out **am** ("I from Kabul")',
            'Which replies Sara accepts for "How are you?" (try "Fine, thanks. And you?")',
            'How many turns you completed without a model reply (see the readout)',
            'Which phrasebook words you used, and which ones you did not',
          ],
        },
        { type: 'callout', tone: 'assumption', md: 'Sara follows a script. She does not understand your reply; the program checks it against accepted patterns for that turn. The feedback is rule-based and limited to a few A1 patterns, so a reply with no feedback is not proof that it is perfect.' },
      ],
    },
    {
      kind: 'understand',
      title: 'The verb be and the greeting pattern',
      presets: ['scenario:neighbour'],
      blocks: [
        { type: 'text', md: 'Almost every line in this conversation uses the verb **be**: *I am Amina. I am from Herat. She is my neighbour.* The form changes with the subject:' },
        {
          type: 'equation',
          latex: '\\begin{array}{lll} \\text{I} & \\text{am} & \\text{I\\textquotesingle m} \\\\ \\text{you} & \\text{are} & \\text{you\\textquotesingle re} \\\\ \\text{he / she / it} & \\text{is} & \\text{he\\textquotesingle s, she\\textquotesingle s, it\\textquotesingle s} \\\\ \\text{we / they} & \\text{are} & \\text{we\\textquotesingle re, they\\textquotesingle re} \\end{array}',
          caption: 'Subject, long form, short form. Both forms are correct; the short form is more common in speech.',
        },
        { type: 'text', md: 'In a **question**, the verb moves in front of the subject: *You are from Kabul.* → *Are you from Kabul?* *She is your neighbour.* → *Is she your neighbour?* *Where are you from?*' },
        { type: 'text', md: 'The first-meeting pattern has four fixed moves. **Greet:** Hello / Hi / Good morning. **Name:** I’m … / My name is … **Reply to a greeting:** Nice to meet you. **How are you?** → I’m fine, thank you. And you?' },
        { type: 'text', md: 'Two more small rules from the conversation. Jobs take **a**: *I am **a** student.* After *he*, *she* or a name, a present verb takes **-s**: *My brother live**s** with me.*' },
        { type: 'callout', tone: 'note', md: 'The coach in this world checks only a few things: the verb **be** after *I*, agreement slips like *I is*, a missing **a / the** before some common nouns, and whether a question starts with its verb. It does not check spelling, capital letters or punctuation. Treat its silence as "no rule fired", not as "correct".' },
        { type: 'summary', points: ['I **am**, you **are**, he / she / it **is**, we / they **are**.', 'Questions put the verb first: *Where **are** you from?*', 'Greet → name → "Nice to meet you" → "How are you?" → "Fine, thank you. And you?"', 'Jobs take **a**: *I am a student.*'] },
      ],
    },
    {
      kind: 'practice',
      title: 'Practice',
      presets: ['scenario:neighbour'],
      blocks: [
        { type: 'text', md: 'Type one or two words where there is a gap. Short forms (**’m**, **’s**) are accepted where they are natural. The conversation stays open on the right if you want to check a phrase.' },
        { type: 'problem', problemId: 'l1-polite-greeting' },
        { type: 'problem', problemId: 'l1-fill-name' },
        { type: 'problem', problemId: 'l1-fill-be-from' },
        { type: 'problem', problemId: 'l1-fill-she-is' },
        { type: 'problem', problemId: 'l1-pronoun-mc' },
        { type: 'problem', problemId: 'l1-error-id' },
        { type: 'problem', problemId: 'l1-fill-and-you' },
        { type: 'problem', problemId: 'l1-written-intro' },
      ],
    },
    {
      kind: 'apply',
      title: 'A new person, a new place',
      presets: ['scenario:neighbour'],
      blocks: [
        { type: 'text', md: 'Same pattern, different people. Run the conversation again and this time say you are from a **different** city and give a **different** name; Sara accepts any name and place. Then try these.' },
        { type: 'problem', problemId: 'l1-apply-meet' },
        { type: 'problem', problemId: 'l1-apply-he' },
        { type: 'problem', problemId: 'l1-apply-written' },
      ],
    },
    {
      kind: 'demonstrate',
      title: 'Show what you know',
      blocks: [
        { type: 'text', md: 'The conversation and the phrasebook are hidden for this stage. Answer without hints to earn full mastery credit.' },
        { type: 'problem', problemId: 'l1-demo-are' },
        { type: 'problem', problemId: 'l1-demo-is-not' },
        { type: 'problem', problemId: 'l1-demo-written' },
      ],
    },
    {
      kind: 'review',
      title: 'Review',
      blocks: [
        { type: 'summary', points: ['Greet, give your name, say where you are from, answer "How are you?" and ask back.', 'am / is / are change with the subject; questions put the verb first.', 'Jobs take **a**; after he / she / a name the verb takes **-s**.'] },
        { type: 'text', md: 'Your mastery for each objective is below. Objectives at *developing* come back for a short review in a few days. Next lesson: **At the market**, where you will ask prices and use numbers.' },
      ],
    },
  ],
  problems: [
    {
      id: 'l1-polite-greeting', kind: 'multiple-choice', objectiveIds: ['lang.a1.greet-introduce'], category: 'conceptual', difficulty: 1,
      prompt: 'A new neighbour says "Hello! I’m Sara." Which reply is the best start?',
      options: [
        { id: 'a', text: "Hello, Sara. I'm Farid.", feedback: 'Correct: greeting, her name, then your name with I’m.' },
        { id: 'b', text: 'You. Name?', feedback: 'This is not a sentence and sounds rude. Greet her and use "I’m …" or "My name is …".' },
        { id: 'c', text: 'Give me your name.', feedback: 'She already gave her name, and "Give me" sounds like an order.' },
      ],
      correctId: 'a',
      hints: ['Answer a greeting with a greeting.', 'Then give your name: "I’m …" or "My name is …".'],
      solution: 'Hello, Sara. I’m Farid. (Greet → her name → your name.)',
    },
    {
      id: 'l1-fill-name', kind: 'short-text', objectiveIds: ['lang.a1.greet-introduce'], category: 'procedural', difficulty: 1,
      prompt: 'Complete: "____ name is Farid."',
      accepted: accept('My'),
      misconceptions: [
        { id: 'subject-pronoun', accepted: ['I'], feedback: '"I" is the subject pronoun. Before "name" you need the possessive: **My** name is Farid.' },
        { id: 'object-pronoun', accepted: ['Me'], feedback: '"Me" is the object form (as in "with me"). Use the possessive **My**.' },
        { id: 'the', accepted: ['The'], feedback: '"The name" does not say whose name. Use **My**.' },
      ],
      placeholder: 'one word',
      hints: ['Whose name is it?', 'The possessive word that goes with "I" is …'],
      solution: '**My** name is Farid. (I → my, you → your, he → his, she → her.)',
    },
    {
      id: 'l1-fill-be-from', kind: 'short-text', objectiveIds: ['lang.a1.be-present'], category: 'procedural', difficulty: 1,
      prompt: 'Complete: "I ____ from Herat."',
      accepted: accept('am', "'m"),
      misconceptions: [
        { id: 'is-with-i', accepted: ['is'], feedback: '"is" goes with he, she and it. With **I** use **am**.' },
        { id: 'are-with-i', accepted: ['are'], feedback: '"are" goes with you, we and they. With **I** use **am**.' },
        { id: 'come', accepted: ['come'], feedback: '"I come from Herat" is also good English, but this gap asks for the verb **be**: I **am** from Herat.' },
      ],
      placeholder: 'am / is / are',
      hints: ['Which form of be goes with I?', 'I … , you are, he is.'],
      solution: 'I **am** from Herat (or I’m from Herat).',
    },
    {
      id: 'l1-fill-she-is', kind: 'short-text', objectiveIds: ['lang.a1.be-present'], category: 'procedural', difficulty: 1,
      prompt: 'Complete: "This is Sara. She ____ my neighbour."',
      accepted: accept('is', "'s"),
      misconceptions: [
        { id: 'am-with-she', accepted: ['am'], feedback: '"am" goes only with I. With **she** use **is**.' },
        { id: 'are-with-she', accepted: ['are'], feedback: '"are" goes with you, we and they. With **she** use **is**.' },
      ],
      placeholder: 'am / is / are',
      hints: ['She is one person, not you and not me.', 'he / she / it + …'],
      solution: 'She **is** my neighbour (or She’s my neighbour).',
    },
    {
      id: 'l1-pronoun-mc', kind: 'multiple-choice', objectiveIds: ['lang.a1.be-present'], category: 'procedural', difficulty: 2,
      prompt: 'Choose the correct sentence.',
      options: [
        { id: 'a', text: 'They is from Mazar.', feedback: '"is" is for he, she, it. They → are.' },
        { id: 'b', text: 'They are from Mazar.', feedback: 'Correct: they → are.' },
        { id: 'c', text: 'They am from Mazar.', feedback: '"am" goes only with I. They → are.' },
      ],
      correctId: 'b',
      hints: ['Look at the subject: they.', 'we / they take the same form as you.'],
      solution: 'They **are** from Mazar.',
    },
    {
      id: 'l1-error-id', kind: 'multiple-choice', objectiveIds: ['lang.a1.be-present'], category: 'error-identification', difficulty: 2,
      prompt: 'A learner writes: *"I from Kabul."* What is wrong?',
      options: [
        { id: 'a', text: 'The verb **am** is missing: "I am from Kabul."', feedback: 'Correct. English needs the verb be here, even though some languages do not.' },
        { id: 'b', text: 'The word **the** is missing: "I from the Kabul."', feedback: 'City names do not take "the". The problem is the missing verb.' },
        { id: 'c', text: 'Nothing. The sentence is correct.', feedback: 'Read it again slowly: I … from Kabul. A verb is missing.' },
      ],
      correctId: 'a',
      hints: ['Every English sentence needs a verb.', 'I ___ from Kabul: which form of be?'],
      solution: 'The sentence has no verb. Correct: **I am** from Kabul / I’m from Kabul.',
    },
    {
      id: 'l1-fill-and-you', kind: 'short-text', objectiveIds: ['lang.a1.greet-introduce'], category: 'procedural', difficulty: 2,
      prompt: 'Sara asks "How are you?" Complete the polite reply that asks her back: "I’m fine, thank you. ____ you?"',
      accepted: accept('And'),
      misconceptions: [
        { id: 'how', accepted: ['How'], feedback: '"How you?" is missing a verb. The short polite form is **And you?** (or the full "How are you?").' },
        { id: 'are', accepted: ['Are'], feedback: '"Are you?" on its own is not a complete question here. Use **And you?**' },
        { id: 'you', accepted: ['You'], feedback: '"You you?" repeats the word. The reply is **And** you?' },
      ],
      placeholder: 'one word',
      hints: ['It is a very short question that returns the same question to her.', 'It starts with the same letter as "also".'],
      solution: 'I’m fine, thank you. **And** you?',
    },
    {
      id: 'l1-written-intro', kind: 'written', objectiveIds: ['lang.a1.greet-introduce', 'lang.a1.be-present'], category: 'explanation', difficulty: 2,
      prompt: 'Write a short introduction (3–4 sentences): greet the reader, give your name, say where you are from, and say one thing about your family. Use the verb **be** at least twice.',
      modelAnswer: 'Hello! My name is Amina. I am from Herat, in Afghanistan. I live here with my brother; he is a student.',
      rubric: ['Starts with a greeting (Hello / Hi / Good morning)', 'Gives the name with "My name is …" or "I’m …"', 'Uses "I am from …" (or I’m from …) with the correct form of be', 'Says one thing about family with a correct verb (he/she is …, my brother lives …)'],
      hints: ['Greet → name → from → family.'],
      solution: 'See the model answer; check each rubric line.',
    },
    {
      id: 'l1-apply-meet', kind: 'short-text', objectiveIds: ['lang.a1.greet-introduce'], category: 'transfer', difficulty: 2,
      prompt: 'A new classmate at the bus stop says: "Hi, I’m Yusuf." Complete your reply: "Hi, Yusuf. Nice to ____ you. I’m Farid."',
      accepted: accept('meet'),
      misconceptions: [
        { id: 'meeting', accepted: ['meeting'], feedback: 'After "nice to" use the base form: nice to **meet** you.' },
        { id: 'see', accepted: ['see'], feedback: '"Nice to see you" is for someone you already know. For a first meeting say nice to **meet** you.' },
        { id: 'know', accepted: ['know'], feedback: '"Nice to know you" is not the usual phrase. Say nice to **meet** you.' },
      ],
      placeholder: 'one word',
      hints: ['It is the fixed phrase for a first meeting.', 'Nice to m… you.'],
      solution: 'Nice to **meet** you.',
    },
    {
      id: 'l1-apply-he', kind: 'short-text', objectiveIds: ['lang.a1.be-present'], category: 'transfer', difficulty: 2,
      prompt: 'Introduce your friend to Sara. Complete: "This is Farid. ____ is my friend. He is from Kabul too."',
      accepted: accept('He'),
      misconceptions: [
        { id: 'she', accepted: ['She'], feedback: 'Farid is a man, so the pronoun is **He**.' },
        { id: 'his', accepted: ['His'], feedback: '"His" is possessive (his friend). The subject pronoun is **He**.' },
        { id: 'him', accepted: ['Him'], feedback: '"Him" is the object form (with him). The subject is **He**.' },
        { id: 'this', accepted: ['This', 'It'], feedback: 'For a person use **He** (or She).' },
      ],
      placeholder: 'one word',
      hints: ['Which pronoun replaces "Farid"?', 'The next sentence already uses it.'],
      solution: 'This is Farid. **He** is my friend.',
    },
    {
      id: 'l1-apply-written', kind: 'written', objectiveIds: ['lang.a1.greet-introduce'], category: 'application', difficulty: 3,
      prompt: 'Sara introduces her sister: "This is Laila." Write 2–3 sentences to greet Laila, give your name and say where you live.',
      modelAnswer: 'Hello, Laila. Nice to meet you. I’m Amina and I live in flat four, next to Sara.',
      rubric: ['Greets Laila by name', 'Uses "Nice to meet you"', 'Gives the name and the place with a correct verb (I’m …, I live in …)'],
      hints: ['Greet → nice to meet you → name → where you live.'],
      solution: 'See the model answer.',
    },
    {
      id: 'l1-demo-are', kind: 'short-text', objectiveIds: ['lang.a1.be-present'], category: 'application', difficulty: 2,
      prompt: 'Complete the question. A: "Where ____ you from?" B: "I’m from Mazar."',
      accepted: accept('are'),
      misconceptions: [
        { id: 'is-with-you', accepted: ['is'], feedback: '"is" goes with he, she and it. With **you** use **are**.' },
        { id: 'am-with-you', accepted: ['am'], feedback: '"am" goes only with I. With **you** use **are**.' },
        { id: 'do', accepted: ['do'], feedback: '"Where do you from?" has no main verb. With "from" use be: Where **are** you from?' },
      ],
      placeholder: 'am / is / are',
      hints: ['The subject is you.', 'you → are.'],
      solution: 'Where **are** you from?',
    },
    {
      id: 'l1-demo-is-not', kind: 'short-text', objectiveIds: ['lang.a1.be-present'], category: 'transfer', difficulty: 3,
      prompt: 'Complete. A: "Is Omar your brother?" B: "No, he ____ not my brother. He is my friend."',
      accepted: accept('is', "'s"),
      misconceptions: [
        { id: 'are-with-he', accepted: ['are'], feedback: '"are" goes with you, we and they. With **he** use **is**: he is not.' },
        { id: 'am-with-he', accepted: ['am'], feedback: '"am" goes only with I. With **he** use **is**.' },
        { id: 'do', accepted: ['do', 'does'], feedback: 'With "not my brother" the verb is be, not do: he **is** not my brother.' },
      ],
      placeholder: 'am / is / are',
      hints: ['he → …'],
      solution: 'No, he **is** not my brother (he isn’t / he’s not).',
    },
    {
      id: 'l1-demo-written', kind: 'written', objectiveIds: ['lang.a1.greet-introduce', 'lang.a1.be-present'], category: 'explanation', difficulty: 3,
      prompt: 'Write a short dialogue of four lines between you and a new neighbour: a greeting with names, a question about where you are from with its answer, and a goodbye.',
      modelAnswer: 'A: Hello! I’m Sara. B: Hi, Sara. My name is Farid. A: Where are you from, Farid? B: I’m from Kabul. Nice to meet you. Goodbye!',
      rubric: ['Both speakers greet and give names', 'The question uses "Where are you from?" with are', 'The answer uses "I am / I’m from …"', 'Ends with a goodbye'],
      hints: ['Greeting + names, where from, goodbye.'],
      solution: 'See the model answer.',
    },
  ],
};
