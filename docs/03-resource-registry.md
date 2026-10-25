# 03 · Curriculum Source Registry

**Verified on:** 2026-10-25  
**Machine-readable copy:** `data/curriculum-sources.json` (validated by `tests/unit/sources.test.ts`).

## How this was verified, and why most rows say *Unverified*

Official license pages were requested directly; this build environment's network policy blocked every official educational host (HTTP CONNECT 403 / DNS failure). Where an official source-code repository on GitHub/GitLab carried the license text, it was read verbatim ([REPO]). Everything else rests on search-engine snippets restricted to the official domain ([SNIPPET]) and is classified Unverified or Permission required until the live page is read.

**Consequences for the product today:**

- No third-party curriculum text, problems, images or simulations are copied into OpenPath. All Gravity Lab content is original and aligned to cited standard codes.
- Standards (NGSS, CCSS-M) are cited by code with a short paraphrase; verbatim reproduction waits for a read of the official terms.
- The brief assumed several OpenStax titles are CC BY. Reading the official `openstax/osbooks-*` repositories shows **all 15 titles checked are CC BY-NC-SA 4.0**, so commercial reuse needs OpenStax permission. They remain valuable as accuracy references.
- PhET: licensing changed in 2026 (CC BY 4.0 only for HTML5 sims released before 2026-03-29; later releases unverified, likely CC BY-NC) and CU Boulder states all commercial use needs a license. PhET is a design reference only; nothing is embedded.
- Illustrative Mathematics first edition (2019–2021) is reported as CC BY 4.0 and is the strongest candidate for K–12 mathematics content reuse once the live terms page is read; v.360 is CC BY-NC.
- For element data, the RSC table is all-rights-reserved; a reusable dataset must be chosen for Chemistry World (PubChem per-source licenses need filtering; RCSB PDB archive data is CC0).

Legend: **[REPO]** read verbatim from the official source repository; **[SNIPPET]** official-domain search snippet, not a direct page read.

## Summary

