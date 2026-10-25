import { GENETIC_CODE, type DnaSummary, type MutationResult } from '../model/dna';

/**
 * 2D SVG renderer for the DNA workbench: coding strand, template strand, mRNA, codon boxes and
 * amino acids, plus the mutated gene when a mutation is active. Decorative (aria-hidden); the
 * readout panel shows the same strands as text.
 */
const CELL = 26;
const LEFT = 70;
const ROW = 42;

interface Props { summary: DnaSummary; mutation: MutationResult | null }

export function DnaScene({ summary, mutation }: Props) {
  const n = Math.max(summary.coding.length, mutation?.mutated.length ?? 0);
  const width = Math.max(560, LEFT + n * CELL + 60);
  const rows = mutation ? 7 : 4;
  const height = 40 + rows * ROW + 20;
  const codonColours = (_seq: string, i: number) => `codon-${Math.floor(i / 3) % 2}`;

  return (
    <svg className="bio-svg bio-dna-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMinYMid meet" aria-hidden="true" focusable="false">
      <rect x={0} y={0} width={width} height={height} className="bio-bg" />
      <StrandRow y={40} label="5′ coding" tail="3′" seq={summary.coding} cls={() => 'base-dna'} />
      <HBonds y={40} seq={summary.coding} />
      <StrandRow y={40 + ROW} label="3′ template" tail="5′" seq={summary.template3to5} cls={() => 'base-template'} />
      <StrandRow y={40 + 2 * ROW} label="5′ mRNA" tail="3′" seq={summary.mrna} cls={codonColours} />
      <AminoRow y={40 + 3 * ROW} codons={summary.codons} residues={summary.translation} />
      {mutation && (
        <>
          <line x1={LEFT - 60} y1={40 + 4 * ROW - 14} x2={width - 10} y2={40 + 4 * ROW - 14} className="stroke-divider" />
          <StrandRow y={40 + 4 * ROW + 4} label="mutated" tail="" seq={mutation.mutated} cls={(seq, i) => (seq[i] !== summary.coding[i] ? 'base-changed' : 'base-dna')} />
          <StrandRow y={40 + 5 * ROW + 4} label="mRNA" tail="" seq={mutation.mutated.replace(/T/g, 'U')} cls={codonColours} />
          <AminoRow y={40 + 6 * ROW + 4} codons={chunk(mutation.mutated.replace(/T/g, 'U'))} residues={mutation.mutatedProtein} compareTo={summary.translation.codonsRead} />
        </>
      )}
    </svg>
  );
}

function chunk(seq: string): string[] {
  const out: string[] = [];
  for (let i = 0; i + 3 <= seq.length; i += 3) out.push(seq.slice(i, i + 3));
  return out;
}

function StrandRow({ y, label, tail, seq, cls }: { y: number; label: string; tail: string; seq: string; cls: (seq: string, i: number) => string }) {
  return (
    <g>
      <text x={LEFT - 8} y={y + 18} textAnchor="end" className="bio-strand-label">{label}</text>
      {[...seq].map((b, i) => (
        <g key={i} className={`bio-base ${cls(seq, i)}`}>
          <rect x={LEFT + i * CELL} y={y} width={CELL - 2} height={CELL} rx={4} />
          <text x={LEFT + i * CELL + (CELL - 2) / 2} y={y + 18} textAnchor="middle">{b}</text>
        </g>
      ))}
      {tail && <text x={LEFT + seq.length * CELL + 4} y={y + 18} className="bio-strand-label">{tail}</text>}
    </g>
  );
}

function HBonds({ y, seq }: { y: number; seq: string }) {
  return (
    <g className="stroke-hbond">
      {[...seq].map((b, i) => {
        const x = LEFT + i * CELL + (CELL - 2) / 2;
        const bonds = b === 'G' || b === 'C' ? 3 : 2;
        return Array.from({ length: bonds }, (_, k) => {
          const dx = (k - (bonds - 1) / 2) * 5;
          return <line key={`${i}-${k}`} x1={x + dx} y1={y + CELL + 1} x2={x + dx} y2={y + ROW - 1} />;
        });
      })}
    </g>
  );
}

function AminoRow({ y, codons, residues, compareTo }: { y: number; codons: string[]; residues: DnaSummary['translation']; compareTo?: string[] }) {
  return (
    <g>
      <text x={LEFT - 8} y={y + 18} textAnchor="end" className="bio-strand-label">protein</text>
      {codons.map((c, i) => {
        if (i >= residues.codonsRead.length) return null;
        const aa = GENETIC_CODE[c]!;
        const changed = compareTo ? (compareTo[i] ? GENETIC_CODE[compareTo[i]!]!.code1 !== aa.code1 : true) : false;
        const cls = aa.code1 === '*' ? 'aa-stop' : changed ? 'aa-changed' : 'aa';
        return (
          <g key={i} className={`bio-aa ${cls}`}>
            <rect x={LEFT + i * 3 * CELL} y={y} width={3 * CELL - 4} height={CELL} rx={13} />
            <text x={LEFT + i * 3 * CELL + (3 * CELL - 4) / 2} y={y + 18} textAnchor="middle">{aa.code3}</text>
          </g>
        );
      })}
      {!residues.terminated && residues.codonsRead.length > 0 && (
        <text x={LEFT + residues.codonsRead.length * 3 * CELL + 6} y={y + 18} className="bio-strand-label">no stop codon</text>
      )}
    </g>
  );
}
