#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'content', 'blog');
const TEMPLATE_DIR = path.join(ROOT, 'templates');
const OUTPUT_DIR = path.join(ROOT, 'build');
const QUERIES_PATH = path.join(ROOT, 'config', 'queries.json');

const ARTICLE_TEMPLATE = path.join(TEMPLATE_DIR, 'article.html');
const HOME_TEMPLATE = path.join(TEMPLATE_DIR, 'home.html');

const STATUS_VALUES = new Set(['draft', 'review', 'published', 'archived']);
const INTERNAL_QUERY_NAMES = new Set(['article-page']);
const ALLOWED_QUERY_KEYS = new Set([
  'source',
  'status',
  'tag',
  'stream',
  'year',
  'month',
  'day',
  'ordinal',
  'sort',
  'limit'
]);
const ALLOWED_SORTS = new Set(['date-asc', 'date-desc', 'ordinal-asc', 'ordinal-desc']);

function main() {
  const articles = discoverArticles(CONTENT_ROOT);
  const index = buildIndex(articles);
  const queries = loadQueries(QUERIES_PATH);
  const queryResults = executeQueries(index, queries);
  renderSite(index, queryResults);
  copyAssets(index);
}

function discoverArticles(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  const errors = [];
  const records = [];

  const yearDirs = listDirs(rootDir);
  for (const year of yearDirs) {
    if (!/^\d{4}$/.test(year)) {
      errors.push(`Invalid year directory: ${year}`);
      continue;
    }
    const yearPath = path.join(rootDir, year);
    const monthDirs = listDirs(yearPath);
    for (const month of monthDirs) {
      if (!/^\d{2}$/.test(month)) {
        errors.push(`Invalid month directory: ${path.join(year, month)}`);
        continue;
      }
      const monthPath = path.join(yearPath, month);
      const dayDirs = listDirs(monthPath);
      for (const day of dayDirs) {
        if (!/^\d{2}$/.test(day)) {
          errors.push(`Invalid day directory: ${path.join(year, month, day)}`);
          continue;
        }
        const dayPath = path.join(monthPath, day);
        const leafDirs = listDirs(dayPath);
        for (const leaf of leafDirs) {
          const match = leaf.match(/^(\d{2})-([a-z0-9-]+)$/);
          if (!match) {
            errors.push(`Invalid article directory: ${path.join(year, month, day, leaf)}`);
            continue;
          }
          const ordinal = match[1];
          const slug = match[2];
          const leafPath = path.join(dayPath, leaf);

          if (!leaf.startsWith(`${ordinal}-`)) {
            errors.push(`Ordinal mismatch in directory: ${path.join(year, month, day, leaf)}`);
            continue;
          }

          const mdFiles = fs.readdirSync(leafPath)
            .filter((file) => file.toLowerCase().endsWith('.md'));
          if (mdFiles.length !== 1 || mdFiles[0] !== 'article.md') {
            errors.push(`Missing or ambiguous article markdown file in ${path.join(year, month, day, leaf)}`);
            continue;
          }

          const relDir = toPosix(path.relative(ROOT, leafPath));
          records.push({
            year,
            month,
            day,
            ordinal,
            slug,
            relDir,
            dir: leafPath,
            mdPath: path.join(leafPath, 'article.md')
          });
        }
      }
    }
  }

  if (errors.length) {
    throw new Error(errors.join('\n'));
  }

  return records;
}

function buildIndex(records) {
  const errors = [];
  const index = [];

  for (const record of records) {
    const raw = fs.readFileSync(record.mdPath, 'utf8');
    const parsed = parseFrontmatter(raw);

    if (!parsed) {
      errors.push(`Missing frontmatter in ${record.relDir}/article.md`);
      continue;
    }

    const { frontmatter } = parsed;

    if (!frontmatter.status || !STATUS_VALUES.has(frontmatter.status)) {
      errors.push(`Invalid or missing status in ${record.relDir}/article.md`);
    }

    for (const derivedField of ['year', 'month', 'day', 'ordinal', 'slug']) {
      if (Object.prototype.hasOwnProperty.call(frontmatter, derivedField)) {
        errors.push(`Frontmatter defines derived field '${derivedField}' in ${record.relDir}/article.md`);
      }
    }

    if (frontmatter.tags) {
      if (!Array.isArray(frontmatter.tags)) {
        errors.push(`Tags must be a list in ${record.relDir}/article.md`);
      } else {
        frontmatter.tags = frontmatter.tags
          .map((tag) => normalizeTag(tag))
          .filter(Boolean);
      }
    }

    for (const key of ['title', 'summary', 'thumbnail', 'stream']) {
      if (frontmatter[key] && typeof frontmatter[key] !== 'string') {
        errors.push(`Frontmatter '${key}' must be a string in ${record.relDir}/article.md`);
      }
    }

    index.push({
      ...record,
      yearNum: Number(record.year),
      monthNum: Number(record.month),
      dayNum: Number(record.day),
      ordinalNum: Number(record.ordinal),
      publicPath: `/${record.relDir}/`,
      frontmatter
    });
  }

  if (errors.length) {
    throw new Error(errors.join('\n'));
  }

  return index;
}

