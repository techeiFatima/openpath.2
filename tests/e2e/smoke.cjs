const { chromium } = require('playwright');
const { mkdirSync } = require('node:fs');
(async () => {

const base = process.env.BASE_URL ?? 'http://localhost:4173';
const path = require('node:path');
const out = process.env.OUT_DIR ?? path.join(__dirname, 'output');
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

const report = {};
await page.goto(`${base}/#/`, { waitUntil: 'networkidle' });
report.homeTitle = await page.textContent('h1');
report.lessonLinks = await page.locator('.lesson-list a').count();
await page.screenshot({ path: `${out}/01-home.png` });

await page.goto(`${base}/#/world/gravity/lesson/gravity.falling-around-earth?stage=0`, { waitUntil: 'networkidle' });
await page.waitForSelector('canvas', { timeout: 20000 });
await page.waitForTimeout(2500);
report.stageTitle = await page.textContent('#stage-title');
report.measurementRows = await page.locator('.measure').count();
report.orbitKind = await page.textContent('.orbit-kind');
report.speedReading = await page.locator('.measure:has-text("Speed of Probe") dd').textContent();
await page.screenshot({ path: `${out}/02-discover.png` });

// Prediction interaction
await page.locator('.prediction').first().locator('label').nth(2).click();
await page.waitForTimeout(300);
report.predictionFeedback = (await page.locator('.prediction .feedback').first().textContent())?.slice(0, 60);

// Explore stage with cannon preset
await page.goto(`${base}/#/world/gravity/lesson/gravity.falling-around-earth?stage=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
report.exploreKind = await page.textContent('.orbit-kind');
await page.screenshot({ path: `${out}/03-explore.png` });

// Practice: answer the ISS speed problem correctly
await page.goto(`${base}/#/world/gravity/lesson/gravity.falling-around-earth?stage=3`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const card = page.locator('section.problem[aria-labelledby="l1-iss-speed-prompt"]');
await card.locator('input.answer-input').fill('5.89e7');
await card.locator('button:has-text("Check")').click();
report.misconceptionFeedback = await card.locator('.feedback').textContent();
await card.locator('input.answer-input').fill('7.67 km/s');
await card.locator('button:has-text("Check")').click();
report.correctFeedback = await card.locator('.feedback').textContent();
report.solvedBadge = await card.locator('.problem-solved').count();
// Hint ladder on another problem
const card2 = page.locator('section.problem[aria-labelledby="l1-g-at-iss-prompt"]');
await card2.locator('button:has-text("Hint")').click();
report.hint1 = await card2.locator('.instructor').textContent();
await page.screenshot({ path: `${out}/04-practice.png`, fullPage: false });

// Demonstrate hides the sim
await page.goto(`${base}/#/world/gravity/lesson/gravity.falling-around-earth?stage=5`, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
report.demonstrateCanvas = await page.locator('canvas').count();
report.demonstratePlaceholder = await page.locator('.sim-placeholder').count();
await page.screenshot({ path: `${out}/05-demonstrate.png` });

// Review shows mastery
await page.goto(`${base}/#/world/gravity/lesson/gravity.falling-around-earth?stage=6`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
report.masteryBadges = await page.locator('.review-mastery .mastery').count();
report.masteryLevels = await page.locator('.review-mastery .mastery-level').allTextContents();

// Solar system lesson
await page.goto(`${base}/#/world/gravity/lesson/gravity.keplers-third-law?stage=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
report.planetRows = await page.locator('.planet-table tbody tr').count();
report.solarLabels = await page.locator('.scene-label').count();
await page.screenshot({ path: `${out}/06-solar.png` });

// Mobile layout
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/#/world/gravity/lesson/gravity.escape?stage=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
report.mobileHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
await page.screenshot({ path: `${out}/07-mobile.png` });

// Mathematics world: graph renders, dragging/sliders drive readouts, expression grading
await page.setViewportSize({ width: 1400, height: 900 });
await page.goto(`${base}/#/world/functions-calculus/lesson/math.derivatives?stage=1`, { waitUntil: 'networkidle' });
await page.waitForSelector('svg.graph', { timeout: 20000 });
await page.waitForTimeout(500);
report.mathReadouts = await page.locator('.measure').count();
report.mathSecant = await page.locator('.measure:has-text("Average rate of change") dd').textContent();
await page.locator('button.chip:has-text("h = 0.01")').click();
await page.waitForTimeout(200);
report.mathSecantSmallH = await page.locator('.measure:has-text("Average rate of change") dd').textContent();
await page.screenshot({ path: `${out}/08-math-secant.png` });
await page.goto(`${base}/#/world/functions-calculus/lesson/math.derivatives?stage=3`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const mcard = page.locator('section.problem[aria-labelledby="l3-rule-prompt"]');
await mcard.locator('input.answer-input').fill('6x - 2');
await mcard.locator('button:has-text("Check")').click();
report.mathExpressionFeedback = await mcard.locator('.feedback').textContent();
await page.goto(`${base}/#/world/functions-calculus/lesson/math.integrals?stage=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
report.mathRiemannRects = await page.locator('svg.graph rect[stroke="#8fd3ff"]').count();
await page.screenshot({ path: `${out}/09-math-riemann.png` });

// Biology world: scale explorer and DNA workbench
await page.goto(`${base}/#/world/cell/lesson/cell.powers-of-ten?stage=1`, { waitUntil: 'networkidle' });
await page.waitForSelector('.bio-canvas svg', { timeout: 20000 });
await page.waitForTimeout(500);
report.bioScaleReadouts = await page.locator('.measure').count();
await page.screenshot({ path: `${out}/10-bio-scale.png` });
await page.goto(`${base}/#/world/cell/lesson/cell.gene-to-protein?stage=1`, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
report.bioDnaReadouts = await page.locator('.measure').count();
report.bioDnaText = (await page.locator('.measurements').first().textContent())?.slice(0, 120);
await page.screenshot({ path: `${out}/11-bio-dna.png` });

// Resume: home shows continue link
await page.setViewportSize({ width: 1400, height: 900 });
await page.goto(`${base}/#/`, { waitUntil: 'networkidle' });
report.continueLink = await page.locator('a.button.primary').textContent();

console.log(JSON.stringify(report, null, 2));
console.log('ERRORS:', errors.length ? errors : 'none');
await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
