// Builds the production copy of the site from src/ into dist/spanish-fort-lodge (the folder the GitHub workflow deploys).
//   HTML: minified (whitespace, comments, inline CSS/JS); CSS/JS links get a ?v=<hash> stamp so browsers pick up changes
//   CSS:  css/styles.css minified with clean-css (the Bootstrap files in css/vendor are already minified and copied as-is)
//   JS:   minified with terser, then obfuscated with javascript-obfuscator
//   Images, fonts and the favicon are copied as-is.
// It also writes small redirect pages for the old Angular addresses (/about, /events, /newsfeed) so old links still work.
// Usage: npm run build   (works on Node 16+, the version the deploy workflow uses)

import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { minify as minifyHtml } from 'html-minifier-terser';
import CleanCSS from 'clean-css';
import { minify as minifyJs } from 'terser';
import JavaScriptObfuscator from 'javascript-obfuscator';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist', 'spanish-fort-lodge');

const HTML_FILES = ['index.html', 'about.html', 'events.html', 'news.html'];
const CSS_FILES = ['css/styles.css'];
const JS_FILES = ['js/main.js'];
const COPY = ['assets', 'css/vendor', 'favicon.ico'];
// Old Angular routes -> new pages
const REDIRECTS = { about: 'about.html', events: 'events.html', newsfeed: 'news.html' };

const report = [];
const kb = (n) => `${(n / 1024).toFixed(1)} KB`.padStart(10);
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

async function write(rel, content, originalSize) {
  const out = path.join(DIST, rel);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, content);
  if (originalSize !== undefined) report.push([rel, originalSize, Buffer.byteLength(content)]);
}

async function build() {
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });
  const versions = {};

  for (const rel of CSS_FILES) {
    const src = await fs.readFile(path.join(SRC, rel), 'utf8');
    const result = new CleanCSS({ level: 2, rebase: false }).minify(src);
    if (result.errors.length) throw new Error(`${rel}: ${result.errors.join('; ')}`);
    await write(rel, result.styles, Buffer.byteLength(src));
    versions[rel] = hash(result.styles);
  }

  for (const rel of JS_FILES) {
    const src = await fs.readFile(path.join(SRC, rel), 'utf8');
    const min = await minifyJs(src, { compress: true, mangle: true, format: { comments: false } });
    const obf = JavaScriptObfuscator.obfuscate(min.code, {
      compact: true,
      controlFlowFlattening: false, // keeps the site fast on older phones
      identifierNamesGenerator: 'hexadecimal',
      renameGlobals: false,
      selfDefending: false,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      stringArrayThreshold: 0.75,
    }).getObfuscatedCode();
    await write(rel, obf, Buffer.byteLength(src));
    versions[rel] = hash(obf);
  }

  for (const rel of COPY) {
    await fs.cp(path.join(SRC, rel), path.join(DIST, rel), { recursive: true });
  }
  for (const rel of ['css/vendor/bootstrap.min.css', 'css/vendor/bootstrap-icons/bootstrap-icons.min.css']) {
    versions[rel] = hash(await fs.readFile(path.join(SRC, rel)));
  }

  for (const rel of HTML_FILES) {
    let src = await fs.readFile(path.join(SRC, rel), 'utf8');
    for (const [file, v] of Object.entries(versions)) src = src.split(`"${file}"`).join(`"${file}?v=${v}"`);
    const out = await minifyHtml(src, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
    });
    await write(rel, out, Buffer.byteLength(src));
  }

  for (const [route, page] of Object.entries(REDIRECTS)) {
    await write(`${route}/index.html`,
      `<!doctype html><meta charset="utf-8"><title>Moved</title><link rel="canonical" href="../${page}">` +
      `<meta http-equiv="refresh" content="0; url=../${page}"><script>location.replace('../${page}'+location.hash)</script>` +
      `<a href="../${page}">This page has moved.</a>`);
  }

  let before = 0, after = 0;
  console.log('\nBuilt dist/spanish-fort-lodge:');
  for (const [rel, a, b] of report) {
    before += a; after += b;
    console.log(`  ${rel.padEnd(18)}${kb(a)} ->${kb(b)}`);
  }
  console.log(`  ${'total'.padEnd(18)}${kb(before)} ->${kb(after)}`);
  console.log(`  copied: ${COPY.join(', ')}; redirects: /${Object.keys(REDIRECTS).join(', /')}\n`);
}

build().catch((err) => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