function loadQueries(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing queries file: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}`);
  }

  const errors = [];
  for (const [name, query] of Object.entries(parsed)) {
    if (!query || typeof query !== 'object') {
      errors.push(`Query '${name}' must be an object`);
      continue;
    }

    for (const key of Object.keys(query)) {
      if (!ALLOWED_QUERY_KEYS.has(key)) {
        errors.push(`Unknown key '${key}' in query '${name}'`);
      }
    }

    if (query.source !== 'blog') {
      errors.push(`Query '${name}' must include source: "blog"`);
    }

    if (query.status && !STATUS_VALUES.has(query.status)) {
      errors.push(`Query '${name}' has invalid status '${query.status}'`);
    }

    if (query.sort && !ALLOWED_SORTS.has(query.sort)) {
      errors.push(`Query '${name}' has invalid sort '${query.sort}'`);
    }

    if (query.limit !== undefined) {
      if (!Number.isInteger(query.limit) || query.limit <= 0) {
        errors.push(`Query '${name}' has invalid limit '${query.limit}'`);
      }
    }

    validateQueryField(query, name, errors, 'year');
    validateQueryField(query, name, errors, 'month');
    validateQueryField(query, name, errors, 'day');
    validateQueryField(query, name, errors, 'ordinal');

    if (query.tag && typeof query.tag !== 'string') {
      errors.push(`Query '${name}' has invalid tag`);
    }

    if (query.stream && typeof query.stream !== 'string') {
      errors.push(`Query '${name}' has invalid stream`);
    }
  }

  if (errors.length) {
    throw new Error(errors.join('\n'));
  }

  return parsed;
}

function executeQueries(index, queries) {
  const results = {};
  for (const [name, query] of Object.entries(queries)) {
    let items = index.slice();

    if (query.status) {
      items = items.filter((item) => item.frontmatter.status === query.status);
    }

    if (query.tag) {
      const tag = normalizeTag(query.tag);
      items = items.filter((item) => (item.frontmatter.tags || []).includes(tag));
    }

    if (query.stream) {
      items = items.filter((item) => item.frontmatter.stream === query.stream);
    }

    items = applyEqualityOrRange(items, query, 'year');
    items = applyEqualityOrRange(items, query, 'month');
    items = applyEqualityOrRange(items, query, 'day');
    items = applyEqualityOrRange(items, query, 'ordinal');

    if (query.sort) {
      items.sort(makeSortFn(query.sort));
    }

    if (query.limit) {
      items = items.slice(0, query.limit);
    }

    results[name] = items;
  }

  return results;
}

function renderSite(index, queryResults) {
  cleanDir(OUTPUT_DIR);
  ensureDir(OUTPUT_DIR);

  const homeTemplate = fs.readFileSync(HOME_TEMPLATE, 'utf8');
  const homeHtml = renderTemplate(homeTemplate, queryResults);
  writeFile(path.join(OUTPUT_DIR, 'index.html'), homeHtml);

  const articleTemplate = fs.readFileSync(ARTICLE_TEMPLATE, 'utf8');
  const articleCandidates = queryResults['article-pages'] || [];

  const outputPaths = new Set();

  for (const article of articleCandidates) {
    const perArticleResults = { 'article-page': [article] };
    const articleHtml = renderTemplate(articleTemplate, perArticleResults);

    const outputDir = path.join(OUTPUT_DIR, article.relDir);
    const outputFile = path.join(outputDir, 'index.html');
    const outputRel = toPosix(path.relative(OUTPUT_DIR, outputFile));

    if (outputPaths.has(outputRel)) {
      throw new Error(`Duplicate output path: ${outputRel}`);
    }

    outputPaths.add(outputRel);
    ensureDir(outputDir);
    writeFile(outputFile, articleHtml);
  }
}

function copyAssets(index) {
  for (const article of index) {
    const assetsDir = path.join(article.dir, 'assets');
    if (!fs.existsSync(assetsDir)) {
      continue;
    }
    const destDir = path.join(OUTPUT_DIR, article.relDir, 'assets');
    copyDir(assetsDir, destDir);
  }
}

function renderTemplate(html, queryResults) {
  const templateRegex = /<template\b([^>]*)>([\s\S]*?)<\/template>/g;

  const rendered = html.replace(templateRegex, (full, attrText, fallback) => {
    if (/<template\b/i.test(fallback)) {
      throw new Error('Nested <template> elements are not allowed');
    }

    const attrs = parseAttributes(attrText);
    const queryName = attrs['data-query'];
    if (!queryName) {
      throw new Error('Missing data-query attribute');
    }

    if (!queryResults[queryName] && !INTERNAL_QUERY_NAMES.has(queryName)) {
      throw new Error(`Unknown query '${queryName}'`);
    }

    const view = attrs['data-view'] || 'article';
    if (!['article', 'summary', 'summary-list'].includes(view)) {
      throw new Error(`Unknown data-view '${view}'`);
    }

    const items = queryResults[queryName] || [];
    if (!items.length) {
      return fallback;
    }

    const fragments = items.map((item) => {
      if (view === 'article') {
        return renderArticleBody(item);
      }
      const summary = renderSummary(item);
      if (view === 'summary-list') {
        return `<li class="summary-item">${summary}</li>`;
      }
      return summary;
    });

    return fragments.join('\n');
  });

  if (/<template\b/i.test(rendered)) {
    throw new Error('Rendered output still contains <template> elements');
  }

  return rendered;
}

function renderArticleBody(article) {
  const raw = fs.readFileSync(article.mdPath, 'utf8');
  const parsed = parseFrontmatter(raw);
  if (!parsed) {
    throw new Error(`Missing frontmatter in ${article.relDir}/article.md`);
  }
  return renderMarkdown(parsed.body);
}

function renderSummary(article) {
  const fm = article.frontmatter;
  if (!fm.title) {
    throw new Error(`Summary view requires frontmatter title in ${article.relDir}/article.md`);
  }

  const titleText = fm.title;
  const titleHtml = renderInline(titleText);
  const summaryHtml = fm.summary ? renderInline(fm.summary) : null;
  const dateText = `${article.year}-${article.month}-${article.day}`;

  const parts = [];
  parts.push('<article class="summary">');
  parts.push('  <header class="summary-header">');
  parts.push(`    <h2 class="summary-title"><a href="${article.publicPath}">${titleHtml}</a></h2>`);
  parts.push(`    <time class="summary-date" datetime="${dateText}">${dateText}</time>`);
  parts.push('  </header>');

  if (fm.thumbnail) {
    const thumbSrc = joinUrl(article.publicPath, fm.thumbnail);
    parts.push('  <figure class="summary-thumb">');
    parts.push(`    <img src="${thumbSrc}" alt="${escapeHtml(titleText)}" />`);
    parts.push('  </figure>');
  }

  if (summaryHtml) {
    parts.push(`  <p class="summary-text">${summaryHtml}</p>`);
  }

  const metaRows = [];
  const tags = fm.tags || [];
  if (tags.length) {
    metaRows.push('    <dt>Tags</dt>');
    for (const tag of tags) {
      metaRows.push(`    <dd><a rel="tag" href="/tags/${tag}/">${escapeHtml(tag)}</a></dd>`);
    }
  }
  if (fm.stream) {
    metaRows.push('    <dt>Stream</dt>');
    metaRows.push(`    <dd>${escapeHtml(fm.stream)}</dd>`);
  }

  if (metaRows.length) {
    parts.push('  <dl class="summary-meta">');
    parts.push(metaRows.join('\n'));
    parts.push('  </dl>');
  }

  parts.push('</article>');
  return parts.join('\n');
}

function renderMarkdown(body) {
  const lines = body.split(/\r?\n/);
  let html = '';
  let paragraph = [];
  let inCode = false;
  let codeLang = '';
  let codeLines = [];

  function flushParagraph() {
    if (!paragraph.length) {
      return;
    }
    const text = paragraph.join(' ').trim();
    if (text) {
      html += `<p>${renderInline(text)}</p>\n`;
    }
    paragraph = [];
  }

  function flushCode() {
    const code = escapeHtml(codeLines.join('\n'));
    const classAttr = codeLang ? ` class="language-${codeLang}"` : '';
    html += `<pre><code${classAttr}>${code}</code></pre>\n`;
    codeLines = [];
    codeLang = '';
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        inCode = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      html += `<h${level}>${renderInline(text)}</h${level}>\n`;
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    paragraph.push(trimmed);
  }

  if (inCode) {
    flushCode();
  }

  flushParagraph();
  return html.trim();
}

function parseFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (!lines.length || lines[0].trim() !== '---') {
    return null;
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return null;
  }

  const frontmatterLines = lines.slice(1, endIndex);
  const body = lines.slice(endIndex + 1).join('\n');

  const frontmatter = parseFrontmatterLines(frontmatterLines);
  return { frontmatter, body };
}

function parseFrontmatterLines(lines) {
  const data = {};
  let currentKey = null;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const commentMatch = line.trim().startsWith('#');
    if (commentMatch) {
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const rawValue = keyMatch[2];

      if (!rawValue) {
        data[currentKey] = [];
        continue;
      }

      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        const items = rawValue.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean);
        data[currentKey] = items.map(stripQuotes);
      } else {
        data[currentKey] = stripQuotes(rawValue.trim());
      }

      continue;
    }

    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(stripQuotes(listMatch[1].trim()));
    }
  }

  return data;
}

function stripQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function renderInline(text) {
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return escaped;
}

function normalizeTag(tag) {
  return String(tag || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]/g, '');
}

function validateQueryField(query, name, errors, field) {
  const value = query[field];
  if (value === undefined) {
    return;
  }

  if (typeof value === 'object') {
    const from = value.from;
    const to = value.to;
    if (from === undefined || to === undefined) {
      errors.push(`Query '${name}' range for ${field} must include from/to`);
      return;
    }
    if (!isNumeric(from) || !isNumeric(to)) {
      errors.push(`Query '${name}' range for ${field} must be numeric`);
      return;
    }
    if (Number(from) > Number(to)) {
      errors.push(`Query '${name}' range for ${field} must be ordered`);
    }
    return;
  }

  if (!isNumeric(value)) {
    errors.push(`Query '${name}' has invalid ${field}`);
  }
}

function applyEqualityOrRange(items, query, field) {
  const value = query[field];
  if (value === undefined) {
    return items;
  }

  const key = field + 'Num';
  if (typeof value === 'object') {
    const from = Number(value.from);
    const to = Number(value.to);
    return items.filter((item) => item[key] >= from && item[key] <= to);
  }

  const target = Number(value);
  return items.filter((item) => item[key] === target);
}

function makeSortFn(sort) {
  return (a, b) => {
    let delta = 0;

    if (sort.startsWith('date')) {
      const dateA = a.yearNum * 10000 + a.monthNum * 100 + a.dayNum;
      const dateB = b.yearNum * 10000 + b.monthNum * 100 + b.dayNum;
      delta = dateA - dateB;
      if (delta === 0) {
        delta = a.ordinalNum - b.ordinalNum;
      }
    } else if (sort.startsWith('ordinal')) {
      delta = a.ordinalNum - b.ordinalNum;
    }

    if (sort.endsWith('desc')) {
      delta *= -1;
    }

    if (delta !== 0) {
      return delta;
    }

    return a.relDir.localeCompare(b.relDir);
  };
}

function listDirs(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function parseAttributes(attrText) {
  const attrs = {};
  const regex = /([A-Za-z0-9:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let match;
  while ((match = regex.exec(attrText)) !== null) {
    attrs[match[1]] = match[3] || match[4] || '';
  }
  return attrs;
}

function cleanDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, contents) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, contents);
}

function copyDir(source, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isNumeric(value) {
  return value !== '' && value !== null && value !== undefined && !Number.isNaN(Number(value));
}

function joinUrl(base, relative) {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedRel = String(relative).replace(/^\/+/, '');
  return `${normalizedBase}${normalizedRel}`;
}

function toPosix(pth) {
  return pth.split(path.sep).join('/');
}

if (require.main === module) {
  main();
}
