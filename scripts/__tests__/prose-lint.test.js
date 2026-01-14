const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { loadProseLintConfig } = require('../prose-lint');

const defaults = {
  thresholds: { high: 1, medium: 3, low: 6 },
  metrics: { contrastParagraphCap: 12, emdashLinesPer: 20, shortSentenceMax: 6 },
  rules: [],
  contrastPatterns: [],
  punctuationRules: [],
  discourseMarkers: [],
  weakVerbs: []
};

function writeJsonConfig(dir, value) {
  const filePath = path.join(dir, 'prose-lint.json');
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
  return filePath;
}

test('loadProseLintConfig uses defaults when config is missing', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prose-lint-'));
  const filePath = path.join(dir, 'prose-lint.json');
  const config = loadProseLintConfig(filePath, defaults);
  assert.equal(config.thresholds.high, 1);
  assert.equal(config.thresholds.medium, 3);
  assert.equal(config.thresholds.low, 6);
  assert.equal(config.metrics.shortSentenceMax, 6);
  assert.equal(config.rules.length, 0);
});

test('loadProseLintConfig merges thresholds overrides', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prose-lint-'));
  const filePath = writeJsonConfig(dir, {
    thresholds: { high: 2, medium: 4, low: 8 }
  });
  const config = loadProseLintConfig(filePath, defaults);
  assert.equal(config.thresholds.high, 2);
  assert.equal(config.thresholds.medium, 4);
  assert.equal(config.thresholds.low, 8);
});

test('loadProseLintConfig filters disabled rules', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prose-lint-'));
  const filePath = writeJsonConfig(dir, {
    rules: [
      { name: 'drop-me', enabled: false, patterns: [{ pattern: 'foo', flags: 'i' }] }
    ]
  });
  const config = loadProseLintConfig(filePath, defaults);
  assert.equal(config.rules.length, 0);
});

test('loadProseLintConfig compiles rule patterns', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prose-lint-'));
  const filePath = writeJsonConfig(dir, {
    rules: [
      { name: 'keep-me', patterns: [{ pattern: 'foo', flags: 'i' }] }
    ]
  });
  const config = loadProseLintConfig(filePath, defaults);
  assert.equal(config.rules.length, 1);
  assert.ok(config.rules[0].patterns[0] instanceof RegExp);
  assert.equal(config.rules[0].patterns[0].source, 'foo');
  assert.equal(config.rules[0].patterns[0].flags, 'i');
});

test('loadProseLintConfig throws on invalid JSON', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prose-lint-'));
  const filePath = path.join(dir, 'prose-lint.json');
  fs.writeFileSync(filePath, '{');
  assert.throws(() => loadProseLintConfig(filePath, defaults), /Invalid JSON/);
});
