import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { imageGravityPosition } = require('../_config/image-gravity.cjs');

test('image gravity supports vertical and two-axis percentages with safe defaults', () => {
  for (const [input, expected] of [
    ['top', 'center top'],
    ['bottom', 'center bottom'],
    ['center', 'center center'],
    ['middle', 'center center'],
    ['0%', 'center 0%'],
    ['100%', 'center 100%'],
    ['65.5%', 'center 65.5%'],
    [' 40%   65% ', '40% 65%'],
    [undefined, 'center center'],
    [65, 'center center'],
    ['101%', 'center center'],
    ['-5%', 'center center'],
    ['50% 50% 50%', 'center center'],
    ['50%; color: red', 'center center'],
  ]) {
    assert.equal(imageGravityPosition(input), expected);
  }
});

const { getDeploymentPathPrefix } = require('../_config/deployment-path-prefix.cjs');
const sitePathPrefix = getDeploymentPathPrefix().replace(/\/$/, '');

async function readBuiltPage(pathname) {
  return readFile(new URL(`../_site/${pathname}`, import.meta.url), 'utf8');
}

function currentNavLinkPattern(href, label) {
  const expectedHref = `${sitePathPrefix}${href}`;

  return new RegExp(`<a[^>]*href="${expectedHref}"[^>]*aria-current="page"[^>]*>${label}</a>`, 'i');
}

// test('build outputs a homepage with core forum messaging', async () => {
//   const html = await readBuiltPage('index.html');

//   assert.match(html, /<title>\s*Welcome\s*-\s*DLF Forum 2026\s*<\/title>/i);
//   assert.match(html, /Virtual DLF Forum/i);
//   assert.match(
//     html,
//     /A digital gathering place for GLAM professionals to share, sustain, and innovate\./i
//   );
//   assert.match(html, /The DLF Forum/i);
// });

test('built pages include a skip link and focusable main landmark', async () => {
  const [homeHtml, cfpHtml] = await Promise.all([
    readBuiltPage('index.html'),
    readBuiltPage('call-for-proposals/index.html'),
  ]);

  for (const html of [homeHtml, cfpHtml]) {
    assert.match(html, /<a class="skip-link" href="#main-content">Skip to main content<\/a>/i);
    assert.match(html, /<main id="main-content" tabindex="-1">/i);
  }
});

test('primary navigation exposes current page state to assistive tech', async () => {
  const [homeHtml, cfpHtml] = await Promise.all([
    readBuiltPage('index.html'),
    readBuiltPage('call-for-proposals/index.html'),
  ]);

  assert.doesNotMatch(homeHtml, />Home<\/a>/i);
  assert.match(homeHtml, />Program(?:<|\s)/i);
  assert.match(homeHtml, />Resources(?:<|\s)/i);
  assert.match(homeHtml, />Support(?:<|\s)/i);
  assert.doesNotMatch(homeHtml, /border-primary\/40[^>]*href="[^"]*resources\//i);
  assert.doesNotMatch(homeHtml, /border-primary\/40[^>]*href="[^"]*sponsorship\//i);
  assert.match(cfpHtml, currentNavLinkPattern('/call-for-proposals/', 'Call for Proposals'));
});

test('proposal CTA is never rendered as a dead button in built pages', async () => {
  const [homeHtml, cfpHtml] = await Promise.all([
    readBuiltPage('index.html'),
    readBuiltPage('call-for-proposals/index.html'),
  ]);

  for (const html of [homeHtml, cfpHtml]) {
    assert.doesNotMatch(html, /<button[^>]*>\s*Submit(?: Your)? Proposal/i);
    assert.match(html, /Proposal Portal Coming Soon|href="https?:\/\/[^"]+"/i);
  }
});

test('sponsors page is published at the expected route', async () => {
  const html = await readBuiltPage('sponsorship/sponsors/index.html');

  assert.match(html, /<title>\s*Sponsors\s*-\s*Virtual DLF Forum 2026\s*<\/title>/i);
  assert.match(html, /Thank you to our sponsors\./i);
});

test('decorative material symbol icons are hidden from assistive tech', async () => {
  const [homeHtml, cfpHtml] = await Promise.all([
    readBuiltPage('index.html'),
    readBuiltPage('call-for-proposals/index.html'),
  ]);

  const iconPattern = /<span class="material-symbols-outlined[^"]*"[^>]*>[^<]+<\/span>/gi;

  for (const html of [homeHtml, cfpHtml]) {
    const icons = html.match(iconPattern) ?? [];

    assert.ok(icons.length > 0, 'expected at least one material symbol icon in built HTML');

    for (const icon of icons) {
      assert.match(icon, /aria-hidden="true"/i);
    }
  }
});
