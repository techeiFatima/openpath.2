import { describe, expect, it } from 'vitest';
import { lessonHref, parseHash } from './router';

describe('hash router', () => {
  it('parses lesson routes with stage', () => {
    expect(parseHash('#/world/gravity/lesson/gravity.escape?stage=3')).toEqual({ name: 'lesson', worldId: 'gravity', lessonId: 'gravity.escape', stage: 3 });
  });
  it('defaults to home and stage 0', () => {
    expect(parseHash('')).toEqual({ name: 'home' });
    expect(parseHash('#/nonsense')).toEqual({ name: 'home' });
    expect(parseHash('#/world/g/lesson/l').name === 'lesson' && parseHash('#/world/g/lesson/l')).toMatchObject({ stage: 0 });
  });
  it('round-trips hrefs', () => {
    const href = lessonHref('gravity', 'gravity.falling-around-earth', 2);
    expect(parseHash(href)).toEqual({ name: 'lesson', worldId: 'gravity', lessonId: 'gravity.falling-around-earth', stage: 2 });
  });
});
