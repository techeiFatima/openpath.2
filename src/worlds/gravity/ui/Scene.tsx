import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { AU_M, BODIES, PLANET_IDS } from '../model/bodies';
import type { Body, NBodySimulation, Vec3 } from '../model/nbody';
import type { Mode } from './presets';

/**
 * Rendering layer. Reads the live simulation each frame and maps SI positions to scene
 * units. It never computes physics. Two coordinate mappings:
 *  - orbit lab: 1 scene unit = radius of the central body (true proportions)
 *  - solar system: distances compressed as 6·(d/au)^0.5 so all planets fit on screen
 *    (clearly labelled "not to scale" in the UI); planet radii are symbolic.
 */

export interface SceneProps {
  sim: NBodySimulation;
  mode: Mode;
  running: boolean;
  timeScale: number;
  showOrbits: boolean;
  focusId: string;
}

type Mapper = (p: Readonly<Vec3>) => [number, number, number];

function makeMapper(mode: Mode, central: Body | undefined): Mapper {
  if (mode === 'orbit-lab') {
    const R = central?.radius ?? 1;
    return (p) => [p[0] / R, p[1] / R, p[2] / R];
  }
  return (p) => {
    const d = Math.hypot(p[0], p[1], p[2]);
    if (d === 0) return [0, 0, 0];
    const k = (6 * Math.sqrt(d / AU_M)) / d;
    return [p[0] * k, p[1] * k, p[2] * k];
  };
}

function renderRadius(mode: Mode, b: Body, central: Body | undefined): number {
  if (mode === 'orbit-lab') return b.kind === 'satellite' ? 0.025 : b.radius / (central?.radius ?? 1);
  if (b.kind === 'star') return 0.7;
  const mercury = BODIES.mercury!.mass;
  return 0.1 + 0.075 * Math.log10(Math.max(1, b.mass / mercury));
}

const TRAIL_POINTS = 1500;

function Trail({ sim, bodyId, map, color }: { sim: NBodySimulation; bodyId: string; map: Mapper; color: string }) {
  const positions = useMemo(() => new Float32Array(TRAIL_POINTS * 3), []);
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL_POINTS * 3), 3));
    geometry.setDrawRange(0, 0);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8 });
    const obj = new THREE.Line(geometry, material);
    obj.frustumCulled = false;
    return obj;
  }, [color]);
  const count = useRef(0);
  const head = useRef(0);
  const lastTime = useRef(-1);

  useEffect(() => {
    count.current = 0;
    head.current = 0;
    lastTime.current = -1;
    line.geometry.setDrawRange(0, 0);
  }, [sim, line]);

  useEffect(() => () => { line.geometry.dispose(); (line.material as THREE.Material).dispose(); }, [line]);

  useFrame(() => {
    const b = sim.body(bodyId);
    if (!b) return;
    if (sim.time !== lastTime.current && !b.crashed) {
      lastTime.current = sim.time;
      const [x, y, z] = map(b.position);
      const i = head.current * 3;
      positions[i] = x; positions[i + 1] = y; positions[i + 2] = z;
      head.current = (head.current + 1) % TRAIL_POINTS;
      count.current = Math.min(count.current + 1, TRAIL_POINTS);
    }
    // Re-order the ring buffer into a contiguous polyline (oldest → newest).
    const attr = line.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const n = count.current;
    const start = n < TRAIL_POINTS ? 0 : head.current;
    for (let k = 0; k < n; k++) {
      const src = ((start + k) % TRAIL_POINTS) * 3;
      arr[k * 3] = positions[src]!; arr[k * 3 + 1] = positions[src + 1]!; arr[k * 3 + 2] = positions[src + 2]!;
    }
    line.geometry.setDrawRange(0, n);
    attr.needsUpdate = true;
  });

  return <primitive object={line} />;
}

/** Analytic orbit outlines for the solar system (perihelion at each planet's start angle). */
function OrbitRings({ map }: { map: Mapper }) {
  const rings = useMemo(() => {
    return PLANET_IDS.map((id, i) => {
      const p = BODIES[id]!;
      const a = p.semiMajorAxis!;
      const e = p.eccentricity ?? 0;
      const theta0 = (i * 2 * Math.PI) / PLANET_IDS.length + 0.3;
      const pts: THREE.Vector3[] = [];
      for (let k = 0; k <= 256; k++) {
        const nu = (k / 256) * 2 * Math.PI;
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(nu));
        const ang = theta0 + nu;
        const [x, y, z] = map([r * Math.cos(ang), 0, r * Math.sin(ang)]);
        pts.push(new THREE.Vector3(x, y, z));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(pts);
      const material = new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.35 });
      return { id, line: new THREE.Line(geometry, material) };
    });
  }, [map]);
  useEffect(() => () => rings.forEach((r) => { r.line.geometry.dispose(); (r.line.material as THREE.Material).dispose(); }), [rings]);
  return (
    <>
      {rings.map((r) => <primitive key={r.id} object={r.line} />)}
    </>
  );
}

