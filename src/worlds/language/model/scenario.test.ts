import { describe, expect, it } from 'vitest';
import { canonicalReply, matchesTurn, ScenarioEngine, targetedFeedback, type Scenario } from './scenario';
import { libraryScenario, marketScenario, marketVariantScenario, neighbourScenario, SCENARIOS } from './scenarios';

const byId = (sim: ScenarioEngine) => Object.fromEntries(sim.measurements().map((m) => [m.id, m.value]));

describe('canonicalReply', () => {
  it('lower-cases, strips punctuation, expands contractions and writes digits as words', () => {
    expect(canonicalReply("Hello! I'm Amina.")).toBe('hello i am amina');
    expect(canonicalReply("I'd like 2 kilos, please?")).toBe('i would like two kilos please');
    expect(canonicalReply("Where's the library?")).toBe('where is the library');
    expect(canonicalReply('OK.  Straight on, then the bank is on the left?')).toBe('okay straight on then the bank is on the left');
    expect(canonicalReply("That's all. How much is it?")).toBe('that is all how much is it');
  });
});

describe('matching', () => {
  const m1 = marketScenario.turns[0]!;
  it('accepts the listed alternatives for asking a price', () => {
    for (const r of ['Good morning! How much are the apples?', 'good morning, how much do the apples cost', 'Hello, how much are the apples?', 'Good morning. How much is a kilo of apples?']) {
      expect(matchesTurn(m1, r), r).toBe(true);
    }
  });
  it('rejects a reply that does not meet the goal', () => {
    expect(matchesTurn(m1, 'Good morning. I like apples.')).toBe(false);
    expect(matchesTurn(m1, '')).toBe(false);
  });
  it('gives specific feedback for a missing word or wrong form', () => {
    expect(targetedFeedback(m1, 'Good morning. How many are the apples?')?.id).toBe('how-many');
    expect(targetedFeedback(m1, 'Good morning. How much the apples cost?')?.id).toBe('inversion');
    expect(targetedFeedback(marketScenario.turns[1]!, 'Two kilo of apples, please')?.message).toContain('two **kilos**');
    expect(targetedFeedback(marketScenario.turns[1]!, 'Two kilos of apples')?.id).toBe('no-please');
    expect(targetedFeedback(neighbourScenario.turns[2]!, 'I from Kabul')?.id).toBe('missing-be');
    expect(targetedFeedback(neighbourScenario.turns[4]!, 'I am student')?.message).toBe('Jobs take **a**: I am **a** student.');
    expect(targetedFeedback(libraryScenario.turns[0]!, 'Excuse me, where the library is?')?.id).toBe('inversion');
    expect(targetedFeedback(libraryScenario.turns[0]!, 'Where is library?')?.id).toBe('missing-article');
  });
});