| Resource | Subject · levels | Best-evidence license | Commercial reuse | Evidence | Classification |
|---|---|---|---|---|---|
| Common Core State Standards – Mathematics | mathematics · K–12 | Bespoke NGA/CCSSO Public License (+ separate Commercial License) | unclear | SNIPPET | **Unverified** |
| Illustrative Mathematics – IM K–12 Math | mathematics · K–12 | CC BY 4.0 (first edition only) | allowed (if confirmed) | SNIPPET | **Unverified** |
| Illustrative Mathematics – IM TK–12 Math v.360 | mathematics · TK–12 | CC BY-NC 4.0; commercial use requires Restricted Use License from IM | not allowed without license | SNIPPET | **Permission required** |
| OpenStax | mathematics, physics, chemistry, biology · University (and HS AP-equivalent) | CC BY-NC-SA 4.0 for ALL 15 titles (none is CC BY) | not allowed; OpenStax content-reuse request form | REPO | **Permission required** |
| Open Middle | mathematics · K–12 | Conflicting: CC BY-NC-SA 4.0 on problem pages vs 'All rights reserved' (Glenrock Consulting) on others | not allowed | SNIPPET | **Unverified** |
| Mathigon | mathematics · Middle school–early university | All rights reserved (© Mathigon/Amplify); non-commercial use only; commercial agreement required | not allowed | REPO | **Permission required** |
| Mathigon Studio | mathematics · n/a | MIT (code); CC BY-SA 4.0 (media/UI assets); SIL OFL (fonts); trademarks excluded | allowed (code) | REPO | **Verified for intended use** |
| MAA – CUPM Curriculum Guide | mathematics · University | Not stated; presumed © MAA all rights reserved | unclear | SNIPPET | **Unverified** |
| Linear Algebra | mathematics · University | GNU FDL or CC BY-SA 3.0 US, at user's choice | allowed (copyleft) | REPO | **Verified for intended use** |
| Discrete Mathematics: An Open Introduction | mathematics · University | 4th ed.: CC BY-NC-SA 4.0; 3rd ed. and earlier: CC BY-SA 4.0 | 4th ed. not allowed; 3rd ed. allowed (copyleft) | REPO | **Permission required** |
| Book of Proof | mathematics · University | CC BY-ND (per Open Textbook Library listing) | allowed but no derivatives | SNIPPET | **Reference-only** |
| Active Calculus | mathematics · University | CC BY-NC-SA (per OTL listing) | not allowed | SNIPPET | **Permission required** |
| APEX Calculus | mathematics · University | CC BY-NC 4.0 (V5 repository README) | not allowed | REPO | **Permission required** |
| A First Course in Linear Algebra | mathematics · University | GNU FDL 1.2 or later, no invariant sections | allowed (copyleft; derivatives stay GFDL) | REPO | **Verified for intended use** |
| Next Generation Science Standards | physics, chemistry, biology · K–12 | Blanket permission to copy/adapt for states, districts, schools, teachers and non-profit education entities; standards copyright held by National Academies Press; trademarks WestEd | not granted in text seen | SNIPPET | **Unverified** |
| OpenSciEd – Middle School | physics, chemistry, biology · Grades 6–8 | CC BY 4.0 | allowed (if confirmed) | SNIPPET | **Unverified** |
| OpenSciEd – Elementary and High School | physics, chemistry, biology · K–5, 9–12 | CC BY-NC 4.0; commercial use via License for Commercial Use v2.0 (fees, AI and reporting provisions) | not allowed without license | SNIPPET | **Permission required** |
| PhET Interactive Simulations | physics, chemistry, biology, mathematics · K–university | HTML5 sims released before 2026-03-29: CC BY 4.0 with fixed attribution text; later releases: not verified (PhET reports a transition to CC BY-NC); common libraries MIT; current sim code in a non-public monorepo | unclear/conflicting: Help Center says all commercial use requires a CU Boulder commercial license | REPO (libraries) + SNIPPET | **Permission required** |
| MIT OpenCourseWare | mathematics, physics, chemistry, biology · University | CC BY-NC-SA 4.0 with per-item exclusions | not allowed | SNIPPET | **Permission required** |
| PubChem | chemistry · All | Per-contributor licenses; NCBI policy says some PubChem material may be copyrighted; no PubChem-wide public-domain statement seen | unclear (depends on source) | SNIPPET | **Unverified** |
| RCSB Protein Data Bank | biology, chemistry · University | Archive data and API data: CC0 1.0; PDB-101 materials CC BY 4.0; Molecule of the Month text copyrighted; software MIT/Apache-2.0 | allowed (CC0 data) | SNIPPET | **Unverified** |
| Royal Society of Chemistry – Periodic Table | chemistry · All | All rights reserved; images © Murray Robertson; paid licence for commercial use | not allowed | SNIPPET | **Permission required** |
| HHMI BioInteractive | biology · HS–university | Educational use; many resources CC BY-NC-SA 4.0; commercial use, redistribution, derivatives and embedding need permission | not allowed | SNIPPET | **Permission required** |
| CEFR Companion Volume | language · Pre-A1–C2 | © Council of Europe, all rights reserved; written permission for reproduction/translation; citing allowed | not allowed | SNIPPET | **Permission required** |
| ACTFL Proficiency Guidelines | language · Novice–Distinguished | Non-profit educational use only, reproduced in entirety without alteration, with credit to ACTFL | not allowed | SNIPPET | **Permission required** |
| VOA Learning English | language · Beginner–intermediate English | Public domain for material produced exclusively by VOA; third-party agency content (AP, AFP, Reuters, Getty) excluded | allowed for VOA-original | SNIPPET | **Unverified** |

## Detailed entries

### Common Core State Standards – Mathematics

