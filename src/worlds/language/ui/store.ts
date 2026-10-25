import { create } from 'zustand';
import { ScenarioEngine, type ScenarioState, type SubmitResult } from '../model/scenario';
import { DEFAULT_PRESET_ID, PRESETS } from './presets';

/** Transient UI state for the Conversation Street viewport (not persisted). */
interface LanguageUiState {
  presetId: string;
  engine: ScenarioEngine;
  /** Cloned engine state; replaced after every action so React re-renders. */
  snapshot: ScenarioState;
  lastResult: SubmitResult | null;
  /** Incremented on every (re)start so panels can reset local state. */
  runId: number;
  /** Load a preset. Re-selecting the current preset keeps the conversation unless it is finished. */
  applyPreset(id: string): void;
  submit(reply: string): void;
  showModelReply(): void;
  restart(): void;
}

const initialEngine = new ScenarioEngine(PRESETS[DEFAULT_PRESET_ID]!.scenario);

export const useLanguageUi = create<LanguageUiState>()((set, get) => ({
  presetId: DEFAULT_PRESET_ID,
  engine: initialEngine,
  snapshot: initialEngine.snapshot(),
  lastResult: null,
  runId: 0,
  applyPreset: (id) => {
    const p = PRESETS[id];
    if (!p) return;
    const { presetId, engine } = get();
    if (presetId === id && !engine.isFinished()) return;
    const next = new ScenarioEngine(p.scenario);
    set((s) => ({ presetId: id, engine: next, snapshot: next.snapshot(), lastResult: null, runId: s.runId + 1 }));
  },
  submit: (reply) => {
    const { engine } = get();
    const lastResult = engine.submit(reply);
    set({ snapshot: engine.snapshot(), lastResult });
  },
  showModelReply: () => {
    const { engine } = get();
    const lastResult = engine.showModelReply();
    set({ snapshot: engine.snapshot(), lastResult });
  },
  restart: () => {
    const { engine } = get();
    engine.reset();
    set((s) => ({ snapshot: engine.snapshot(), lastResult: null, runId: s.runId + 1 }));
  },
}));
