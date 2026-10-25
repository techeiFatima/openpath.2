/**
 * Coverage report: how much of the planned curriculum is authored, implemented, reviewed
 * and learner-tested. Run with `npm run coverage`.
 */
import { CATALOG } from '../src/worlds/catalog';
import { validateGraph } from '../src/core/curriculum/graph';

const problems = validateGraph(CATALOG);
if (problems.length) {
  console.error('Catalog problems:\n' + problems.join('\n'));
  process.exit(1);
}

const bySubject = new Map<string, { courses: number; units: number; topics: number; objectives: number; authored: number; implemented: number; reviewed: number; tested: number }>();
for (const s of CATALOG.subjects) bySubject.set(s.id, { courses: 0, units: 0, topics: 0, objectives: 0, authored: 0, implemented: 0, reviewed: 0, tested: 0 });
const levelSubject = new Map(CATALOG.levels.map((l) => [l.id, l.subjectId]));
const courseSubject = new Map(CATALOG.courses.map((c) => [c.id, levelSubject.get(c.levelId)!]));
const unitSubject = new Map(CATALOG.units.map((u) => [u.id, courseSubject.get(u.courseId)!]));
const topicSubject = new Map(CATALOG.topics.map((t) => [t.id, unitSubject.get(t.unitId)!]));
const conceptSubject = new Map(CATALOG.concepts.map((c) => [c.id, topicSubject.get(c.topicId)!]));
const coverage = new Map(CATALOG.coverage.map((c) => [c.objectiveId, c]));

for (const c of CATALOG.courses) bySubject.get(courseSubject.get(c.id)!)!.courses++;
for (const u of CATALOG.units) bySubject.get(unitSubject.get(u.id)!)!.units++;
for (const t of CATALOG.topics) bySubject.get(topicSubject.get(t.id)!)!.topics++;
for (const o of CATALOG.objectives) {
  const row = bySubject.get(conceptSubject.get(o.conceptId)!)!;
  row.objectives++;
  const cov = coverage.get(o.id);
  if (cov?.authored) row.authored++;
  if (cov?.implemented) row.implemented++;
  if (cov?.scientificallyReviewed) row.reviewed++;
  if (cov?.learnerTested) row.tested++;
}

const pad = (s: string | number, n: number) => String(s).padStart(n);
console.log('OpenPath curriculum coverage\n');
console.log(`${'subject'.padEnd(13)}${pad('courses', 8)}${pad('units', 7)}${pad('topics', 8)}${pad('objectives', 11)}${pad('authored', 9)}${pad('implemented', 12)}${pad('reviewed', 9)}${pad('tested', 7)}`);
let totals = { courses: 0, units: 0, topics: 0, objectives: 0, authored: 0, implemented: 0, reviewed: 0, tested: 0 };
for (const [id, r] of bySubject) {
  console.log(`${id.padEnd(13)}${pad(r.courses, 8)}${pad(r.units, 7)}${pad(r.topics, 8)}${pad(r.objectives, 11)}${pad(r.authored, 9)}${pad(r.implemented, 12)}${pad(r.reviewed, 9)}${pad(r.tested, 7)}`);
  for (const k of Object.keys(totals) as (keyof typeof totals)[]) totals[k] += r[k];
}
console.log(`${'total'.padEnd(13)}${pad(totals.courses, 8)}${pad(totals.units, 7)}${pad(totals.topics, 8)}${pad(totals.objectives, 11)}${pad(totals.authored, 9)}${pad(totals.implemented, 12)}${pad(totals.reviewed, 9)}${pad(totals.tested, 7)}`);
console.log('\nUnits and topics are the PLANNED skeleton; objectives exist only where content was authored.');
console.log('"reviewed" = checked by a second subject expert; "tested" = tried with real learners. Both are 0 until that happens.');
