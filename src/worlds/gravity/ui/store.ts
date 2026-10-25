import { create } from 'zustand';
import type { OrbitLabSettings } from '../model/presets';
import { DEFAULT_PRESET_ID, PRESETS, type Mode } from './presets';

/** Transient UI state for the Gravity Lab viewport (not persisted). */
interface GravityUiState {
  presetId: string;
  mode: Mode;
  settings: OrbitLabSettings;
  timeScale: number;
  running: boolean;
  focusId: string;
  showOrbits: boolean;
  /** Incremented to rebuild the simulation from its initial conditions. */
  runId: number;
  applyPreset(id: string): void;
  setSettings(patch: Partial<OrbitLabSettings>): void;
  setRunning(on: boolean): void;
  setTimeScale(s: number): void;
  setFocus(id: string): void;
  setShowOrbits(on: boolean): void;
  restart(): void;
}

const initialPreset = PRESETS[DEFAULT_PRESET_ID]!;

export const useGravityUi = create<GravityUiState>()((set) => ({
  presetId: initialPreset.id,
  mode: initialPreset.mode,
  settings: initialPreset.settings!,
  timeScale: initialPreset.timeScale,
  running: true,
  focusId: initialPreset.focusId ?? 'probe',
  showOrbits: true,
  runId: 0,
  applyPreset: (id) => {
    const p = PRESETS[id];
    if (!p) return;
    set((s) => ({
      presetId: p.id,
      mode: p.mode,
      settings: p.settings ?? s.settings,
      timeScale: p.timeScale,
      focusId: p.focusId ?? (p.mode === 'orbit-lab' ? 'probe' : 'earth'),
      running: true,
      runId: s.runId + 1,
    }));
  },
  setSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch }, runId: s.runId + 1 })),
  setRunning: (on) => set({ running: on }),
  setTimeScale: (timeScale) => set({ timeScale }),
  setFocus: (focusId) => set({ focusId }),
  setShowOrbits: (showOrbits) => set({ showOrbits }),
  restart: () => set((s) => ({ runId: s.runId + 1, running: true })),
}));
