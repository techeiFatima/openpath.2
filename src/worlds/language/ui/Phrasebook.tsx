import { GLOSS_REVIEW_LABEL, vocabularyFor, type VocabularyGroup } from '../model/vocabulary';
import { useLanguageUi } from './store';

/** Lesson vocabulary with examples and (unreviewed) Dari glosses. Items used in the conversation are marked. */
export function Phrasebook({ group }: { group: VocabularyGroup }) {
  const used = useLanguageUi((s) => s.snapshot.vocabularyUsed);
  const items = vocabularyFor(group);
  const glossed = items.some((v) => v.gloss);
  return (
    <section className="phrasebook" aria-labelledby="phrasebook-title">
      <div className="measure-head">
        <h3 id="phrasebook-title">Phrasebook</h3>
        <span className="control-hint">{used.length} of {items.length} used</span>
      </div>
      <ul className="phrase-list">
        {items.map((v) => {
          const isUsed = used.some((u) => u.toLowerCase() === v.word.toLowerCase());
          return (
            <li key={v.word} className={`phrase ${isUsed ? 'used' : ''}`}>
              <div className="phrase-head">
                <span className="phrase-word" lang="en">{v.word}</span>
                <span className="phrase-pos">{v.pos}</span>
                {isUsed && <span className="phrase-used" aria-label="used in the conversation">✓</span>}
              </div>
              <p className="phrase-example" lang="en">{v.example}</p>
              {v.gloss && (
                <p className="gloss">
                  <span lang="prs" dir="rtl">{v.gloss}</span> <span className="gloss-label">{GLOSS_REVIEW_LABEL}</span>
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {glossed && <p className="control-hint">Glosses are drafts for Dari-speaking learners. None has been checked by a native speaker yet; the English example is the reference.</p>}
    </section>
  );
}