function Bodies({ sim, mode, running, timeScale, map }: SceneProps & { map: Mapper }) {
  const meshRefs = useRef<Record<string, THREE.Mesh | null>>({});
  const bodies = sim.peek();
  const central = bodies.find((b) => b.fixed) ?? bodies.find((b) => b.kind === 'star');

  useFrame((_, delta) => {
    if (running) sim.step(Math.min(delta, 0.1) * timeScale);
    for (const b of sim.peek()) {
      const [x, y, z] = map(b.position);
      meshRefs.current[b.id]?.position.set(x, y, z);
    }
  });

  return (
    <>
      {bodies.map((b) => {
        const r = renderRadius(mode, b, central);
        const isLight = b.kind === 'star';
        return (
          <group key={b.id}>
            <mesh ref={(m) => { meshRefs.current[b.id] = m; }} position={map(b.position)}>
              <sphereGeometry args={[r, b.kind === 'satellite' ? 12 : 48, b.kind === 'satellite' ? 12 : 48]} />
              {isLight ? (
                <meshBasicMaterial color={b.color} />
              ) : b.kind === 'satellite' ? (
                <meshBasicMaterial color={b.crashed ? '#ff5d5d' : b.color} />
              ) : (
                <meshStandardMaterial color={b.color} roughness={0.9} metalness={0} />
              )}
            </mesh>
            {isLight && <pointLight position={map(b.position)} intensity={mode === 'orbit-lab' ? 0 : 60} distance={0} decay={1.2} color="#fff2d0" />}
          </group>
        );
      })}
    </>
  );
}


type LabelRefs = MutableRefObject<Record<string, HTMLSpanElement | null>>;

/**
 * Projects body positions to screen space every frame and moves plain DOM labels that
 * live in an overlay outside the canvas. Avoids portal-based HTML inside the scene graph,
 * which breaks on unmount, and keeps labels readable by assistive technology.
 */
function LabelProjector({ sim, map, labelRefs }: { sim: NBodySimulation; map: Mapper; labelRefs: LabelRefs }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const b of sim.peek()) {
      const el = labelRefs.current[b.id];
      if (!el) continue;
      const [x, y, z] = map(b.position);
      v.set(x, y, z).project(camera);
      const visible = v.z < 1;
      const px = ((v.x + 1) / 2) * size.width;
      const py = ((1 - v.y) / 2) * size.height;
      el.style.transform = `translate(-50%, 0) translate(${px.toFixed(1)}px, ${(py + 10).toFixed(1)}px)`;
      el.style.opacity = visible ? '1' : '0';
      el.textContent = b.crashed ? `${b.name} (crashed)` : b.name;
    }
  });
  return null;
}

export function Scene(props: SceneProps) {
  const { sim, mode, showOrbits } = props;
  const bodies = sim.peek();
  const central = bodies.find((b) => b.fixed) ?? bodies.find((b) => b.kind === 'star');
  const map = useMemo(() => makeMapper(mode, central), [mode, central]);
  const cameraPos: [number, number, number] = mode === 'orbit-lab' ? [0, 2.2, 4.2] : [0, 26, 34];
  const labelRefs: LabelRefs = useRef({});
  const labelled = bodies.filter((b) => mode === 'solar-system' || b.id === props.focusId || b.fixed);
  return (
    <div className="scene-root">
    <Canvas
      key={mode}
      camera={{ position: cameraPos, fov: 42, near: 0.01, far: 500 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      aria-hidden="true"
    >
      <color attach="background" args={['#05070f']} />
      <Stars radius={200} depth={50} count={2500} factor={3} saturation={0} fade speed={0} />
      <ambientLight intensity={mode === 'orbit-lab' ? 0.35 : 0.08} />
      {mode === 'orbit-lab' && <directionalLight position={[8, 4, 6]} intensity={2.2} color="#fff4e0" />}
      <Bodies {...props} map={map} />
      {mode === 'solar-system' && showOrbits && <OrbitRings map={map} />}
      {mode === 'orbit-lab' && showOrbits && <Trail sim={sim} bodyId="probe" map={map} color="#8fd3ff" />}
      <LabelProjector sim={sim} map={map} labelRefs={labelRefs} />
      <OrbitControls makeDefault enablePan={false} minDistance={mode === 'orbit-lab' ? 1.3 : 4} maxDistance={mode === 'orbit-lab' ? 40 : 120} />
    </Canvas>
    <div className="scene-labels" aria-hidden="true">
      {labelled.map((b) => (
        <span key={b.id} className="scene-label" ref={(el) => { labelRefs.current[b.id] = el; }}>{b.name}</span>
      ))}
    </div>
    </div>
  );
}
