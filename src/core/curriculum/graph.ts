import type { CurriculumGraph, LearningObjective } from './types';

export class CurriculumError extends Error {}

/** Index objectives by id, throwing on duplicates so content bugs surface in tests. */
export function indexObjectives(objectives: LearningObjective[]): Map<string, LearningObjective> {
  const map = new Map<string, LearningObjective>();
  for (const o of objectives) {
    if (map.has(o.id)) throw new CurriculumError(`Duplicate objective id: ${o.id}`);
    map.set(o.id, o);
  }
  return map;
}

/** Validate referential integrity of the whole graph. Returns a list of problems (empty = valid). */
export function validateGraph(g: CurriculumGraph): string[] {
  const problems: string[] = [];
  const ids = <T extends { id: string }>(xs: T[]) => new Set(xs.map((x) => x.id));
  const subjects = ids(g.subjects);
  const levels = ids(g.levels);
  const courses = ids(g.courses);
  const units = ids(g.units);
  const topics = ids(g.topics);
  const concepts = ids(g.concepts);
  const objectives = ids(g.objectives);

  for (const l of g.levels) if (!subjects.has(l.subjectId)) problems.push(`Level ${l.id} → missing subject ${l.subjectId}`);
  for (const c of g.courses) if (!levels.has(c.levelId)) problems.push(`Course ${c.id} → missing level ${c.levelId}`);
  for (const u of g.units) if (!courses.has(u.courseId)) problems.push(`Unit ${u.id} → missing course ${u.courseId}`);
  for (const t of g.topics) if (!units.has(t.unitId)) problems.push(`Topic ${t.id} → missing unit ${t.unitId}`);
  for (const c of g.concepts) if (!topics.has(c.topicId)) problems.push(`Concept ${c.id} → missing topic ${c.topicId}`);
  for (const o of g.objectives) {
    if (!concepts.has(o.conceptId)) problems.push(`Objective ${o.id} → missing concept ${o.conceptId}`);
    for (const p of o.prerequisiteIds) if (!objectives.has(p)) problems.push(`Objective ${o.id} → missing prerequisite ${p}`);
  }
  for (const c of g.coverage) if (!objectives.has(c.objectiveId)) problems.push(`Coverage → missing objective ${c.objectiveId}`);

  const cycle = findCycle(g.objectives);
  if (cycle) problems.push(`Prerequisite cycle: ${cycle.join(' → ')}`);
  return problems;
}

/** Returns one cycle (as a path of ids) if the prerequisite graph has one, else null. */
export function findCycle(objectives: LearningObjective[]): string[] | null {
  const byId = indexObjectives(objectives);
  const state = new Map<string, 'visiting' | 'done'>();
  const stack: string[] = [];
  const visit = (id: string): string[] | null => {
    const s = state.get(id);
    if (s === 'done') return null;
    if (s === 'visiting') {
      const i = stack.indexOf(id);
      return [...stack.slice(i), id];
    }
    state.set(id, 'visiting');
    stack.push(id);
    for (const p of byId.get(id)?.prerequisiteIds ?? []) {
      if (!byId.has(p)) continue; // reported by validateGraph
      const c = visit(p);
      if (c) return c;
    }
    stack.pop();
    state.set(id, 'done');
    return null;
  };
  for (const o of objectives) {
    const c = visit(o.id);
    if (c) return c;
  }
  return null;
}

/** Topological order: prerequisites before dependents. Throws on cycles. */
export function topologicalOrder(objectives: LearningObjective[]): string[] {
  if (findCycle(objectives)) throw new CurriculumError('Prerequisite graph has a cycle');
  const byId = indexObjectives(objectives);
  const out: string[] = [];
  const seen = new Set<string>();
  const visit = (id: string) => {
    if (seen.has(id)) return;
    seen.add(id);
    for (const p of byId.get(id)?.prerequisiteIds ?? []) if (byId.has(p)) visit(p);
    out.push(id);
  };
  for (const o of objectives) visit(o.id);
  return out;
}

/** All transitive prerequisites of an objective (excluding itself). */
export function transitivePrerequisites(objectiveId: string, objectives: LearningObjective[]): Set<string> {
  const byId = indexObjectives(objectives);
  const out = new Set<string>();
  const walk = (id: string) => {
    for (const p of byId.get(id)?.prerequisiteIds ?? []) {
      if (out.has(p)) continue;
      out.add(p);
      walk(p);
    }
  };
  walk(objectiveId);
  return out;
}

/**
 * Given a predicate for "the learner has mastered objective X", return the
 * direct prerequisites that are not yet mastered. This is what the Review stage and
 * the instructor use to pick a focused intervention.
 */
export function missingPrerequisites(
  objectiveId: string,
  objectives: LearningObjective[],
  isMastered: (id: string) => boolean,
): string[] {
  const byId = indexObjectives(objectives);
  return (byId.get(objectiveId)?.prerequisiteIds ?? []).filter((p) => !isMastered(p));
}
