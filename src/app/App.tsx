import { lazy, Suspense, type ComponentType } from 'react';
import { Home } from './Home';
import { useRoute } from './router';

interface WorldProps { lessonId: string; stageIndex: number }

/** Worlds are code-split: the home page never loads Three.js or a world's content. */
const WORLD_COMPONENTS: Record<string, ComponentType<WorldProps>> = {
  gravity: lazy(() => import('@/worlds/gravity/ui/GravityWorld')),
  'functions-calculus': lazy(() => import('@/worlds/math/ui/MathWorld')),
  cell: lazy(() => import('@/worlds/biology/ui/BiologyWorld')),
};

export function App() {
  const route = useRoute();
  if (route.name === 'lesson') {
    const World = WORLD_COMPONENTS[route.worldId];
    if (World) {
      return (
        <Suspense fallback={<div className="loading" role="status">Loading world…</div>}>
          <World lessonId={route.lessonId} stageIndex={route.stage} />
        </Suspense>
      );
    }
  }
  return <Home />;
}
