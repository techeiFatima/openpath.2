import type { ScenarioCharacter } from '../model/scenario';

/** Simple decorative SVG portrait per character role. The name is rendered as text next to it. */
export function Avatar({ kind, size = 56 }: { kind: ScenarioCharacter['avatar']; size?: number }) {
  const skin = '#e8b98a';
  const accent = kind === 'neighbour' ? '#8fd3ff' : kind === 'shopkeeper' ? '#6fe3a5' : '#ffd27a';
  return (
    <svg className="avatar" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="31" fill="var(--bg-elev-2)" stroke="var(--line)" />
      {/* shoulders */}
      <path d="M12 60 Q32 40 52 60 Z" fill={accent} />
      {/* head */}
      <circle cx="32" cy="27" r="12" fill={skin} />
      {kind === 'neighbour' && <path d="M19 26 Q32 6 45 26 L45 30 Q32 20 19 30 Z" fill="#3b2a20" />}
      {kind === 'shopkeeper' && (
        <>
          <path d="M18 22 Q32 8 46 22 L48 24 L16 24 Z" fill="#2e3a5c" />
          <rect x="24" y="44" width="16" height="16" fill="#f4f6fb" opacity="0.85" />
        </>
      )}
      {kind === 'passer-by' && (
        <>
          <rect x="17" y="17" width="30" height="5" rx="2" fill="#2e3a5c" />
          <rect x="22" y="8" width="20" height="11" rx="2" fill="#2e3a5c" />
        </>
      )}
      {/* eyes and smile */}
      <circle cx="27.5" cy="27" r="1.4" fill="#2b1d16" />
      <circle cx="36.5" cy="27" r="1.4" fill="#2b1d16" />
      <path d="M27 32 Q32 36 37 32" stroke="#2b1d16" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
