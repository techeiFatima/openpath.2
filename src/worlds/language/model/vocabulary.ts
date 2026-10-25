/**
 * Core A1 vocabulary for Conversation Street, grouped by lesson (≤ 60 items).
 *
 * L1 support: `gloss` is an optional Dari gloss (Dari script + romanisation). Glosses are
 * filled only where the author was confident, every item carries `glossReviewed: false`,
 * and the UI shows the label below next to every gloss. No grammar explanations of Dari
 * are given anywhere in this world.
 */

export const GLOSS_REVIEW_LABEL = 'Dari gloss: awaiting native-speaker review';

export type PartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'phrase' | 'number' | 'interjection';

export type VocabularyGroup = 'neighbour' | 'market' | 'library';

export interface VocabularyItem {
  word: string;
  pos: PartOfSpeech;
  /** One short, natural A1 example sentence. */
  example: string;
  /** Dari gloss; omitted when not confident. */
  gloss?: string;
  glossReviewed: false;
}

const V = (word: string, pos: PartOfSpeech, example: string, gloss?: string): VocabularyItem => ({ word, pos, example, ...(gloss ? { gloss } : {}), glossReviewed: false });

export const VOCABULARY: Record<VocabularyGroup, VocabularyItem[]> = {
  neighbour: [
    V('hello', 'interjection', "Hello! I'm Sara.", 'سلام (salām)'),
    V('good morning', 'phrase', 'Good morning, Omar.', 'صبح بخیر (sobh bakhair)'),
    V('goodbye', 'interjection', 'Goodbye! See you soon.', 'خدا حافظ (khodā hāfez)'),
    V('name', 'noun', 'My name is Farid.', 'نام (nām)'),
    V('neighbour', 'noun', 'Sara is my neighbour.', 'همسایه (hamsāya)'),
    V('friend', 'noun', 'This is my friend Ali.', 'دوست (dōst)'),
    V('brother', 'noun', 'My brother lives with me.', 'برادر (barādar)'),
    V('student', 'noun', 'I am a student.'),
    V('from', 'preposition', 'I am from Herat.', 'از (az)'),
    V('country', 'noun', 'Afghanistan is a big country.'),
    V('city', 'noun', 'Kabul is a big city.'),
    V('new', 'adjective', 'I am new here.'),
    V('here', 'adverb', 'I live here.'),
    V('nice to meet you', 'phrase', 'Nice to meet you, Sara.'),
    V('how are you', 'phrase', 'Hello! How are you?'),
    V('fine', 'adjective', "I'm fine, thank you."),
    V('yes', 'adverb', 'Yes, I live here.', 'بله (bale)'),
    V('no', 'adverb', 'No, I am not from Kabul.', 'نه (na)'),
    V('thank you', 'phrase', 'Thank you very much.', 'تشکر (tashakor)'),
    V('excuse me', 'phrase', 'Excuse me, where is the bank?', 'ببخشید (bebakhshēd)'),
  ],
  market: [
    V('market', 'noun', 'The market is open on Saturday.', 'بازار (bāzār)'),
    V('shop', 'noun', 'Sara has a small shop.', 'دکان (dokān)'),
    V('how much', 'phrase', 'How much are the apples?'),
    V('please', 'adverb', 'Two kilos, please.', 'لطفاً (lotfan)'),
    V("I'd like", 'phrase', "I'd like six eggs, please."),
    V('apple', 'noun', 'An apple a day.', 'سیب (sēb)'),
    V('banana', 'noun', 'Bananas are yellow.', 'کیله (kēla)'),
    V('potato', 'noun', 'A kilo of potatoes, please.', 'کچالو (kachālū)'),
    V('onion', 'noun', 'Two onions, please.', 'پیاز (piyāz)'),
    V('bread', 'noun', 'Do you have bread?', 'نان (nān)'),
    V('egg', 'noun', 'Six eggs, please.', 'تخم (tokhm)'),
    V('milk', 'noun', 'A bottle of milk is one pound.', 'شیر (shīr)'),
    V('tea', 'noun', 'I like green tea.', 'چای (chāy)'),
    V('kilo', 'noun', 'Two kilos of apples, please.'),
    V('bag', 'noun', 'Do you want a bag?'),
    V('bottle', 'noun', 'One bottle of milk, please.'),
    V('money', 'noun', 'Here is the money.'),
    V('cheap', 'adjective', 'The onions are cheap.'),
    V('expensive', 'adjective', 'The tea is expensive.'),
    V('one', 'number', 'One bottle, please.', 'یک (yak)'),
    V('two', 'number', 'Two kilos, please.', 'دو (du)'),
    V('three', 'number', 'Three pounds a kilo.'),
    V('ten', 'number', 'Ten eggs, please.'),
  ],
  library: [
    V('library', 'noun', 'The library is next to the school.', 'کتابخانه (ketābkhāna)'),
    V('book', 'noun', 'I need a book.', 'کتاب (ketāb)'),
    V('where', 'adverb', 'Where is the bank?', 'کجا (kojā)'),
    V('street', 'noun', 'The bank is on Market Street.', 'سرک (sarak)'),
    V('left', 'adverb', 'The bank is on the left.', 'چپ (chap)'),
    V('right', 'adverb', 'Turn right at the bank.', 'راست (rāst)'),
    V('straight on', 'phrase', 'Go straight on for two minutes.'),
    V('near', 'preposition', 'Is there a bank near here?', 'نزدیک (nazdīk)'),
    V('far', 'adjective', 'Is it far?'),
    V('next to', 'preposition', 'The library is next to the school.'),
    V('opposite', 'preposition', 'The café is opposite the bank.', 'مقابل (moqābel)'),
    V('behind', 'preposition', 'The park is behind the library.'),
    V('between', 'preposition', 'The library is between the school and the park.', 'بین (bain)'),
    V('bank', 'noun', 'The bank is on the left.', 'بانک (bānk)'),
    V('school', 'noun', 'The library is next to the school.', 'مکتب (maktab)'),
    V('turn', 'verb', 'Turn left at the bank.'),
    V('go', 'verb', 'Go straight on.'),
  ],
};

export const ALL_VOCABULARY: VocabularyItem[] = [...VOCABULARY.neighbour, ...VOCABULARY.market, ...VOCABULARY.library];

export function vocabularyFor(group: VocabularyGroup): VocabularyItem[] {
  return VOCABULARY[group];
}

export function findVocabulary(word: string): VocabularyItem | undefined {
  const w = word.toLowerCase();
  return ALL_VOCABULARY.find((v) => v.word.toLowerCase() === w);
}
