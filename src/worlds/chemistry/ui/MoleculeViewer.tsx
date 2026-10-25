import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { BOND_TYPE_LABELS, predictBond } from '../model/bonding';
import { elementBySymbol } from '../model/elements';
import { MOLECULES, moleculeByFormula, type Molecule, type Vec3 } from '../model/molecules';
import { useChemistryUi } from './store';

/** CPK-style colours and display radii (Å, symbolic). */
const CPK: Record<string, { color: string; radius: number }> = {
  H: { color: '#f2f2f2', radius: 0.24 },
  B: { color: '#ffb5b5', radius: 0.38 },
  C: { color: '#6b6b6b', radius: 0.38 },
  N: { color: '#3b6cf6', radius: 0.38 },
  O: { color: '#ff3d3d', radius: 0.38 },
  F: { color: '#8fe35a', radius: 0.36 },
  Na: { color: '#b65cff', radius: 0.55 },
  S: { color: '#ffe84a', radius: 0.46 },
  Cl: { color: '#2fe02f', radius: 0.5 },
};
const FALLBACK = { color: '#c0a0ff', radius: 0.4 };

const UP = new THREE.Vector3(0, 1, 0);

function Bond({ a, b, order, ionic }: { a: Vec3; b: Vec3; order: number; ionic: boolean }) {
  const { mid, quaternion, length, offsets } = useMemo(() => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
    const dir = vb.clone().sub(va);
    const length = dir.length();
    const unit = dir.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, unit);
    const helper = Math.abs(unit.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const perp = new THREE.Vector3().crossVectors(unit, helper).normalize();
    const gap = 0.13;
    const ks = order === 1 ? [0] : order === 2 ? [-gap, gap] : [-1.4 * gap, 0, 1.4 * gap];
    const offsets = ks.map((k) => perp.clone().multiplyScalar(k));
    return { mid: va.clone().add(vb).multiplyScalar(0.5), quaternion, length, offsets };
  }, [a, b, order]);
  return (
    <>
      {offsets.map((o, i) => (
        <mesh key={i} position={[mid.x + o.x, mid.y + o.y, mid.z + o.z]} quaternion={quaternion}>
          <cylinderGeometry args={[order === 1 ? 0.07 : 0.05, order === 1 ? 0.07 : 0.05, ionic ? length * 0.4 : length, 12]} />
          <meshStandardMaterial color={ionic ? '#ffd27a' : '#d8dcea'} roughness={0.6} transparent={ionic} opacity={ionic ? 0.5 : 1} />
        </mesh>
      ))}
    </>
  );
}

function MoleculeScene({ m }: { m: Molecule }) {
  return (
    <group>
      {m.atoms.map((atom, i) => {
        const s = CPK[atom.element] ?? FALLBACK;
        return (
          <mesh key={i} position={atom.position}>
            <sphereGeometry args={[s.radius, 32, 32]} />
            <meshStandardMaterial color={s.color} roughness={0.45} metalness={0.05} />
          </mesh>
        );
      })}
      {m.bonds.map((b, i) => (
        <Bond key={i} a={m.atoms[b.a]!.position} b={m.atoms[b.b]!.position} order={b.order} ionic={b.kind === 'ionic'} />
      ))}
    </group>
  );
}

export function MoleculeViewer() {
  const formula = useChemistryUi((s) => s.molecule);
  const setMolecule = useChemistryUi((s) => s.setMolecule);
  const m = moleculeByFormula(formula) ?? MOLECULES[0]!;
  const first = m.bonds[0];
  const ea = first ? elementBySymbol(m.atoms[first.a]!.element) : undefined;
  const eb = first ? elementBySymbol(m.atoms[first.b]!.element) : undefined;
  const pred = ea && eb ? predictBond(ea, eb) : null;

  return (
    <div className="mol-viewer">
      <div className="mol-canvas">
        <Canvas key={m.formula} camera={{ position: [0, 1.6, 5.2], fov: 40, near: 0.1, far: 100 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'low-power' }} aria-hidden="true">
          <color attach="background" args={['#05070f']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 6, 5]} intensity={2} />
          <directionalLight position={[-4, -2, -3]} intensity={0.6} />
          <MoleculeScene m={m} />
          <OrbitControls makeDefault enablePan={false} minDistance={2} maxDistance={14} />
        </Canvas>
        <p className="scale-note">Idealised VSEPR geometry (typical bond lengths, ideal angles), not measured coordinates. Drag to rotate.</p>
      </div>

      <div className="mol-facts" aria-live="polite">
        <label className="control">
          <span className="control-label">Molecule</span>
          <select value={m.formula} onChange={(e) => setMolecule(e.target.value)}>
            {MOLECULES.map((x) => <option key={x.formula} value={x.formula}>{x.formulaPretty} · {x.name}</option>)}
          </select>
        </label>
        <dl className="atom-facts">
          <div><dt>Atoms / bonds</dt><dd>{m.atoms.length} / {m.bonds.length} ({m.bonds.map((b) => `${m.atoms[b.a]!.element}${b.order === 1 ? '–' : b.order === 2 ? '=' : '≡'}${m.atoms[b.b]!.element}`).join(', ')})</dd></div>
          {m.vsepr ? (
            <>
              <div><dt>Central atom</dt><dd>{m.atoms[m.vsepr.centralIndex]!.element}: {m.vsepr.electronDomains - m.vsepr.lonePairs} bonded atom{m.vsepr.electronDomains - m.vsepr.lonePairs === 1 ? '' : 's'} + {m.vsepr.lonePairs} lone pair{m.vsepr.lonePairs === 1 ? '' : 's'} = <strong>{m.vsepr.electronDomains} domains</strong></dd></div>
              <div><dt>Electron geometry</dt><dd>{m.vsepr.electronGeometry}</dd></div>
              <div><dt>Molecular shape</dt><dd><strong>{m.vsepr.molecularGeometry}</strong></dd></div>
              <div><dt>Angle {m.vsepr.angleLabel}</dt><dd>ideal {m.vsepr.idealAngle}°{m.vsepr.measuredAngle !== null && <> · measured <strong>{m.vsepr.measuredAngle}°</strong></>}</dd></div>
            </>
          ) : (
            <div><dt>Shape</dt><dd>{m.bondClass === 'ionic' ? 'ionic lattice (no molecule)' : 'diatomic: linear'}</dd></div>
          )}
          <div><dt>Bonds</dt><dd>{m.bondClass}{pred && <span className="muted"> · ΔEN({ea!.symbol}–{eb!.symbol}) = {pred.deltaEN.toFixed(2)} → {BOND_TYPE_LABELS[pred.recommended]}</span>}</dd></div>
          <div><dt>Molecule</dt><dd><strong>{m.polarity}</strong></dd></div>
          <div><dt>Lone pairs</dt><dd>{m.atoms.map((a, i) => `${a.element} ${m.lonePairs[i]}`).join(', ')}</dd></div>
          {m.pubchemCid !== null && <div><dt>PubChem CID</dt><dd>{m.pubchemCid} <span className="muted">(reference only; not fetched)</span></dd></div>}
        </dl>
        {pred?.caveat && <p className="callout callout-assumption mol-caveat">{pred.caveat}</p>}
        <p className="muted small">{m.notes}</p>
      </div>
    </div>
  );
}
