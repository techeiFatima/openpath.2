import { useMemo } from 'react';
import { NBodySimulation } from '../model/nbody';
import { buildOrbitLab, buildSolarSystem } from '../model/presets';
import { useGravityUi } from './store';

/** One simulation instance per (mode, settings, runId); rendering and panels share it. */
export function useSimulation(): NBodySimulation {
  const mode = useGravityUi((s) => s.mode);
  const settings = useGravityUi((s) => s.settings);
  const runId = useGravityUi((s) => s.runId);
  const focusId = useGravityUi((s) => s.focusId);
  const sim = useMemo(() => {
    const params = mode === 'orbit-lab' ? buildOrbitLab(settings) : buildSolarSystem();
    return new NBodySimulation({ ...params, focusId });
    // settings is replaced wholesale by the store on every change, so identity is a fine key.
  }, [mode, settings, runId, focusId]);
  return sim;
}
