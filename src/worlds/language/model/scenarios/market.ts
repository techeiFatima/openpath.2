import type { Scenario, Turn } from '../scenario';

const THANK_AND_GOODBYE: Pick<Turn, 'accepted' | 'patterns' | 'feedback'> = {
  accepted: ['thank you goodbye', 'thanks goodbye', 'thank you bye', 'thank you have a nice day too', 'thanks you too goodbye'],
  patterns: ['^(thank you|thanks)( very much)?( you too| and you)? (goodbye|bye|see you|have a nice day( too)?)( goodbye| bye)?$'],
  feedback: [
    { id: 'no-thanks', missing: ['thank you', 'thanks'], message: 'Say **thank you** first.' },
    { id: 'no-goodbye', missing: ['goodbye', 'bye', 'see you', 'have a nice day'], message: 'End with **Goodbye** or **See you**.' },
  ],
};

/**
 * Scenario 2 — At the market. Numbers, quantities, "How much…?", "I'd like…", please/thank you.
 * Prices: apples 2 pounds a kilo; six eggs 1 pound; a bottle of milk 1 pound → total 6 pounds.
 */
export const marketScenario: Scenario = {
  id: 'market',
  title: 'At the market',
  setting: 'A fruit and vegetable stall at the Saturday market.',
  character: { name: 'Omar', role: 'the shopkeeper', avatar: 'shopkeeper' },
  turns: [
    {
      id: 'm1',
      characterLine: 'Good morning! Can I help you?',
      goal: 'Say good morning and ask how much the apples cost.',
      accepted: ['good morning how much are the apples', 'good morning how much do the apples cost', 'hello how much are the apples', 'good morning how much is a kilo of apples'],
      patterns: ['^(good morning |hello |hi )?(yes please )?how much ((are|do) (the |your )?apples( cost)?|is (a|one) kilo of apples|are (the )?apples (a|per) kilo)( please)?$'],
      feedback: [
        { id: 'how-many', match: ['how many'], message: '**How many** counts things. For a price ask **How much…?**' },
        { id: 'what-cost', match: ['what cost', 'what price', 'what is the price'], message: 'Ask: **How much are the apples?**' },
        { id: 'plural-is', match: ['is the apples', 'is apples', 'is your apples'], message: 'Apples is plural: How much **are** the apples?' },
        { id: 'inversion', rule: 'question-inversion', message: 'Put the verb right after **how much**: How much **are** the apples? / How much **do** the apples cost?' },
        { id: 'no-how-much', missing: ['how much'], message: 'Ask the price with **How much…?**' },
      ],
      modelReply: 'Good morning! How much are the apples?',
      vocabulary: ['good morning', 'how much', 'apple'],
    },
    {
      id: 'm2',
      characterLine: 'The apples are two pounds a kilo. Very sweet!',
      goal: 'Ask for two kilos of apples, politely.',
      accepted: ['two kilos of apples please', 'i would like two kilos of apples please', 'can i have two kilos of apples please', 'two kilos please'],
      patterns: ['^(i would like |i want |can i have |could i have |i will take |i will have )?two kilos( of apples)?( please)$'],
      feedback: [
        { id: 'plural', rule: 'plural-after-number', message: 'After **two** use the plural: two **{found}s**.' },
        { id: 'give-me', match: ['give me'], message: "'Give me' sounds rude. Say **Can I have …, please?** or **I'd like …, please.**" },
        { id: 'wrong-amount', match: ['one kilo', 'a kilo', 'three kilos'], message: 'You want **two** kilos.' },
        { id: 'no-please', rule: 'missing-please', message: 'Add **please** at the end: Two kilos of apples, **please**.' },
      ],
      modelReply: "I'd like two kilos of apples, please.",
      vocabulary: ['two', 'kilo', 'please', "I'd like", 'apple'],
    },
    {
      id: 'm3',
      characterLine: 'Two kilos. Here you are. Anything else?',
      goal: 'Say yes and ask for six eggs.',
      accepted: ['yes six eggs please', 'yes i would like six eggs please', 'yes can i have six eggs please', 'yes six eggs'],
      patterns: ['^yes( please)?( i would like| can i have| i want| and)? six eggs( please)?$'],
      feedback: [
        { id: 'plural', rule: 'plural-after-number', message: 'After **six** use the plural: six **{found}s**.' },
        { id: 'said-no', pattern: '^no', message: 'Say **yes**: you need six eggs.' },
        { id: 'no-eggs', missing: ['egg', 'eggs'], message: 'Ask for **six eggs**.' },
        { id: 'wrong-number', missing: ['six'], message: 'You need **six** eggs.' },
      ],
      modelReply: 'Yes, six eggs, please.',
      vocabulary: ['egg', 'yes', 'please'],
    },
    {
      id: 'm4',
      characterLine: "Six eggs, that's one pound. Do you need any bread?",
      goal: 'Say no, thank you, and ask if he has milk.',
      accepted: ['no thank you do you have milk', 'no thanks do you have milk', 'no thank you have you got milk', 'no thank you do you have any milk'],
      patterns: ['^no( thank you| thanks)( but)? (do you have|have you got|do you sell) (any )?milk( please)?$'],
      feedback: [
        { id: 'milks', match: ['milks'], message: 'Milk is uncountable: no **-s**. Do you have milk?' },
        { id: 'no-thanks', missing: ['thank you', 'thanks'], message: 'Say **No, thank you.** first.' },
        { id: 'no-do', pattern: '(thank you|thanks) (but )?you have', message: 'Questions start with **Do**: **Do you have** milk?' },
        { id: 'want-milk', match: ['i want milk', 'i need milk', 'i would like milk'], message: 'Ask a question: **Do you have milk?**' },
        { id: 'no-milk', missing: ['milk'], message: 'Ask about **milk**: Do you have milk?' },
      ],
      modelReply: 'No, thank you. Do you have milk?',
      vocabulary: ['no', 'thank you', 'milk'],
    },
    {
      id: 'm5',
      characterLine: 'Yes, a bottle of milk is one pound. Do you want one?',
      goal: 'Say yes, one bottle, please.',
      accepted: ['yes one bottle please', 'yes please one bottle', 'yes one bottle of milk please', 'yes please'],
      patterns: ['^(?=.*\\bplease\\b)yes( please)?( (one|a) bottle( of milk)?)?( please)?$'],
      feedback: [
        { id: 'said-no', pattern: '^no', message: 'Say **yes**: you want one bottle.' },
        { id: 'bottles', match: ['bottles'], message: 'Just one: one **bottle**.' },
        { id: 'i-want', match: ['i want'], message: "'I want' sounds direct. Say **Yes, please.**" },
        { id: 'no-please', rule: 'missing-please', message: 'Add **please**: Yes, one bottle, please.' },
      ],
      modelReply: 'Yes, one bottle, please.',
      vocabulary: ['one', 'bottle', 'please'],
    },
    {
      id: 'm6',
      characterLine: 'Here you are. Anything else?',
      goal: "Say no, that's all, and ask how much it is altogether.",
      accepted: ['no thank you how much is it', 'no thanks how much is that', 'that is all how much is it', 'no that is all how much is it altogether', 'no thank you how much is everything'],
      patterns: ['^(no( thank you| thanks)?( that is all)?|that is all|that is everything) how much is (it|that|everything|all that|all)( altogether| in total| all together)?( please)?$'],
      feedback: [
        { id: 'are-it', match: ['how much are it', 'how much are that'], message: 'It/that is singular: How much **is** it?' },
        { id: 'inversion', rule: 'question-inversion', message: 'Put **is** right after how much: How much **is** it?' },
        { id: 'said-yes', pattern: '^yes', message: "You do not need anything else: say **No, that's all.**" },
        { id: 'no-how-much', missing: ['how much'], message: 'Ask the total: **How much is it?**' },
      ],
      modelReply: "No, that's all. How much is it?",
      vocabulary: ['how much', 'no', 'thank you'],
    },
    {
      id: 'm7',
      characterLine: "Let's see… two kilos of apples, six eggs and a bottle of milk. That's six pounds, please.",
      goal: "Give him the money: say 'Here you are.'",
      accepted: ['here you are', 'here you are six pounds', 'okay here you are', 'here is six pounds', 'here you go'],
      patterns: ['^(okay |yes |six pounds )?(here you are|here you go|here is six pounds|here are six pounds)( six pounds)?$'],
      feedback: [
        { id: 'take', match: ['take'], message: "'Take' sounds rude here. Say **Here you are.**" },
        { id: 'here-is-you', match: ['here is you', 'here are you'], message: 'The phrase is **Here you are.**' },
        { id: 'no-here', missing: ['here'], message: 'Hand over the money with **Here you are.**' },
      ],
      modelReply: 'Here you are.',
      vocabulary: ['here'],
    },
    {
      id: 'm8',
      characterLine: "Thank you. And here's your change. Have a nice day!",
      goal: 'Thank him and say goodbye.',
      ...THANK_AND_GOODBYE,
      modelReply: 'Thank you! Goodbye.',
      vocabulary: ['thank you', 'goodbye'],
    },
  ],
};

