import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Source { id: string; name: string; url: string; license: string; classification: string; evidence: string; uncertainty: string; commercialReuse: string }
interface Registry { verifiedOn: string; classifications: string[]; sources: Source[] }

const registry = JSON.parse(readFileSync(new URL('../../data/curriculum-sources.json', import.meta.url), 'utf8')) as Registry;

describe('curriculum source registry', () => {
  it('every source has the required fields and a valid classification', () => {
    const required = ['id', 'name', 'url', 'subject', 'levels', 'topics', 'intendedUse', 'license', 'version', 'commercialReuse', 'attribution', 'modification', 'embedding', 'automatedAccess', 'evidence', 'classification', 'uncertainty'];
    for (const s of registry.sources) {
      for (const f of required) expect((s as unknown as Record<string, unknown>)[f], `${s.id}.${f}`).toBeTruthy();
      expect(registry.classifications, s.id).toContain(s.classification);
      expect(s.url).toMatch(/^https?:\/\//);
    }
    expect(new Set(registry.sources.map((s) => s.id)).size).toBe(registry.sources.length);
  });

  it('nothing is "Verified for intended use" without repository-level evidence', () => {
    for (const s of registry.sources) {
      if (s.classification === 'Verified for intended use') expect(s.evidence, s.id).toMatch(/REPO/);
    }
  });

  it('no non-commercial license is classified as verified for intended use', () => {
    for (const s of registry.sources) {
      if (/NC|all rights reserved|non-commercial/i.test(s.license)) expect(s.classification, s.id).not.toBe('Verified for intended use');
    }
  });
});