- **Official URL:** https://corestandards.org/mathematics-standards/
- **Subject / levels:** mathematics · K–12
- **Relevant topics:** All K–12 mathematics domains and the Standards for Mathematical Practice
- **Intended educational use:** Define K–12 learning objectives and grade-level expectations
- **License / version:** Bespoke NGA/CCSSO Public License (+ separate Commercial License) · 2010 standards
- **Commercial reuse:** unclear
- **Attribution:** © Copyright 2010 National Governors Association Center for Best Practices and Council of Chief State School Officers. All rights reserved. NGA Center/CCSSO acknowledged as sole owners.
- **Modification / redistribution:** Not granted by Public License; Commercial License prohibits recasting that changes meaning
- **Embedding:** not stated · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** Official license page not reachable; a lookalike domain (thecorestandards.org) carries a DMCA notice and is unofficial. Whether 'purposes that support the Initiative' covers a commercial platform is unknown.

### Illustrative Mathematics – IM K–12 Math (first edition, 2019–2021)

- **Official URL:** https://illustrativemathematics.org/terms-of-use/
- **Subject / levels:** mathematics · K–12
- **Relevant topics:** Coherent K–12 curriculum, lesson sequences, tasks
- **Intended educational use:** Instructional sequencing reference; potential content reuse
- **License / version:** CC BY 4.0 (first edition only) · First edition © 2019–2021
- **Commercial reuse:** allowed (if confirmed)
- **Attribution:** Based on IM® K–12 Math authored by Illustrative Mathematics and licensed under CC BY 4.0. Trademarks excluded.
- **Modification / redistribution:** Allowed under CC BY; trademark carve-out
- **Embedding:** not stated · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** Must confirm which edition each im.kendallhunt.com page serves and whether Kendall Hunt adds terms.

### Illustrative Mathematics – IM TK–12 Math v.360 (second edition, 2024–)

- **Official URL:** https://illustrativemathematics.org/terms-of-use/
- **Subject / levels:** mathematics · TK–12
- **Relevant topics:** Updated curriculum
- **Intended educational use:** Reference only
- **License / version:** CC BY-NC 4.0; commercial use requires Restricted Use License from IM · © 2024 (TK © 2025)
- **Commercial reuse:** not allowed without license
- **Attribution:** Based on IM® TK–12 Math v.360 … licensed under CC BY-NC 4.0
- **Modification / redistribution:** Allowed non-commercially
- **Embedding:** not stated · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Geometry/Algebra 2 v.360 license page not seen.

### OpenStax (15 titles checked: Prealgebra 2e, Elementary Algebra 2e, Intermediate Algebra 2e, College Algebra 2e, Precalculus 2e, Calculus 1–3, Introductory Statistics 2e, College Physics 2e, University Physics 1–3, Chemistry 2e, Chemistry: Atoms First 2e, Biology 2e, Anatomy & Physiology 2e, Microbiology, Astronomy 2e)

- **Official URL:** https://openstax.org/
- **Subject / levels:** mathematics, physics, chemistry, biology · University (and HS AP-equivalent)
- **Relevant topics:** Foundational university STEM
- **Intended educational use:** Research content structure and accuracy; content reuse would require permission
- **License / version:** CC BY-NC-SA 4.0 for ALL 15 titles (none is CC BY) · Current editions in official osbooks-* repositories
- **Commercial reuse:** not allowed; OpenStax content-reuse request form
- **Attribution:** Keep pre-formatted attribution on each page; 'Access for free at openstax.org'; names/logos/covers excluded
- **Modification / redistribution:** Allowed non-commercially, ShareAlike
- **Embedding:** not stated · **Automated access:** Prefaces state content may not be used to train LLMs without permission
- **Evidence:** [REPO] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** openstax.org/license wording not read directly; enforceability of LLM clause alongside CC.

### Open Middle

- **Official URL:** https://www.openmiddle.com/
- **Subject / levels:** mathematics · K–12
- **Relevant topics:** Open-ended reasoning problems
- **Intended educational use:** Study problem design; do not copy
- **License / version:** Conflicting: CC BY-NC-SA 4.0 on problem pages vs 'All rights reserved' (Glenrock Consulting) on others · © 2016–2026
- **Commercial reuse:** not allowed
- **Attribution:** CC BY-NC-SA where stated
- **Modification / redistribution:** Unclear
- **Embedding:** not stated · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** Which copyright holder/license is current.

