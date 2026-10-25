/** Human-friendly formatting of SI measurements for the panel. */
const sig = (v: number, n = 3) => {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e6 || abs < 1e-3) return v.toExponential(n - 1).replace('e+', '×10^');
  return Number(v.toPrecision(n)).toLocaleString();
};

export function formatSI(value: number, unit: string): string {
  if (!Number.isFinite(value)) return value > 0 ? '∞' : value < 0 ? '−∞' : '—';
  switch (unit) {
    case 'm': {
      const abs = Math.abs(value);
      if (abs >= 1.5e10) return `${sig(value / 1.495978707e11)} au`;
      if (abs >= 1e3) return `${sig(value / 1e3, 4)} km`;
      return `${sig(value)} m`;
    }
    case 's': {
      const abs = Math.abs(value);
      if (abs >= 2 * 365.25 * 86400) return `${sig(value / (365.25 * 86400))} years`;
      if (abs >= 2 * 86400) return `${sig(value / 86400)} days`;
      if (abs >= 7200) return `${sig(value / 3600)} h`;
      if (abs >= 120) return `${sig(value / 60)} min`;
      return `${sig(value)} s`;
    }
    case 'm/s':
      return Math.abs(value) >= 1e3 ? `${sig(value / 1e3, 4)} km/s` : `${sig(value)} m/s`;
    case 'J/kg':
      return Math.abs(value) >= 1e6 ? `${sig(value / 1e6)} MJ/kg` : `${sig(value)} J/kg`;
    case '':
      return sig(value);
    default:
      return `${sig(value)} ${unit}`;
  }
}
