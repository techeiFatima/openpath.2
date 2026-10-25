import { normalizeText } from '@/core/assessment/grade';
import type { Measurement, Simulation } from '@/core/simulation/types';
import { digitsToWords, runRule, type GrammarRule } from './grammar';

/**
 * Scripted conversation scenarios: the "simulation" of the Language world.
 *
 * A scenario is a fixed sequence of turns. The character speaks, the learner types a reply,
 * the engine checks it against accepted alternatives and lenient patterns, gives targeted
 * rule-based feedback, and advances or re-prompts. After `maxRetries` re-prompts it shows a
 * model reply and moves on so the learner is never trapped. No network, no LLM: every
 * verdict here is deterministic and reproducible in tests.
 */

export interface TurnFeedback {
  id: string;
  /** Fires when the canonical reply contains any of these phrases (whole words). */
  match?: string[];
  /** Fires when none of these phrases is present in the canonical reply. */
  missing?: string[];
  /** Fires when this regular expression (source string) matches the canonical reply. */
  pattern?: string;
  /** Fires when the named grammar rule finds a problem; `{found}` in the message is replaced by the fragment. */
  rule?: GrammarRule;
  message: string;
}

export interface Turn {
  id: string;
  /** What the character says before the learner replies. */
  characterLine: string;
  /** Optional L1 (Dari) gloss of the character line. Shown with a review label; empty unless confident. */
  gloss?: string;
  /** The learner's goal for this turn, in plain language. */
  goal: string;
  /** Accepted replies; compared after canonicalisation (see `canonicalReply`). */
  accepted: string[];
  /** Regular-expression sources matched against the canonical reply (anchor them yourself). */
  patterns?: string[];
  /** Targeted feedback, checked in order on a failed reply. */
  feedback: TurnFeedback[];
  /** Shown after the retry budget is spent; must itself be accepted. */
  modelReply: string;
  /** Vocabulary items (from the lesson's phrasebook) this turn practises. */
  vocabulary: string[];
}

export interface ScenarioCharacter {
  name: string;
  role: string;
  /** Which simple SVG avatar the UI draws. */
  avatar: 'neighbour' | 'shopkeeper' | 'passer-by';
}

export interface Scenario {
  id: string;
  title: string;
  setting: string;
  character: ScenarioCharacter;
  turns: Turn[];
}

export interface TranscriptEntry {
  speaker: 'character' | 'learner' | 'model' | 'coach';
  text: string;
  turnId: string;
  gloss?: string;
}

export interface ScenarioParams {
  scenarioId: string;
  /** Re-prompts allowed per turn before the model reply is shown (default 2). */
  maxRetries: number;
}

export interface ScenarioState {
  turnIndex: number;
  /** Re-prompts used on the current turn. */
  retriesThisTurn: number;
  retriesTotal: number;
  turnsAccepted: number;
  turnsMovedOn: number;
  finished: boolean;
  transcript: TranscriptEntry[];
  vocabularyUsed: string[];
}

export type SubmitOutcome = 'accepted' | 'retry' | 'moved-on';

export interface SubmitResult {
  outcome: SubmitOutcome;
  feedback: string;
  /** The character's next line, if the conversation continues. */
  nextLine?: string;
  /** Present when the engine moved on and showed the model reply. */
  modelReply?: string;
  /** True once the scenario has no more turns. */
  done: boolean;
}