### Mathigon (textbook content, Polypad)

- **Official URL:** https://mathigon.org/policies
- **Subject / levels:** mathematics · Middle school–early university
- **Relevant topics:** Interactive textbooks
- **Intended educational use:** Design and pedagogy reference only
- **License / version:** All rights reserved (© Mathigon/Amplify); non-commercial use only; commercial agreement required · textbooks repo © 2016–2022
- **Commercial reuse:** not allowed
- **Attribution:** n/a
- **Modification / redistribution:** Not allowed
- **Embedding:** Polypad embedding allowed on non-commercial personal sites · **Automated access:** Amplify AUP prohibits ML training on content
- **Evidence:** [REPO] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Full policies page not read.

### Mathigon Studio (software)

- **Official URL:** https://github.com/mathigon/studio
- **Subject / levels:** mathematics · n/a
- **Relevant topics:** Course rendering framework
- **Intended educational use:** Possible code reuse
- **License / version:** MIT (code); CC BY-SA 4.0 (media/UI assets); SIL OFL (fonts); trademarks excluded · LICENSE.md © 2018–2022
- **Commercial reuse:** allowed (code)
- **Attribution:** MIT notice retention; CC BY-SA for media
- **Modification / redistribution:** Allowed
- **Embedding:** n/a · **Automated access:** n/a
- **Evidence:** [REPO] · **Date verified:** 2026-10-25
- **Classification:** **Verified for intended use**
- **Remaining legal uncertainty:** mathigon/core license file not found at master.

### MAA – CUPM Curriculum Guide (2015)

- **Official URL:** https://maa.org/resource/cupm-curriculum-guide/
- **Subject / levels:** mathematics · University
- **Relevant topics:** Undergraduate program recommendations
- **Intended educational use:** Curriculum structure reference
- **License / version:** Not stated; presumed © MAA all rights reserved · 2015
- **Commercial reuse:** unclear
- **Attribution:** not stated
- **Modification / redistribution:** not stated
- **Embedding:** not stated · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** Treat as Reference-only.

### Linear Algebra (Jim Hefferon)

- **Official URL:** https://hefferon.net/linearalgebra/
- **Subject / levels:** mathematics · University
- **Relevant topics:** Linear algebra
- **Intended educational use:** Content reuse candidate
- **License / version:** GNU FDL or CC BY-SA 3.0 US, at user's choice · current
- **Commercial reuse:** allowed (copyleft)
- **Attribution:** CC BY-SA / GFDL notices
- **Modification / redistribution:** Allowed, ShareAlike
- **Embedding:** not stated · **Automated access:** n/a
- **Evidence:** [REPO] · **Date verified:** 2026-10-25
- **Classification:** **Verified for intended use**
- **Remaining legal uncertainty:** CC version (3.0 US) seen only via snippet; copyleft compatibility with OpenPath licensing must be decided.

### Discrete Mathematics: An Open Introduction (Oscar Levin)

- **Official URL:** https://discrete.openmathbooks.org/
- **Subject / levels:** mathematics · University
- **Relevant topics:** Discrete mathematics
- **Intended educational use:** Reference; 3rd ed. reuse possible
- **License / version:** 4th ed.: CC BY-NC-SA 4.0; 3rd ed. and earlier: CC BY-SA 4.0 · 4th edition 2024
- **Commercial reuse:** 4th ed. not allowed; 3rd ed. allowed (copyleft)
- **Attribution:** CC notices
- **Modification / redistribution:** Allowed per license
- **Embedding:** not stated · **Automated access:** n/a
- **Evidence:** [REPO] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** None on license identity.

### Book of Proof (Richard Hammack)