describe('ScenarioEngine', () => {
  it('starts with the first character line in the transcript and sensible measurements', () => {
    const sim = new ScenarioEngine(neighbourScenario);
    const s = sim.snapshot();
    expect(s.turnIndex).toBe(0);
    expect(s.transcript).toEqual([{ speaker: 'character', text: neighbourScenario.turns[0]!.characterLine, turnId: 'n1' }]);
    expect(byId(sim)).toMatchObject({ turn: 1, completed: 0, retries: 0, vocabulary: 0 });
    expect(sim.assumptions().length).toBeGreaterThan(2);
    expect(sim.params).toEqual({ scenarioId: 'neighbour', maxRetries: 2 });
  });

  it('an accepted reply advances to the next line and records vocabulary', () => {
    const sim = new ScenarioEngine(neighbourScenario);
    const r = sim.submit("Hello! I'm Amina.");
    expect(r.outcome).toBe('accepted');
    expect(r.nextLine).toBe(neighbourScenario.turns[1]!.characterLine);
    expect(r.done).toBe(false);
    const s = sim.snapshot();
    expect(s.turnIndex).toBe(1);
    expect(s.turnsAccepted).toBe(1);
    expect(s.vocabularyUsed).toEqual(['hello']);
    expect(s.transcript.map((t) => t.speaker)).toEqual(['character', 'learner', 'character']);
    expect(byId(sim)).toMatchObject({ turn: 2, completed: 1, accepted: 1, vocabulary: 1 });
  });

  it('a reply missing a required word triggers the specific feedback and a retry', () => {
    const sim = new ScenarioEngine(marketScenario);
    sim.submit('Good morning! How much are the apples?');
    const r = sim.submit('Two kilos of apples');
    expect(r.outcome).toBe('retry');
    expect(r.feedback).toContain('**please**');
    expect(sim.snapshot().turnIndex).toBe(1);
    expect(byId(sim)).toMatchObject({ retries: 1, completed: 1 });
    expect(sim.snapshot().transcript.at(-1)).toMatchObject({ speaker: 'coach' });
  });

  it('after two re-prompts the engine shows the model reply and moves on', () => {
    const sim = new ScenarioEngine(neighbourScenario);
    expect(sim.submit('banana').outcome).toBe('retry');
    const second = sim.submit('banana');
    expect(second.outcome).toBe('retry');
    expect(second.feedback).toContain('Hint: start with');
    const third = sim.submit('banana');
    expect(third.outcome).toBe('moved-on');
    expect(third.modelReply).toBe("Hello! I'm Amina.");
    expect(third.nextLine).toBe(neighbourScenario.turns[1]!.characterLine);
    const s = sim.snapshot();
    expect(s.turnIndex).toBe(1);
    expect(s.turnsMovedOn).toBe(1);
    expect(s.turnsAccepted).toBe(0);
    expect(s.retriesThisTurn).toBe(0);
    expect(s.retriesTotal).toBe(2);
    expect(s.transcript.filter((t) => t.speaker === 'model')).toHaveLength(1);
    expect(byId(sim)).toMatchObject({ turn: 2, completed: 1, accepted: 0, retries: 2, 'moved-on': 1 });
  });

  it('showModelReply moves on without counting as a re-prompt', () => {
    const sim = new ScenarioEngine(libraryScenario);
    const r = sim.showModelReply();
    expect(r.outcome).toBe('moved-on');
    expect(byId(sim)).toMatchObject({ retries: 0, 'moved-on': 1, turn: 2 });
  });

  it('finishes after the last turn and refuses further input gracefully', () => {
    const sim = new ScenarioEngine(marketVariantScenario);
    let last;
    for (const t of marketVariantScenario.turns) last = sim.submit(t.modelReply);
    expect(last?.done).toBe(true);
    expect(last?.nextLine).toBeUndefined();
    expect(sim.isFinished()).toBe(true);
    expect(sim.currentTurn()).toBeUndefined();
    expect(sim.submit('hello').done).toBe(true);
    expect(byId(sim).completed).toBe(marketVariantScenario.turns.length);
  });

  it('reset restarts the conversation and can change the retry budget', () => {
    const sim = new ScenarioEngine(neighbourScenario);
    sim.submit('banana');
    sim.reset({ maxRetries: 0 });
    expect(sim.snapshot().transcript).toHaveLength(1);
    expect(sim.params.maxRetries).toBe(0);
    expect(sim.submit('banana').outcome).toBe('moved-on');
  });

  it('an empty reply asks for text without using a retry', () => {
    const sim = new ScenarioEngine(neighbourScenario);
    expect(sim.submit('   ').outcome).toBe('retry');
    expect(byId(sim).retries).toBe(0);
  });

  it('step is a no-op for the conversation state', () => {
    const sim = new ScenarioEngine(neighbourScenario);
    const before = sim.snapshot();
    sim.step(10);
    expect(sim.snapshot()).toEqual(before);
  });

  it('rejects an empty scenario', () => {
    const empty: Scenario = { id: 'x', title: 'x', setting: '', character: { name: 'x', role: 'x', avatar: 'neighbour' }, turns: [] };
    expect(() => new ScenarioEngine(empty)).toThrow();
  });
});

describe('authored scenarios', () => {
  it('have 5–8 turns, unique turn ids and valid patterns', () => {
    for (const sc of SCENARIOS) {
      expect(sc.turns.length, sc.id).toBeGreaterThanOrEqual(5);
      expect(sc.turns.length, sc.id).toBeLessThanOrEqual(8);
      expect(new Set(sc.turns.map((t) => t.id)).size).toBe(sc.turns.length);
      for (const t of sc.turns) {
        for (const p of t.patterns ?? []) expect(() => new RegExp(p), `${sc.id}/${t.id}`).not.toThrow();
        for (const f of t.feedback) if (f.pattern) expect(() => new RegExp(f.pattern!), `${sc.id}/${t.id}/${f.id}`).not.toThrow();
        expect(new Set(t.feedback.map((f) => f.id)).size, `${sc.id}/${t.id}`).toBe(t.feedback.length);
      }
    }
  });
  it('the three main scenarios have 6–8 turns', () => {
    for (const sc of [neighbourScenario, marketScenario, libraryScenario]) expect(sc.turns.length, sc.id).toBeGreaterThanOrEqual(6);
  });
  it('every model reply and every accepted alternative is accepted by its own turn', () => {
    for (const sc of SCENARIOS) {
      for (const t of sc.turns) {
        expect(matchesTurn(t, t.modelReply), `${sc.id}/${t.id} model`).toBe(true);
        for (const a of t.accepted) expect(matchesTurn(t, a), `${sc.id}/${t.id}: ${a}`).toBe(true);
      }
    }
  });
  it('no model reply triggers its own turn’s targeted feedback', () => {
    for (const sc of SCENARIOS) for (const t of sc.turns) expect(targetedFeedback(t, t.modelReply), `${sc.id}/${t.id}`).toBeNull();
  });
});
