import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Attempt } from './mastery';

/**
 * Persistent learner state. Local-first: everything lives in localStorage today so the
 * platform works offline and without accounts; a sync layer can mirror this later.
 */
export interface Location {
  worldId: string;
  lessonId: string;
  stageIndex: number;
}

export interface Prediction {
  id: string;
  lessonId: string;
  choiceId: string;
  wasCorrect: boolean | null;
  timestamp: number;
}

interface LearnerState {
  learnerId: string;
  attempts: Attempt[];
  predictions: Prediction[];
  /** Hints revealed per problem id (persisted so refreshing does not reset the hint budget). */
  hintsRevealed: Record<string, number>;
  lastLocation: Location | null;
  completedStages: Record<string, number[]>; // lessonId → stage indices completed
  textMode: boolean;
  recordAttempt(a: Omit<Attempt, 'id' | 'timestamp'>): void;
  recordPrediction(p: Omit<Prediction, 'id' | 'timestamp'>): void;
  revealHint(problemId: string): number;
  setLocation(loc: Location): void;
  completeStage(lessonId: string, stageIndex: number): void;
  setTextMode(on: boolean): void;
  reset(): void;
}

const newId = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

const initial = () => ({
  learnerId: newId(),
  attempts: [] as Attempt[],
  predictions: [] as Prediction[],
  hintsRevealed: {} as Record<string, number>,
  lastLocation: null as Location | null,
  completedStages: {} as Record<string, number[]>,
  textMode: false,
});

export const useLearnerStore = create<LearnerState>()(
  persist(
    (set, get) => ({
      ...initial(),
      recordAttempt: (a) => set((s) => ({ attempts: [...s.attempts, { ...a, id: newId(), timestamp: Date.now() }] })),
      recordPrediction: (p) => set((s) => ({ predictions: [...s.predictions, { ...p, id: newId(), timestamp: Date.now() }] })),
      revealHint: (problemId) => {
        const next = (get().hintsRevealed[problemId] ?? 0) + 1;
        set((s) => ({ hintsRevealed: { ...s.hintsRevealed, [problemId]: next } }));
        return next;
      },
      setLocation: (loc) => set({ lastLocation: loc }),
      completeStage: (lessonId, stageIndex) =>
        set((s) => {
          const done = new Set(s.completedStages[lessonId] ?? []);
          done.add(stageIndex);
          return { completedStages: { ...s.completedStages, [lessonId]: [...done].sort((a, b) => a - b) } };
        }),
      setTextMode: (on) => set({ textMode: on }),
      reset: () => set({ ...initial() }),
    }),
    {
      name: 'openpath.learner.v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        learnerId: s.learnerId,
        attempts: s.attempts,
        predictions: s.predictions,
        hintsRevealed: s.hintsRevealed,
        lastLocation: s.lastLocation,
        completedStages: s.completedStages,
        textMode: s.textMode,
      }),
    },
  ),
);
