import { lazy, Suspense } from 'react';
import { Home } from './Home';
import { useRoute } from './router';

const GravityWorld = lazy(() => import('@/worlds/gravity/ui/GravityWorld'));

export function App() {
  const route = useRoute();
  if (route.name === 'lesson' && route.worldId === 'gravity') {
    return (
      <Suspense fallback={<div className="loading" role="status">Loading Gravity Lab…</div>}>
        <GravityWorld lessonId={route.lessonId} stageIndex={route.stage} />
      </Suspense>
    );
  }
  return <Home />;
}
