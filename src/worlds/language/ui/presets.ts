import type { Scenario } from '../model/scenario';
import { libraryScenario, marketScenario, marketVariantScenario, neighbourScenario } from '../model/scenarios';
import type { VocabularyGroup } from '../model/vocabulary';

/**
 * Presets bridge lesson prose and the dialogue model: lesson blocks name a preset id, the
 * world maps it to a scenario and the phrasebook group to show alongside it.
 */
export interface UiPreset {
  id: string;
  label: string;
  scenario: Scenario;
  vocabularyGroup: VocabularyGroup;
  description: string;
}

export const PRESETS: Record<string, UiPreset> = {
  'scenario:neighbour': { id: 'scenario:neighbour', label: 'Meeting a neighbour', scenario: neighbourScenario, vocabularyGroup: 'neighbour', description: 'Sara from next door says hello. Greet her, give your name, say where you are from.' },
  'scenario:market': { id: 'scenario:market', label: 'At the market', scenario: marketScenario, vocabularyGroup: 'market', description: 'Buy apples, eggs and milk from Omar. Ask prices and use please.' },
  'scenario:market-variant': { id: 'scenario:market-variant', label: 'At the market: oranges and bread', scenario: marketVariantScenario, vocabularyGroup: 'market', description: 'Same stall, new items and prices. Check the total before you pay.' },
  'scenario:library': { id: 'scenario:library', label: 'Finding the library', scenario: libraryScenario, vocabularyGroup: 'library', description: 'Ask Tom the way to the library and repeat the directions back.' },
};

export const DEFAULT_PRESET_ID = 'scenario:neighbour';
