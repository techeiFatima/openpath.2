# Browser smoke test

Drives the production build through the full learner flow in headless Chromium and
writes screenshots to `tests/e2e/output/` (git-ignored).

```sh
npm run build
npm run preview -- --port 4173 &    # or any static server for dist/
npm run test:e2e                     # needs `playwright` resolvable (npm i -D playwright && npx playwright install chromium)
```

Checks: home renders and lists 3 lessons; the Discover stage shows a running circular
orbit with 12 measurements; a prediction reveals its preset; Newton's cannon crashes;
a wrong answer is attributed to its misconception and the right answer is accepted; the
hint ladder responds; the Demonstrate stage hides the canvas; the Review stage shows
mastery badges; the solar system lists 8 planets with labels; the phone layout has no
horizontal scroll; the home page offers to resume. Fails on any page error.
