import type { Scenario } from '../scenario';
import { libraryScenario } from './library';
import { marketScenario, marketVariantScenario } from './market';
import { neighbourScenario } from './neighbour';

export { libraryScenario, marketScenario, marketVariantScenario, neighbourScenario };

export const SCENARIOS: Scenario[] = [neighbourScenario, marketScenario, marketVariantScenario, libraryScenario];
export const SCENARIOS_BY_ID = new Map(SCENARIOS.map((s) => [s.id, s]));
