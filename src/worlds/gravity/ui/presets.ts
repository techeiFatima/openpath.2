import { circularSpeed, escapeSpeed } from '../model/analytic';
import { BODIES, mu } from '../model/bodies';
import type { OrbitLabSettings } from '../model/presets';

export type Mode = 'orbit-lab' | 'solar-system';

export interface UiPreset {
  id: string;
  label: string;
  mode: Mode;
  settings?: OrbitLabSettings;
  /** Simulated seconds per real second. */
  timeScale: number;
  focusId?: string;
  description: string;
}

const earth = BODIES.earth!;
const R_ISS = earth.radius + 400e3;
const VC_ISS = circularSpeed(mu(earth), R_ISS);
const VESC_ISS = escapeSpeed(mu(earth), R_ISS);
const DAY = 86400;

export const PRESETS: Record<string, UiPreset> = {
  'orbit-lab:iss': { id: 'orbit-lab:iss', label: 'Space Station orbit', mode: 'orbit-lab', timeScale: 120, settings: { centralId: 'earth', distance: R_ISS, speed: Math.round(VC_ISS), angleDeg: 0 }, description: 'A probe 400 km up at the circular-orbit speed.' },
  'orbit-lab:free': { id: 'orbit-lab:free', label: 'Free experiment', mode: 'orbit-lab', timeScale: 120, settings: { centralId: 'earth', distance: R_ISS, speed: Math.round(VC_ISS), angleDeg: 0 }, description: 'Change anything.' },
  'orbit-lab:stopped': { id: 'orbit-lab:stopped', label: 'Station with zero sideways speed', mode: 'orbit-lab', timeScale: 60, settings: { centralId: 'earth', distance: R_ISS, speed: 0, angleDeg: 0 }, description: 'No sideways motion: it just falls.' },
  'orbit-lab:cannon': { id: 'orbit-lab:cannon', label: "Newton's cannon", mode: 'orbit-lab', timeScale: 120, settings: { centralId: 'earth', distance: earth.radius + 100e3, speed: 4000, angleDeg: 0 }, description: 'Fired horizontally from a 100 km mountain at 4 km/s.' },
  'orbit-lab:fast': { id: 'orbit-lab:fast', label: 'Faster than circular', mode: 'orbit-lab', timeScale: 240, settings: { centralId: 'earth', distance: R_ISS, speed: Math.round(VC_ISS * 1.2), angleDeg: 0 }, description: '20% above circular speed: a stretched ellipse.' },
  'orbit-lab:escape': { id: 'orbit-lab:escape', label: 'Escape speed', mode: 'orbit-lab', timeScale: 600, settings: { centralId: 'earth', distance: R_ISS, speed: Math.round(VESC_ISS * 1.005), angleDeg: 0 }, description: 'Just above escape speed: never comes back.' },
  'solar-system': { id: 'solar-system', label: 'Solar system', mode: 'solar-system', timeScale: 20 * DAY, focusId: 'earth', description: 'Sun and eight planets. Distances compressed for display.' },
};

export const DEFAULT_PRESET_ID = 'orbit-lab:iss';
