import { useEffect, useState } from 'react';

/**
 * Tiny hash router so the app works from any static host (including file:// and
 * low-bandwidth mirrors) without server configuration.
 *   #/                                  home
 *   #/world/:worldId/lesson/:lessonId?stage=n
 */
export type Route = { name: 'home' } | { name: 'lesson'; worldId: string; lessonId: string; stage: number };

export function parseHash(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?');
  const m = /^\/world\/([^/]+)\/lesson\/([^/?]+)/.exec(path ?? '');
  if (m) {
    const stage = Number(new URLSearchParams(query).get('stage') ?? '0');
    return { name: 'lesson', worldId: decodeURIComponent(m[1]!), lessonId: decodeURIComponent(m[2]!), stage: Number.isFinite(stage) ? Math.max(0, stage) : 0 };
  }
  return { name: 'home' };
}

export function lessonHref(worldId: string, lessonId: string, stage = 0): string {
  return `#/world/${encodeURIComponent(worldId)}/lesson/${encodeURIComponent(lessonId)}?stage=${stage}`;
}

export function navigate(href: string): void {
  if (location.hash !== href) location.hash = href;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
