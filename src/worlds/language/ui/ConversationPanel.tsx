import { useEffect, useRef, useState } from 'react';
import { Markdown } from '@/ui/Markdown';
import { GLOSS_REVIEW_LABEL } from '../model/vocabulary';
import { Avatar } from './Avatar';
import { PRESETS } from './presets';
import { canSpeak, speak } from './speech';
import { useLanguageUi } from './store';

const SPEAKER_LABEL = { character: '', learner: 'You', model: 'Model reply', coach: 'Coach' } as const;

/**
 * The dialogue environment: character portrait and setting, live transcript, the current
 * goal, a reply box, and the escape hatch ("Show a model reply") so nobody gets stuck.
 */
export function ConversationPanel() {
  const presetId = useLanguageUi((s) => s.presetId);
  const engine = useLanguageUi((s) => s.engine);
  const snapshot = useLanguageUi((s) => s.snapshot);
  const lastResult = useLanguageUi((s) => s.lastResult);
  const runId = useLanguageUi((s) => s.runId);
  const submit = useLanguageUi((s) => s.submit);
  const showModelReply = useLanguageUi((s) => s.showModelReply);
  const restart = useLanguageUi((s) => s.restart);

  const [reply, setReply] = useState('');
  const listRef = useRef<HTMLOListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const speech = canSpeak();

  const preset = PRESETS[presetId];
  const scenario = engine.scenario;
  const turn = engine.currentTurn();
  const total = scenario.turns.length;

  useEffect(() => { setReply(''); }, [runId, presetId]);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [snapshot.transcript.length]);

  const send = () => {
    if (!reply.trim()) return;
    submit(reply);
    setReply('');
    inputRef.current?.focus();
  };

  return (
    <section className="conversation" aria-labelledby="conversation-title">
      <header className="conversation-head">
        <Avatar kind={scenario.character.avatar} />
        <div className="conversation-meta">
          <h3 id="conversation-title">{scenario.title}</h3>
          <p className="conversation-setting">{scenario.setting} You are talking to <strong>{scenario.character.name}</strong>, {scenario.character.role}.</p>
        </div>
        <span className="conversation-progress" aria-label={`turn ${Math.min(snapshot.turnIndex + 1, total)} of ${total}`}>
          {snapshot.finished ? 'Finished' : `Turn ${snapshot.turnIndex + 1} / ${total}`}
        </span>
      </header>

      <ol className="transcript" ref={listRef} aria-live="polite" aria-relevant="additions" aria-label="Conversation transcript">
        {snapshot.transcript.map((e, i) => (
          <li key={`${e.turnId}-${i}`} className={`bubble bubble-${e.speaker}`}>
            <span className="bubble-speaker">{e.speaker === 'character' ? scenario.character.name : SPEAKER_LABEL[e.speaker]}</span>
            <div className="bubble-text">{e.speaker === 'coach' ? <Markdown md={e.text} /> : <p>{e.text}</p>}</div>
            {e.gloss && (
              <p className="gloss" lang="prs" dir="rtl">
                {e.gloss} <span className="gloss-label" lang="en" dir="ltr">{GLOSS_REVIEW_LABEL}</span>
              </p>
            )}
            {speech && e.speaker !== 'coach' && (
              <button type="button" className="chip" onClick={() => speak(e.text)} aria-label={`Listen: ${e.text}`}>Listen</button>
            )}
          </li>
        ))}
      </ol>

      {turn && !snapshot.finished ? (
        <>
          <p className="goal-line"><span className="goal-tag">Your goal</span> {turn.goal}</p>
          <form
            className="reply-form"
            onSubmit={(e) => { e.preventDefault(); send(); }}
          >
            <label htmlFor="dialogue-reply" className="sr-only">Your reply to {scenario.character.name}</label>
            <input
              id="dialogue-reply"
              ref={inputRef}
              className="answer-input reply-input"
              type="text"
              autoComplete="off"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply in English…"
            />
            <button type="submit" className="button primary" disabled={!reply.trim()}>Send</button>
          </form>
          <div className="conversation-actions">
            {snapshot.retriesThisTurn > 0 && (
              <button type="button" className="button small" onClick={showModelReply}>Show a model reply</button>
            )}
            <button type="button" className="button small ghost" onClick={restart}>Restart</button>
            <span className="control-hint">{snapshot.retriesThisTurn > 0 ? `${snapshot.retriesThisTurn} of ${engine.params.maxRetries} re-prompts used on this turn` : 'Two re-prompts per turn, then a model reply is shown'}</span>
          </div>
        </>
      ) : (
        <div className="conversation-done">
          <p><strong>Conversation finished.</strong> You answered {snapshot.turnsAccepted} of {total} turns on your own{snapshot.turnsMovedOn > 0 ? ` and saw ${snapshot.turnsMovedOn} model repl${snapshot.turnsMovedOn === 1 ? 'y' : 'ies'}` : ''}.</p>
          <button type="button" className="button primary" onClick={restart}>Start again</button>
        </div>
      )}

      {lastResult && (
        <div className={`feedback feedback-${lastResult.outcome === 'accepted' ? 'correct' : lastResult.outcome === 'retry' ? 'incorrect' : 'invalid'}`} role="status">
          <Markdown md={lastResult.feedback} />
        </div>
      )}

      <p className="control-hint conversation-preset">Scene: {preset?.label ?? presetId}. {preset?.description}</p>
    </section>
  );
}
