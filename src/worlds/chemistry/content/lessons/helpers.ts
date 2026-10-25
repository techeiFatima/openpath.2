import { electronConfiguration, formatSubshells, ionConfiguration, MADELUNG_ORDER, type ElectronConfiguration } from '@/worlds/chemistry/model/configuration';

/**
 * Builds the list of accepted spellings for an electron-configuration answer directly from
 * the model, so lesson answers can never drift from `configuration.ts`.
 * Accepted: spectroscopic order ("[Ar] 3d6 4s2") and Aufbau order ("[Ar] 4s2 3d6"), with or
 * without carets ("3d^6"), with or without a space after the noble-gas core. Unicode
 * superscripts are normalised by the grader itself.
 */
export type Notation = 'full' | 'noble-gas' | 'any';

function aufbauOrder(cfg: ElectronConfiguration): string {
  return formatSubshells([...cfg.subshells].sort((a, b) => MADELUNG_ORDER.indexOf(a.label) - MADELUNG_ORDER.indexOf(b.label)));
}

function aufbauNobleGas(cfg: ElectronConfiguration): string {
  const m = /^(\[[A-Za-z]+\])\s*(.*)$/.exec(cfg.nobleGasCore);
  if (!m) return aufbauOrder(cfg);
  const rest = m[2]!.split(' ').filter(Boolean);
  rest.sort((a, b) => MADELUNG_ORDER.indexOf(a.replace(/\d+$/, '')) - MADELUNG_ORDER.indexOf(b.replace(/\d+$/, '')));
  return `${m[1]} ${rest.join(' ')}`.trim();
}

const caret = (s: string) => s.replace(/([spdf])(\d+)/g, '$1^$2');

export function configurationAnswers(z: number, notation: Notation = 'any', charge = 0): string[] {
  const cfg = charge === 0 ? electronConfiguration(z) : ionConfiguration(z, charge);
  const out = new Set<string>();
  if (notation !== 'noble-gas') {
    for (const s of [cfg.full, aufbauOrder(cfg)]) {
      out.add(s);
      out.add(caret(s));
    }
  }
  if (notation !== 'full') {
    for (const s of [cfg.nobleGasCore, aufbauNobleGas(cfg)]) {
      out.add(s);
      out.add(caret(s));
      out.add(s.replace('] ', ']'));
      out.add(caret(s).replace('] ', ']'));
    }
  }
  return [...out];
}

/** Variants of a chemical formula answer: plain and with unicode subscripts are both normalised by the grader; we add case variants only. */
export function formulaAnswers(plain: string): string[] {
  return [plain, plain.toLowerCase()];
}
