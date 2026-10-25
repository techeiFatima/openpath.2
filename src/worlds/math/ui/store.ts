import { create } from 'zustand';
import type { RiemannMethod, Transform } from '../model/functions';
import { DEFAULT_PRESET_ID, PRESETS, type Mode } from './presets';

export interface View { xMin: number; xMax: number; yMin: number; yMax: number }

interface MathUiState {
  presetId: string;
  mode: Mode;
  functionId: string;
  a: number;
  h: number;
  n: number;
  interval: [number, number];
  method: RiemannMethod;
  transform: Transform;
  showTangent: boolean;
  view: View;
  applyPreset(id: string): void;
  set(patch: Partial<Pick<MathUiState, 'mode' | 'functionId' | 'a' | 'h' | 'n' | 'interval' | 'method' | 'transform' | 'showTangent' | 'view'>>): void;
}

const p0 = PRESETS[DEFAULT_PRESET_ID]!;

export const useMathUi = create<MathUiState>()((set) => ({
  presetId: p0.id,
  mode: p0.mode,
  functionId: p0.functionId,
  a: p0.a ?? 1,
  h: p0.h ?? 1,
  n: p0.n ?? 6,
  interval: p0.interval ?? [0, 3],
  method: p0.method ?? 'left',
  transform: p0.transform ?? { a: 1, b: 1, h: 0, k: 0 },
  showTangent: false,
  view: p0.view ?? { xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
  applyPreset: (id) => {
    const p = PRESETS[id];
    if (!p) return;
    set((s) => ({
      presetId: p.id,
      mode: p.mode,
      functionId: p.functionId,
      a: p.a ?? s.a,
      h: p.h ?? s.h,
      n: p.n ?? s.n,
      interval: p.interval ?? s.interval,
      method: p.method ?? s.method,
      transform: p.transform ?? s.transform,
      showTangent: p.mode === 'secant' ? s.showTangent : false,
      view: p.view ?? s.view,
    }));
  },
  set: (patch) => set(patch),
}));
