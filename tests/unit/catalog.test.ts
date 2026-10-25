import { describe, expect, it } from 'vitest';
import { validateGraph } from '@/core/curriculum/graph';
import { CATALOG } from '@/worlds/catalog';
import { PLANNED_TOPIC_LIST, PLANNED_UNIT_LIST, PLANNED_UNITS } from '@/worlds/curriculum-maps';

describe('curriculum catalog', () => {
  it('is referentially sound and acyclic', () => {
    expect(validateGraph(CATALOG)).toEqual([]);
  });
  it('every planned course exists in the catalog and every course has at least one unit', () => {
    const courseIds = new Set(CATALOG.courses.map((c) => c.id));
    for (const id of Object.keys(PLANNED_UNITS)) expect(courseIds.has(id), id).toBe(true);
    const unitsPerCourse = new Map<string, number>();
    for (const u of CATALOG.units) unitsPerCourse.set(u.courseId, (unitsPerCourse.get(u.courseId) ?? 0) + 1);
    for (const c of CATALOG.courses) expect(unitsPerCourse.get(c.id) ?? 0, c.id).toBeGreaterThan(0);
  });
  it('planned ids are unique and every unit has topics', () => {
    expect(new Set(PLANNED_UNIT_LIST.map((u) => u.id)).size).toBe(PLANNED_UNIT_LIST.length);
    expect(new Set(PLANNED_TOPIC_LIST.map((t) => t.id)).size).toBe(PLANNED_TOPIC_LIST.length);
    const withTopics = new Set(PLANNED_TOPIC_LIST.map((t) => t.unitId));
    for (const u of PLANNED_UNIT_LIST) expect(withTopics.has(u.id), u.id).toBe(true);
  });
  it('implemented units replace planned units with the same course and name', () => {
    const keys = CATALOG.units.map((u) => `${u.courseId}::${u.name.toLowerCase()}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