/**
 * Transfer variant for the Apply stage: same stall, different items and prices.
 * Oranges 3 pounds a kilo × 3 kilos = 9; one loaf of bread 2 pounds → 11 pounds.
 */
export const marketVariantScenario: Scenario = {
  id: 'market-variant',
  title: 'At the market: oranges and bread',
  setting: 'The same stall, one week later. New items, new prices.',
  character: marketScenario.character,
  turns: [
    {
      id: 'v1',
      characterLine: 'Hello again! What can I get you today?',
      goal: 'Ask how much the oranges cost.',
      accepted: ['how much are the oranges', 'how much do the oranges cost', 'hello how much are the oranges'],
      patterns: ['^(hello |hi |good morning )?how much ((are|do) (the |your )?oranges( cost)?|is (a|one) kilo of oranges)( please)?$'],
      feedback: [
        { id: 'how-many', match: ['how many'], message: '**How many** counts things. For a price ask **How much…?**' },
        { id: 'plural-is', match: ['is the oranges', 'is oranges'], message: 'Oranges is plural: How much **are** the oranges?' },
        { id: 'inversion', rule: 'question-inversion', message: 'Put the verb right after **how much**: How much **are** the oranges?' },
        { id: 'no-how-much', missing: ['how much'], message: 'Ask the price with **How much…?**' },
      ],
      modelReply: 'Hello! How much are the oranges?',
      vocabulary: ['how much', 'hello'],
    },
    {
      id: 'v2',
      characterLine: 'Three pounds a kilo.',
      goal: 'Ask for three kilos of oranges, politely.',
      accepted: ['three kilos of oranges please', 'can i have three kilos of oranges please', 'i would like three kilos of oranges please'],
      patterns: ['^(i would like |i want |can i have |could i have )?three kilos( of oranges)?( please)$'],
      feedback: [
        { id: 'plural', rule: 'plural-after-number', message: 'After **three** use the plural: three **{found}s**.' },
        { id: 'give-me', match: ['give me'], message: "'Give me' sounds rude. Say **Can I have …, please?**" },
        { id: 'wrong-amount', match: ['two kilos', 'one kilo', 'a kilo'], message: 'You want **three** kilos.' },
        { id: 'no-please', rule: 'missing-please', message: 'Add **please** at the end.' },
      ],
      modelReply: 'Can I have three kilos of oranges, please?',
      vocabulary: ['three', 'kilo', 'please'],
    },
    {
      id: 'v3',
      characterLine: 'Three kilos. Anything else?',
      goal: 'Ask if he has bread.',
      accepted: ['do you have bread', 'have you got bread', 'do you have any bread', 'yes do you have bread'],
      patterns: ['^(yes |yes please )?(do you have|have you got|do you sell) (any )?bread( please)?$'],
      feedback: [
        { id: 'breads', match: ['breads'], message: 'Bread is uncountable: no **-s**. Do you have bread?' },
        { id: 'no-do', pattern: '^(yes )?you have', message: 'Questions start with **Do**: **Do you have** bread?' },
        { id: 'no-bread', missing: ['bread'], message: 'Ask about **bread**.' },
      ],
      modelReply: 'Yes. Do you have bread?',
      vocabulary: ['bread', 'yes'],
    },
    {
      id: 'v4',
      characterLine: "Yes, one loaf is two pounds. So that's eleven pounds altogether.",
      goal: "Check the total by repeating it: 'Eleven pounds?' Then hand over the money.",
      accepted: ['eleven pounds', 'eleven pounds here you are', 'okay eleven pounds here you are', 'eleven pounds okay'],
      patterns: ['^(okay |so )?eleven pounds( okay| here you are| please)?$', '^(okay )?here you are( eleven pounds)?$'],
      feedback: [
        { id: 'wrong-total', match: ['nine pounds', 'ten pounds', 'twelve pounds', 'six pounds'], message: 'Three kilos at three pounds is nine, plus two for the bread: **eleven** pounds.' },
        { id: 'pound-singular', pattern: '\\beleven pound\\b', message: 'After eleven use the plural: eleven pound**s**.' },
        { id: 'no-total', missing: ['eleven', 'here you are'], message: "Repeat the total: **Eleven pounds?** Then say 'Here you are.'" },
      ],
      modelReply: 'Eleven pounds. Here you are.',
      vocabulary: ['here'],
    },
    {
      id: 'v5',
      characterLine: 'Thanks! See you next week.',
      goal: 'Say goodbye.',
      accepted: ['goodbye', 'bye', 'see you', 'thank you goodbye', 'see you next week'],
      patterns: ['^(thank you |thanks )?(goodbye|bye|see you( next week| soon)?)$'],
      feedback: [{ id: 'no-goodbye', missing: ['goodbye', 'bye', 'see you'], message: 'Say **Goodbye** or **See you**.' }],
      modelReply: 'Thank you. See you!',
      vocabulary: ['goodbye', 'thank you'],
    },
  ],
};
