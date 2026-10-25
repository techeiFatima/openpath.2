import { create } from 'zustand';
import { cleanSequence, isDna, type Mutation } from '../model/dna';
import { FOV_MAX_M, FOV_MIN_M, SCALE_OBJECTS_BY_ID } from '../model/scale';
import { DEFAULT_PRESET_ID, PRESETS, type Panel } from './presets';

/** Transient UI state for the Inside the Cell viewport (not persisted). */
interface BiologyUiState {
  presetId: string;
  panel: Panel;
  /** Scale explorer: height of the field of view in metres. */
  fov: number;
  selectedId: string;
  referenceId: string;
  /** DNA workbench: what the learner typed, and the last valid cleaned coding strand (5'→3'). */
  codingInput: string;
  coding: string;
  mutation: Mutation | null;
  applyPreset(id: string): void;
  setPanel(panel: Panel): void;
  setFov(fov: number): void;
  zoomTo(objectId: string): void;
  setSelected(id: string): void;
  setReference(id: string): void;
  setCodingInput(raw: string): void;
  setMutation(m: Mutation | null): void;
}

const initial = PRESETS[DEFAULT_PRESET_ID]!;

export const clampFov = (fov: number) => Math.min(FOV_MAX_M, Math.max(FOV_MIN_M, fov));

export const useBiologyUi = create<BiologyUiState>()((set) => ({
  presetId: initial.id,
  panel: initial.panel,
  fov: initial.fov ?? 1,
  selectedId: initial.selectedId ?? 'human',
  referenceId: initial.referenceId ?? 'red-blood-cell',
  codingInput: PRESETS['dna:example']!.coding!,
  coding: PRESETS['dna:example']!.coding!,
  mutation: null,
  applyPreset: (id) => {
    const p = PRESETS[id];
    if (!p) return;
    set((s) => ({
      presetId: p.id,
      panel: p.panel,
      fov: p.fov !== undefined ? clampFov(p.fov) : s.fov,
      selectedId: p.selectedId ?? s.selectedId,
      referenceId: p.referenceId ?? s.referenceId,
      codingInput: p.coding ?? s.codingInput,
      coding: p.coding ?? s.coding,
      mutation: p.panel === 'dna' ? (p.mutation ?? null) : s.mutation,
    }));
  },
  setPanel: (panel) => set({ panel }),
  setFov: (fov) => set({ fov: clampFov(fov) }),
  zoomTo: (objectId) => {
    const o = SCALE_OBJECTS_BY_ID.get(objectId);
    if (!o) return;
    // Put the object at about 60% of the view height so neighbours stay visible.
    set({ selectedId: objectId, fov: clampFov(o.size / 0.6) });
  },
  setSelected: (selectedId) => set({ selectedId }),
  setReference: (referenceId) => set({ referenceId }),
  setCodingInput: (raw) => {
    const cleaned = cleanSequence(raw);
    set((s) => ({ codingInput: raw, coding: isDna(cleaned) && cleaned.length > 0 ? cleaned : s.coding }));
  },
  setMutation: (mutation) => set({ mutation }),
}));
