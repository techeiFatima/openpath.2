import { describe, expect, it } from 'vitest';
import { checkBe, checkQuestionInversion, digitsToWords, hasPoliteness, missingArticle, missingPluralAfterNumber, runRule, tokens } from './grammar';

describe('tokens', () => {
  it('lower-cases and strips punctuation but keeps apostrophes', () => {
    expect(tokens("Hello! I'm Sara.")).toEqual(['hello', "i'm", 'sara']);
  });
});

describe('missingArticle', () => {
  it('flags a bare singular countable noun from the fixed list', () => {
    expect(missingArticle('i would like apple')).toBe('apple');
    expect(missingArticle('i am student')).toBe('student');
    expect(missingArticle('where is library')).toBe('library');
    expect(missingArticle('next to school')).toBe('school');
  });
  it('accepts determiners, possessives and numbers before the noun', () => {
    expect(missingArticle('i would like an apple')).toBeNull();
    expect(missingArticle('i am a student')).toBeNull();
    expect(missingArticle('where is the library')).toBeNull();
    expect(missingArticle('my brother lives with me')).toBeNull();
    expect(missingArticle('one kilo of apples please')).toBeNull();
    expect(missingArticle("sara's shop")).toBeNull();
  });
  it('ignores plurals and words not on the list', () => {
    expect(missingArticle('i like apples')).toBeNull();
    expect(missingArticle('i am from kabul')).toBeNull();
  });
});

describe('checkBe', () => {
  it('detects a missing "am" after I', () => {
    expect(checkBe('i from kabul')).toEqual({ ok: false, issue: 'missing-be', found: 'i from' });
    expect(checkBe('i fine thank you')).toEqual({ ok: false, issue: 'missing-be', found: 'i fine' });
    expect(checkBe('i a student')).toEqual({ ok: false, issue: 'missing-be', found: 'i a' });
  });
  it('detects wrong forms of be with pronouns', () => {
    expect(checkBe('i is from kabul')).toEqual({ ok: false, issue: 'wrong-be-form', found: 'i is' });
    expect(checkBe('she am my neighbour')).toEqual({ ok: false, issue: 'wrong-be-form', found: 'she am' });
    expect(checkBe('they is here')).toEqual({ ok: false, issue: 'wrong-be-form', found: 'they is' });
  });
  it('accepts I am, I\'m and ordinary verbs after I', () => {
    expect(checkBe('i am from kabul').ok).toBe(true);
    expect(checkBe("i'm fine").ok).toBe(true);
    expect(checkBe('i live in flat four').ok).toBe(true);
    expect(checkBe('i would like two kilos').ok).toBe(true);
  });
});

describe('checkQuestionInversion', () => {
  it('accepts an auxiliary or be straight after the question word', () => {
    expect(checkQuestionInversion('how much are the apples').ok).toBe(true);
    expect(checkQuestionInversion('how much do the apples cost').ok).toBe(true);
    expect(checkQuestionInversion('where is the library').ok).toBe(true);
    expect(checkQuestionInversion('excuse me where is the bank').ok).toBe(true);
    expect(checkQuestionInversion('how much is it').ok).toBe(true);
  });
  it('reports not-inverted when the verb comes later', () => {
    expect(checkQuestionInversion('how much it is')).toEqual({ ok: false, issue: 'not-inverted', questionWord: 'how much' });
    expect(checkQuestionInversion('where the library is')).toEqual({ ok: false, issue: 'not-inverted', questionWord: 'where' });
  });
  it('reports missing-verb when there is no auxiliary at all', () => {
    expect(checkQuestionInversion('how much the apples')).toEqual({ ok: false, issue: 'missing-verb', questionWord: 'how much' });
    expect(checkQuestionInversion('where library')).toEqual({ ok: false, issue: 'missing-verb', questionWord: 'where' });
  });
  it('ignores sentences without a question word', () => {
    expect(checkQuestionInversion('two kilos please').ok).toBe(true);
  });
});

describe('missingPluralAfterNumber', () => {
  it('flags a singular noun after two or more', () => {
    expect(missingPluralAfterNumber('two kilo of apples')).toBe('kilo');
    expect(missingPluralAfterNumber('six egg please')).toBe('egg');
    expect(missingPluralAfterNumber('3 apple')).toBe('apple');
  });
  it('accepts plurals and one', () => {
    expect(missingPluralAfterNumber('two kilos of apples')).toBeNull();
    expect(missingPluralAfterNumber('one kilo please')).toBeNull();
  });
});

describe('hasPoliteness and digitsToWords', () => {
  it('finds please / thank you / thanks', () => {
    expect(hasPoliteness('two kilos please')).toBe(true);
    expect(hasPoliteness('thanks bye')).toBe(true);
    expect(hasPoliteness('two kilos')).toBe(false);
  });
  it('writes small numbers as words', () => {
    expect(digitsToWords('flat 4 and 20 eggs and 21 cats')).toBe('flat four and twenty eggs and 21 cats');
  });
});

describe('runRule', () => {
  it('returns the offending fragment or null for each rule', () => {
    expect(runRule('missing-article', 'i am student')).toBe('student');
    expect(runRule('missing-article', 'i am a student')).toBeNull();
    expect(runRule('missing-be', 'i from herat')).toBe('i from');
    expect(runRule('missing-be', 'i is from herat')).toBeNull();
    expect(runRule('wrong-be-form', 'i is from herat')).toBe('i is');
    expect(runRule('question-inversion', 'how much the apples cost')).toBe('how much');
    expect(runRule('question-inversion', 'how much are the apples')).toBeNull();
    expect(runRule('plural-after-number', 'two kilo')).toBe('kilo');
    expect(runRule('missing-please', 'two kilos')).toBe('please');
    expect(runRule('missing-please', 'two kilos please')).toBeNull();
  });
});