- **Official URL:** https://www.people.vcu.edu/~rhammack/BookOfProof/
- **Subject / levels:** mathematics · University
- **Relevant topics:** Logic and proof
- **Intended educational use:** Reference only
- **License / version:** CC BY-ND (per Open Textbook Library listing) · 3rd edition
- **Commercial reuse:** allowed but no derivatives
- **Attribution:** CC BY-ND
- **Modification / redistribution:** Not allowed (ND)
- **Embedding:** not stated · **Automated access:** n/a
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Reference-only**
- **Remaining legal uncertainty:** Author's own site not read.

### Active Calculus (Matthew Boelkins)

- **Official URL:** https://activecalculus.org/
- **Subject / levels:** mathematics · University
- **Relevant topics:** Calculus
- **Intended educational use:** Pedagogy reference
- **License / version:** CC BY-NC-SA (per OTL listing) · 2.0 / Multivariable
- **Commercial reuse:** not allowed
- **Attribution:** CC notices
- **Modification / redistribution:** Allowed non-commercially
- **Embedding:** not stated · **Automated access:** n/a
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** License not read from activecalculus.org; GitHub repos carry no license label.

### APEX Calculus

- **Official URL:** https://www.apexcalculus.com/
- **Subject / levels:** mathematics · University
- **Relevant topics:** Calculus
- **Intended educational use:** Reference
- **License / version:** CC BY-NC 4.0 (V5 repository README) · V5; PTX edition license unread
- **Commercial reuse:** not allowed
- **Attribution:** CC BY-NC
- **Modification / redistribution:** Allowed non-commercially
- **Embedding:** not stated · **Automated access:** n/a
- **Evidence:** [REPO] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Current PreTeXt edition license.

### A First Course in Linear Algebra (Robert Beezer)

- **Official URL:** http://linear.ups.edu/
- **Subject / levels:** mathematics · University
- **Relevant topics:** Linear algebra
- **Intended educational use:** Content reuse candidate
- **License / version:** GNU FDL 1.2 or later, no invariant sections · COPYING.txt in rbeezer/fcla
- **Commercial reuse:** allowed (copyleft; derivatives stay GFDL)
- **Attribution:** GFDL requirements incl. license text
- **Modification / redistribution:** Allowed under GFDL
- **Embedding:** not stated · **Automated access:** n/a
- **Evidence:** [REPO] · **Date verified:** 2026-10-25
- **Classification:** **Verified for intended use**
- **Remaining legal uncertainty:** GFDL copyleft burden on derived interactive content.

### Next Generation Science Standards

- **Official URL:** https://www.nextgenscience.org/
- **Subject / levels:** physics, chemistry, biology · K–12
- **Relevant topics:** Performance expectations, DCIs, practices, crosscutting concepts
- **Intended educational use:** Define K–12 science objectives; cite codes (e.g. HS-PS2-4, HS-ESS1-4)
- **License / version:** Blanket permission to copy/adapt for states, districts, schools, teachers and non-profit education entities; standards copyright held by National Academies Press; trademarks WestEd · 2013
- **Commercial reuse:** not granted in text seen
- **Attribution:** Asterisk + disclaimer at first prominent use of NGSS marks; acknowledgement only in legal pages is insufficient
- **Modification / redistribution:** Permitted for named non-profit entities
- **Embedding:** not stated · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** For-profit use; NAP copyright scope. Citing standard codes with a short paraphrase is the conservative approach used in this repository.

### OpenSciEd – Middle School

- **Official URL:** https://openscied.org/
- **Subject / levels:** physics, chemistry, biology · Grades 6–8
- **Relevant topics:** Phenomena-based units
- **Intended educational use:** Instructional design reference; possible reuse
- **License / version:** CC BY 4.0 · current
- **Commercial reuse:** allowed (if confirmed)
- **Attribution:** Credit, link license, indicate changes; name/logo trademarked
- **Modification / redistribution:** Allowed
- **Embedding:** not stated · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** Terms page also mentions 'NonCommercial Plus' wording; third-party content inside units.