const CONTRACTIONS: [RegExp, string][] = [
  [/\bi'm\b/g, 'i am'],
  [/\bi'd\b/g, 'i would'],
  [/\bi've\b/g, 'i have'],
  [/\bi'll\b/g, 'i will'],
  [/\byou're\b/g, 'you are'],
  [/\bwe're\b/g, 'we are'],
  [/\bthey're\b/g, 'they are'],
  [/\blet's\b/g, 'let us'],
  [/\b(he|she|it|that|there|what|where|who|how|here)'s\b/g, '$1 is'],
  [/\bdon't\b/g, 'do not'],
  [/\bdoesn't\b/g, 'does not'],
  [/\bcan't\b/g, 'cannot'],
  [/\bisn't\b/g, 'is not'],
  [/\baren't\b/g, 'are not'],
  [/\bok\b/g, 'okay'],
];

/**
 * Canonical form used for all matching: core `normalizeText` (lower-case, straight quotes,
 * collapsed whitespace, trailing punctuation removed), then all punctuation removed,
 * contractions expanded ("I'm" → "i am"), digits 0–20 written as words.
 */
export function canonicalReply(input: string): string {
  let s = normalizeText(input).replace(/[^a-z0-9' ]+/g, ' ');
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  s = s.replace(/'/g, '');
  s = digitsToWords(s);
  return s.replace(/\s+/g, ' ').trim();
}

function containsPhrase(canon: string, phrase: string): boolean {
  return ` ${canon} `.includes(` ${canonicalReply(phrase)} `);
}

/** A phrasebook item counts as used in its base or simple plural form ("egg" ↔ "eggs", "potato" ↔ "potatoes"). */
export function vocabularyPresent(canon: string, item: string): boolean {
  const base = canonicalReply(item);
  return [base, `${base}s`, `${base}es`].some((form) => ` ${canon} `.includes(` ${form} `));
}

/** Does this reply satisfy the turn (accepted alternative or lenient pattern)? */
export function matchesTurn(turn: Turn, reply: string): boolean {
  const canon = canonicalReply(reply);
  if (!canon) return false;
  if (turn.accepted.some((a) => canonicalReply(a) === canon)) return true;
  return (turn.patterns ?? []).some((p) => new RegExp(p).test(canon));
}

/** First targeted feedback that applies to a failed reply, or null. */
export function targetedFeedback(turn: Turn, reply: string): { id: string; message: string } | null {
  const canon = canonicalReply(reply);
  for (const f of turn.feedback) {
    if (f.rule) {
      const found = runRule(f.rule, canon);
      if (found !== null) return { id: f.id, message: f.message.replace('{found}', found) };
      continue;
    }
    if (f.match && f.match.some((m) => containsPhrase(canon, m))) return { id: f.id, message: f.message };
    if (f.missing && !f.missing.some((m) => containsPhrase(canon, m))) return { id: f.id, message: f.message };
    if (f.pattern && new RegExp(f.pattern).test(canon)) return { id: f.id, message: f.message };
  }
  return null;
}

export class ScenarioEngine implements Simulation<ScenarioState, ScenarioParams> {
  readonly id: string;
  readonly scenario: Scenario;
  private _params: ScenarioParams;
  private state!: ScenarioState;
  private elapsed = 0;

  constructor(scenario: Scenario, options: Partial<Pick<ScenarioParams, 'maxRetries'>> = {}) {
    if (scenario.turns.length === 0) throw new Error(`Scenario ${scenario.id} has no turns`);
    this.scenario = scenario;
    this.id = `dialogue:${scenario.id}`;
    this._params = { scenarioId: scenario.id, maxRetries: options.maxRetries ?? 2 };
    this.reset();
  }

  get params(): Readonly<ScenarioParams> {
    return this._params;
  }

  /** Conversations do not evolve on their own; time is only tracked for the readout. */
  step(dt: number): void {
    this.elapsed += dt;
  }

  reset(params?: Partial<ScenarioParams>): void {
    if (params?.maxRetries !== undefined) this._params = { ...this._params, maxRetries: params.maxRetries };
    this.elapsed = 0;
    const first = this.scenario.turns[0]!;
    this.state = {
      turnIndex: 0,
      retriesThisTurn: 0,
      retriesTotal: 0,
      turnsAccepted: 0,
      turnsMovedOn: 0,
      finished: false,
      transcript: [this.characterEntry(first)],
      vocabularyUsed: [],
    };
  }

  snapshot(): Readonly<ScenarioState> {
    return { ...this.state, transcript: [...this.state.transcript], vocabularyUsed: [...this.state.vocabularyUsed] };
  }

  currentTurn(): Turn | undefined {
    return this.scenario.turns[this.state.turnIndex];
  }

  isFinished(): boolean {
    return this.state.finished;
  }

  measurements(): Measurement[] {
    const s = this.state;
    const total = this.scenario.turns.length;
    return [
      { id: 'turn', label: 'Current turn', value: Math.min(s.turnIndex + 1, total), unit: `of ${total}`, source: 'numerical' },
      { id: 'completed', label: 'Turns completed', value: s.turnsAccepted + s.turnsMovedOn, unit: '', source: 'numerical' },
      { id: 'accepted', label: 'Turns answered on your own', value: s.turnsAccepted, unit: '', source: 'numerical' },
      { id: 'retries', label: 'Re-prompts used', value: s.retriesTotal, unit: '', source: 'numerical' },
      { id: 'moved-on', label: 'Model replies shown', value: s.turnsMovedOn, unit: '', source: 'numerical' },
      { id: 'vocabulary', label: 'Distinct phrasebook items used', value: s.vocabularyUsed.length, unit: '', source: 'numerical' },
    ];
  }

  assumptions(): string[] {
    return [
      'The character follows a fixed script; it does not understand your reply, it only checks it against accepted patterns.',
      'Feedback is rule-based and limited to a few A1 patterns (articles, the verb be, question word order, plurals, please). A reply with no feedback is not proof it is perfect.',
      'Spelling, capital letters and punctuation are not checked here; they are practised in the lesson problems.',
      `After ${this._params.maxRetries} re-prompts the model reply is shown and the conversation moves on.`,
    ];
  }

  /** Submit a learner reply for the current turn. */
  submit(reply: string): SubmitResult {
    const turn = this.currentTurn();
    if (!turn || this.state.finished) {
      return { outcome: 'moved-on', feedback: 'This conversation is finished. Reset to start again.', done: true };
    }
    const canon = canonicalReply(reply);
    if (!canon) return { outcome: 'retry', feedback: 'Type a reply first.', done: false };

    this.state.transcript.push({ speaker: 'learner', text: reply.trim(), turnId: turn.id });

    if (matchesTurn(turn, reply)) {
      this.recordVocabulary(turn, canon);
      this.state.turnsAccepted += 1;
      const next = this.advance();
      return { outcome: 'accepted', feedback: 'Good. The conversation continues.', ...(next ? { nextLine: next.characterLine } : {}), done: this.state.finished };
    }

    if (this.state.retriesThisTurn < this._params.maxRetries) {
      this.state.retriesThisTurn += 1;
      this.state.retriesTotal += 1;
      const specific = targetedFeedback(turn, reply);
      let message = specific ? specific.message : `Not quite. Your goal: ${turn.goal}`;
      if (this.state.retriesThisTurn === this._params.maxRetries) message += ` Hint: start with "${turn.modelReply.split(' ').slice(0, 2).join(' ')}…"`;
      this.state.transcript.push({ speaker: 'coach', text: message, turnId: turn.id });
      return { outcome: 'retry', feedback: message, done: false };
    }

    return this.moveOn(turn, 'That was the last try for this turn. Here is a model reply; the conversation moves on.');
  }

  /** Learner asks to see the model reply: counts as a moved-on turn. */
  showModelReply(): SubmitResult {
    const turn = this.currentTurn();
    if (!turn || this.state.finished) return { outcome: 'moved-on', feedback: 'This conversation is finished.', done: true };
    return this.moveOn(turn, 'Here is a model reply; the conversation moves on.');
  }

  private moveOn(turn: Turn, feedback: string): SubmitResult {
    this.state.transcript.push({ speaker: 'model', text: turn.modelReply, turnId: turn.id });
    this.state.turnsMovedOn += 1;
    const next = this.advance();
    return { outcome: 'moved-on', feedback, modelReply: turn.modelReply, ...(next ? { nextLine: next.characterLine } : {}), done: this.state.finished };
  }

  private advance(): Turn | undefined {
    this.state.turnIndex += 1;
    this.state.retriesThisTurn = 0;
    const next = this.scenario.turns[this.state.turnIndex];
    if (!next) {
      this.state.finished = true;
      return undefined;
    }
    this.state.transcript.push(this.characterEntry(next));
    return next;
  }

  private recordVocabulary(turn: Turn, canon: string): void {
    for (const v of turn.vocabulary) {
      if (vocabularyPresent(canon, v) && !this.state.vocabularyUsed.includes(v)) this.state.vocabularyUsed.push(v);
    }
  }

  private characterEntry(turn: Turn): TranscriptEntry {
    return { speaker: 'character', text: turn.characterLine, turnId: turn.id, ...(turn.gloss ? { gloss: turn.gloss } : {}) };
  }
}