### OpenSciEd – Elementary and High School

- **Official URL:** https://openscied.org/commercial-license/
- **Subject / levels:** physics, chemistry, biology · K–5, 9–12
- **Relevant topics:** Phenomena-based units
- **Intended educational use:** Reference only
- **License / version:** CC BY-NC 4.0; commercial use via License for Commercial Use v2.0 (fees, AI and reporting provisions) · v2.0 effective 2026-06-03
- **Commercial reuse:** not allowed without license
- **Attribution:** As CC BY-NC
- **Modification / redistribution:** Non-commercial only
- **Embedding:** not stated · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Commercial license terms.

### PhET Interactive Simulations

- **Official URL:** https://phet.colorado.edu/en/licensing
- **Subject / levels:** physics, chemistry, biology, mathematics · K–university
- **Relevant topics:** Interactive simulations
- **Intended educational use:** Design and research reference ONLY; no embedding or copying
- **License / version:** HTML5 sims released before 2026-03-29: CC BY 4.0 with fixed attribution text; later releases: not verified (PhET reports a transition to CC BY-NC); common libraries MIT; current sim code in a non-public monorepo · Licensing page states cut-off 2026-03-29
- **Commercial reuse:** unclear/conflicting: Help Center says all commercial use requires a CU Boulder commercial license
- **Attribution:** Specific required attribution line (not captured verbatim)
- **Modification / redistribution:** Attribution text may be translated but not otherwise modified
- **Embedding:** Documented use case but terms unread · **Automated access:** not stated
- **Evidence:** [REPO (libraries) + SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Post-March-2026 license; CU commercial-license requirement vs CC BY.

### MIT OpenCourseWare

- **Official URL:** https://ocw.mit.edu/
- **Subject / levels:** mathematics, physics, chemistry, biology · University
- **Relevant topics:** Course structures, syllabi, problem sets
- **Intended educational use:** Course structure and rigor reference
- **License / version:** CC BY-NC-SA 4.0 with per-item exclusions · current
- **Commercial reuse:** not allowed
- **Attribution:** Credit, link, note changes; no MIT names/logos beyond attribution
- **Modification / redistribution:** Non-commercial, ShareAlike
- **Embedding:** not stated · **Automated access:** Non-commercial AI training allowed per snippet
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Exact current wording.

### PubChem (NCBI/NIH)

- **Official URL:** https://pubchem.ncbi.nlm.nih.gov/
- **Subject / levels:** chemistry · All
- **Relevant topics:** Chemical structures, properties, identifiers
- **Intended educational use:** Chemical data via PUG REST
- **License / version:** Per-contributor licenses; NCBI policy says some PubChem material may be copyrighted; no PubChem-wide public-domain statement seen · current
- **Commercial reuse:** unclear (depends on source)
- **Attribution:** not stated
- **Modification / redistribution:** depends on source
- **Embedding:** n/a · **Automated access:** PUG REST throttled: ≤5 requests/s, ≤400/min, ≤300 s running time/min (from PubChem team's paper, not the live policy page)
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** Official data-license statement and current rate limits.

### RCSB Protein Data Bank

- **Official URL:** https://www.rcsb.org/
- **Subject / levels:** biology, chemistry · University
- **Relevant topics:** Macromolecular structures
- **Intended educational use:** Structure data for visualization
- **License / version:** Archive data and API data: CC0 1.0; PDB-101 materials CC BY 4.0; Molecule of the Month text copyrighted; software MIT/Apache-2.0 · current
- **Commercial reuse:** allowed (CC0 data)
- **Attribution:** Encouraged: cite structure authors and RCSB PDB (Berman et al. 2000)
- **Modification / redistribution:** Unrestricted for CC0
- **Embedding:** n/a · **Automated access:** APIs rate limited (HTTP 429; use backoff); files.rcsb.org downloads not limited
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** Pages conflict on limits; RCSB-generated images copyright.

### Royal Society of Chemistry – Periodic Table (Visual Elements)

- **Official URL:** https://periodic-table.rsc.org/
- **Subject / levels:** chemistry · All
- **Relevant topics:** Element properties and trends
- **Intended educational use:** Reference for validating element data only
- **License / version:** All rights reserved; images © Murray Robertson; paid licence for commercial use · terms notice 1999–2011/2017
- **Commercial reuse:** not allowed
- **Attribution:** Copyright notices retained
- **Modification / redistribution:** Not allowed
- **Embedding:** Not permitted · **Automated access:** No API
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Whether element data text has separate terms.

### HHMI BioInteractive

- **Official URL:** https://www.biointeractive.org/
- **Subject / levels:** biology · HS–university
- **Relevant topics:** Visualizations, investigations
- **Intended educational use:** Design reference
- **License / version:** Educational use; many resources CC BY-NC-SA 4.0; commercial use, redistribution, derivatives and embedding need permission · current
- **Commercial reuse:** not allowed
- **Attribution:** Required; no HHMI names/logos
- **Modification / redistribution:** Needs permission unless resource license allows
- **Embedding:** Needs permission · **Automated access:** not stated
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Per-resource terms vary.

### CEFR Companion Volume (Council of Europe)

- **Official URL:** https://www.coe.int/en/web/common-european-framework-reference-languages
- **Subject / levels:** language · Pre-A1–C2
- **Relevant topics:** Proficiency descriptors
- **Intended educational use:** Design proficiency progression; cite level names; do not reproduce descriptor scales
- **License / version:** © Council of Europe, all rights reserved; written permission for reproduction/translation; citing allowed · Companion Volume 2020
- **Commercial reuse:** not allowed
- **Attribution:** © Council of Europe, year
- **Modification / redistribution:** Not allowed
- **Embedding:** n/a · **Automated access:** n/a
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Whether descriptor scales can be licensed for a commercial platform.

### ACTFL Proficiency Guidelines

- **Official URL:** https://www.actfl.org/educator-resources/actfl-proficiency-guidelines
- **Subject / levels:** language · Novice–Distinguished
- **Relevant topics:** Proficiency descriptions
- **Intended educational use:** Assessment design reference
- **License / version:** Non-profit educational use only, reproduced in entirety without alteration, with credit to ACTFL · 2012 / 2024 revision
- **Commercial reuse:** not allowed
- **Attribution:** Credit to ACTFL
- **Modification / redistribution:** Prohibited
- **Embedding:** n/a · **Automated access:** n/a
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Permission required**
- **Remaining legal uncertainty:** Permission process.

### VOA Learning English

- **Official URL:** https://learningenglish.voanews.com/
- **Subject / levels:** language · Beginner–intermediate English
- **Relevant topics:** Graded news, audio, video
- **Intended educational use:** Reading/listening content (VOA-original only)
- **License / version:** Public domain for material produced exclusively by VOA; third-party agency content (AP, AFP, Reuters, Getty) excluded · current
- **Commercial reuse:** allowed for VOA-original
- **Attribution:** Credit learningenglish.voanews.com / Voice of America (requested)
- **Modification / redistribution:** Unrestricted for public-domain items
- **Embedding:** not stated · **Automated access:** RSS exists; terms unread
- **Evidence:** [SNIPPET] · **Date verified:** 2026-10-25
- **Classification:** **Unverified**
- **Remaining legal uncertainty:** Per-item third-party screening; logo rules.

## Next verification steps

1. From a network that can reach the hosts, read each official license/terms page and record the URL and date; upgrade classifications only on that basis.
2. For resources classified *Permission required* that we actually want (IM v.360, OpenStax, OpenSciEd ES/HS, PhET), file permission requests and record the outcome here.
3. Pick and record a reusable element-property dataset for Chemistry World before any chemistry content is authored.
4. Re-verify the planetary data sources named in `src/worlds/gravity/model/bodies.ts` (NASA fact sheet, JPL elements), which the build environment could not fetch.
5. No source is to be described as an OpenPath partner or endorser.
