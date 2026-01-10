#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'content', 'blog');
const TEMPLATE_DIR = path.join(ROOT, 'templates');
const OUTPUT_DIR = path.join(ROOT, 'build');
const ARCHIVE_OUTPUT_ROOT = path.join(OUTPUT_DIR, 'content', 'blog');
const STATIC_ASSETS_DIR = path.join(ROOT, 'assets');
const QUERIES_PATH = path.join(ROOT, 'config', 'queries.json');
const COLLECTIONS_PATH = path.join(ROOT, 'config', 'collections.json');

const SITE_URL = 'https://jhardy.work';
const SITE_DESCRIPTION = 'A public experiment in building a publishing system while using it, with essays and specs evolving alongside the code.';
const META_COLOR_SCHEME = 'light';
const META_THEME_COLOR = '#ffffff';

const ARTICLE_TEMPLATE = path.join(TEMPLATE_DIR, 'article.html');
const HOME_TEMPLATE = path.join(TEMPLATE_DIR, 'home.html');
const BLOG_TEMPLATE = path.join(TEMPLATE_DIR, 'blog.html');
const YEAR_TEMPLATE = path.join(TEMPLATE_DIR, 'year.html');
const SUMMARY_TEMPLATE = path.join(TEMPLATE_DIR, 'summary-index.html');
const TAG_INDEX_TEMPLATE = path.join(TEMPLATE_DIR, 'tags.html');
const STREAM_INDEX_TEMPLATE = path.join(TEMPLATE_DIR, 'streams.html');

const STATUS_VALUES = new Set(['draft', 'review', 'published', 'archived']);
const INTERNAL_QUERY_NAMES = new Set(['article-page']);
const ALLOWED_QUERY_KEYS = new Set([
  'source',
  'status',
  'tag',
  'year',
  'month',
  'day',
  'ordinal',
  'sort',
  'limit'
]);
const ALLOWED_SORTS = new Set(['date-asc', 'date-desc', 'ordinal-asc', 'ordinal-desc']);
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function main() {
  const articles = discoverArticles(CONTENT_ROOT);
  const index = buildIndex(articles);
  const queries = loadQueries(QUERIES_PATH);
  const collections = loadCollections(COLLECTIONS_PATH);
  const queryResults = executeQueries(index, queries);
  renderSite(index, queryResults, collections);
  copyStaticAssets();
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

    if (Object.prototype.hasOwnProperty.call(frontmatter, 'stream')) {
      errors.push(`Frontmatter includes deprecated 'stream' field in ${record.relDir}/article.md`);
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

    for (const key of ['title', 'summary', 'thumbnail']) {
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

  }

  if (errors.length) {
    throw new Error(errors.join('\n'));
  }

  return parsed;
}

function loadCollections(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing collections file: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON in ${filePath}`);
  }

  const errors = [];
  const streams = Array.isArray(parsed.streams) ? parsed.streams : [];
  const featured = Array.isArray(parsed.featured) ? parsed.featured : [];

  if (parsed.streams && !Array.isArray(parsed.streams)) {
    errors.push('Collections "streams" must be a list');
  }
  if (parsed.featured && !Array.isArray(parsed.featured)) {
    errors.push('Collections "featured" must be a list');
  }

  const normalizedStreams = [];
  for (const entry of streams) {
    if (typeof entry !== 'string') {
      errors.push('Stream entries must be strings');
      continue;
    }
    const tag = normalizeTag(entry);
    if (tag && !normalizedStreams.includes(tag)) {
      normalizedStreams.push(tag);
    }
  }

  const normalizedFeatured = [];
  for (const entry of featured) {
    if (typeof entry !== 'string') {
      errors.push('Featured entries must be strings');
      continue;
    }
    const trimmed = entry.trim();
    if (trimmed && !normalizedFeatured.includes(trimmed)) {
      normalizedFeatured.push(trimmed);
    }
  }

  if (errors.length) {
    throw new Error(errors.join('\n'));
  }

  return {
    streams: normalizedStreams,
    featured: normalizedFeatured
  };
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

function renderSite(index, queryResults, collections) {
  cleanDir(OUTPUT_DIR);
  ensureDir(OUTPUT_DIR);

  const homeTemplate = fs.readFileSync(HOME_TEMPLATE, 'utf8');
  const homeHtml = renderTemplate(
    applyMeta(homeTemplate, {
      canonical: joinUrl(SITE_URL, '/'),
      description: SITE_DESCRIPTION
    }),
    queryResults
  );
  writeFile(path.join(OUTPUT_DIR, 'index.html'), homeHtml);

  const articleTemplate = fs.readFileSync(ARTICLE_TEMPLATE, 'utf8');
  const articleCandidates = queryResults['article-pages'] || [];

  const outputPaths = new Set();

  for (const article of articleCandidates) {
    const perArticleResults = { 'article-page': [article] };
    const articleHtml = renderTemplate(
      applyMeta(articleTemplate, {
        canonical: joinUrl(SITE_URL, article.publicPath),
        description: descriptionForArticle(article)
      }),
      perArticleResults
    );

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

  const published = queryResults['all-published-posts']
    ? queryResults['all-published-posts'].slice()
    : index.filter((item) => item.frontmatter.status === 'published').sort(makeSortFn('date-asc'));

  renderArchiveRoot(published);
  renderYearArchives(published);
  renderMonthArchives(published);
  renderTagArchives(published);
  renderTagIndex(published);
  renderStreamArchives(published, collections);
  renderStreamIndex(published, collections);
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

function copyStaticAssets() {
  if (!fs.existsSync(STATIC_ASSETS_DIR)) {
    return;
  }
  const destDir = path.join(OUTPUT_DIR, 'assets');
  copyDir(STATIC_ASSETS_DIR, destDir);
}

function renderArchiveRoot(published) {
  const template = fs.readFileSync(BLOG_TEMPLATE, 'utf8');
  const yearCounts = countBy(published, (item) => item.year);
  const years = Object.keys(yearCounts).sort((a, b) => Number(b) - Number(a));

  const yearList = years.length
    ? years.map((year) => {
      const count = yearCounts[year];
      return `<li><a href="/content/blog/${year}/">${escapeHtml(year)}</a> (${count})</li>`;
    }).join('\n')
    : '<li class="archive-empty">No posts yet.</li>';

  const html = renderTemplate(
    applySlots(
      applyMeta(template, {
        canonical: joinUrl(SITE_URL, '/content/blog/'),
        description: SITE_DESCRIPTION
      }),
      { 'year-list': yearList }
    ),
    {}
  );
  writeFile(path.join(ARCHIVE_OUTPUT_ROOT, 'index.html'), html);
}

function renderYearArchives(published) {
  const template = fs.readFileSync(YEAR_TEMPLATE, 'utf8');
  const byYear = groupBy(published, (item) => item.year);
  const years = Array.from(byYear.keys()).sort((a, b) => Number(b) - Number(a));

  for (const year of years) {
    const yearItems = sortItems(byYear.get(year), 'date-asc');
    const byMonth = groupBy(yearItems, (item) => item.month);
    const months = Array.from(byMonth.keys()).sort((a, b) => Number(a) - Number(b));
    const queryResults = {};

    const monthSections = months.map((month) => {
      const monthItems = sortItems(byMonth.get(month), 'date-asc');
      const queryName = `year-${year}-month-${month}`;
      queryResults[queryName] = monthItems;

      const monthLabel = `${monthName(month)} ${year}`;
      const monthLink = `/content/blog/${year}/${month}/`;
      return [
        '<section class="archive-month">',
        `  <h2><a href="${monthLink}">${escapeHtml(monthLabel)}</a></h2>`,
        '  <ul class="summary-list">',
        `    <template data-query="${queryName}" data-view="summary-list">`,
        '      <li class="summary-empty">No posts yet.</li>',
        '    </template>',
        '  </ul>',
        '</section>'
      ].join('\n');
    }).join('\n');

    const content = monthSections || '<p class="summary-empty">No posts yet.</p>';
    const html = applySlots(
      applyMeta(template, {
        canonical: joinUrl(SITE_URL, `/content/blog/${year}/`),
        description: SITE_DESCRIPTION
      }),
      {
        'page-title': escapeHtml(`${year} - Archive - jhardy.work`),
        year: escapeHtml(year),
        'month-sections': content
      }
    );
    const rendered = renderTemplate(html, queryResults);
    writeFile(path.join(ARCHIVE_OUTPUT_ROOT, year, 'index.html'), rendered);
  }
}

function renderMonthArchives(published) {
  const template = fs.readFileSync(SUMMARY_TEMPLATE, 'utf8');
  const byMonth = groupBy(published, (item) => `${item.year}-${item.month}`);
  const keys = Array.from(byMonth.keys()).sort((a, b) => b.localeCompare(a));

  for (const key of keys) {
    const [year, month] = key.split('-');
    const monthItems = sortItems(byMonth.get(key), 'date-asc');
    const label = `${monthName(month)} ${year}`;
    const slots = {
      'page-title': escapeHtml(`${label} - Archive - jhardy.work`),
      'page-heading': escapeHtml(label),
      'page-intro': '',
      'page-extra': '',
      'nav-extra': `<a href="/content/blog/${year}/">${escapeHtml(year)}</a>`
    };
    const html = renderTemplate(
      applySlots(
        applyMeta(template, {
          canonical: joinUrl(SITE_URL, `/content/blog/${year}/${month}/`),
          description: SITE_DESCRIPTION
        }),
        slots
      ),
      {
        'page-posts': monthItems
      }
    );
    writeFile(path.join(ARCHIVE_OUTPUT_ROOT, year, month, 'index.html'), html);
  }
}

function renderTagArchives(published) {
  const template = fs.readFileSync(SUMMARY_TEMPLATE, 'utf8');
  const tagMap = new Map();

  for (const article of published) {
    const tags = article.frontmatter.tags || [];
    for (const rawTag of tags) {
      const tag = normalizeTag(rawTag);
      if (!tag) {
        continue;
      }
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag).push(article);
    }
  }

  const tags = Array.from(tagMap.keys()).sort();
  for (const tag of tags) {
    const items = tagMap.get(tag);
    const itemsDesc = sortItems(items, 'date-desc');
    const latest = itemsDesc.slice(0, 12);
    const yearCounts = countBy(items, (item) => item.year);
    const years = Object.keys(yearCounts).sort((a, b) => Number(b) - Number(a));

    const yearList = years.length
      ? [
        '<section class="tag-years">',
        '  <h2>Years</h2>',
        '  <ul class="tag-year-list">',
        years.map((year) => {
          const count = yearCounts[year];
          return `    <li><a href="/tags/${tag}/${year}/">${escapeHtml(year)}</a> (${count})</li>`;
        }).join('\n'),
        '  </ul>',
        '</section>'
      ].join('\n')
      : '';

    const slots = {
      'page-title': escapeHtml(`Tag: ${tag} - jhardy.work`),
      'page-heading': escapeHtml(`Tag: ${tag}`),
      'page-intro': '',
      'page-extra': yearList,
      'nav-extra': ''
    };

    const html = renderTemplate(
      applySlots(
        applyMeta(template, {
          canonical: joinUrl(SITE_URL, `/tags/${tag}/`),
          description: SITE_DESCRIPTION
        }),
        slots
      ),
      {
        'page-posts': latest
      }
    );
    writeFile(path.join(OUTPUT_DIR, 'tags', tag, 'index.html'), html);

    for (const year of years) {
      const yearItems = itemsDesc.filter((item) => item.year === year);
      const yearSlots = {
        'page-title': escapeHtml(`Tag: ${tag} - ${year} - jhardy.work`),
        'page-heading': escapeHtml(`Tag: ${tag} - ${year}`),
        'page-intro': '',
        'page-extra': '',
        'nav-extra': `<a href="/tags/${tag}/">${escapeHtml(tag)}</a>`
      };
      const yearHtml = renderTemplate(
        applySlots(
          applyMeta(template, {
            canonical: joinUrl(SITE_URL, `/tags/${tag}/${year}/`),
            description: SITE_DESCRIPTION
          }),
          yearSlots
        ),
        {
          'page-posts': yearItems
        }
      );
      writeFile(path.join(OUTPUT_DIR, 'tags', tag, year, 'index.html'), yearHtml);
    }
  }
}

function renderTagIndex(published) {
  const template = fs.readFileSync(TAG_INDEX_TEMPLATE, 'utf8');
  const tagCounts = new Map();

  for (const article of published) {
    const tags = article.frontmatter.tags || [];
    for (const rawTag of tags) {
      const tag = normalizeTag(rawTag);
      if (!tag) {
        continue;
      }
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const tags = Array.from(tagCounts.keys()).sort();
  const tagList = tags.length
    ? tags.map((tag) => {
      const count = tagCounts.get(tag);
      return `<li><a href="/tags/${tag}/">${escapeHtml(tag)}</a> (${count})</li>`;
    }).join('\n')
    : '<li class="archive-empty">No tags yet.</li>';

  const html = renderTemplate(
    applySlots(
      applyMeta(template, {
        canonical: joinUrl(SITE_URL, '/tags/'),
        description: SITE_DESCRIPTION
      }),
      { 'tag-list': tagList }
    ),
    {}
  );
  writeFile(path.join(OUTPUT_DIR, 'tags', 'index.html'), html);
}

function renderStreamArchives(published, collections) {
  const streams = (collections && collections.streams) || [];
  if (!streams.length) {
    return;
  }

  const template = fs.readFileSync(SUMMARY_TEMPLATE, 'utf8');

  for (const stream of streams) {
    const items = published.filter((article) => {
      const tags = article.frontmatter.tags || [];
      return tags.includes(stream);
    });

    const itemsDesc = sortItems(items, 'date-desc');
    const latest = itemsDesc.slice(0, 12);
    const yearCounts = countBy(items, (item) => item.year);
    const years = Object.keys(yearCounts).sort((a, b) => Number(b) - Number(a));

    const yearList = years.length
      ? [
        '<section class="tag-years">',
        '  <h2>Years</h2>',
        '  <ul class="tag-year-list">',
        years.map((year) => {
          const count = yearCounts[year];
          return `    <li><a href="/content/blog/${year}/">${escapeHtml(year)}</a> (${count})</li>`;
        }).join('\n'),
        '  </ul>',
        '</section>'
      ].join('\n')
      : '';

    const slots = {
      'page-title': escapeHtml(`Stream: ${stream} - jhardy.work`),
      'page-heading': escapeHtml(`Stream: ${stream}`),
      'page-intro': '',
      'page-extra': yearList,
      'nav-extra': '<a href="/streams/">Streams</a>'
    };

    const html = renderTemplate(
      applySlots(
        applyMeta(template, {
          canonical: joinUrl(SITE_URL, `/streams/${stream}/`),
          description: SITE_DESCRIPTION
        }),
        slots
      ),
      {
        'page-posts': latest
      }
    );
    writeFile(path.join(OUTPUT_DIR, 'streams', stream, 'index.html'), html);
  }
}

function renderStreamIndex(published, collections) {
  const streams = (collections && collections.streams) || [];
  const template = fs.readFileSync(STREAM_INDEX_TEMPLATE, 'utf8');
  const streamCounts = new Map();

  for (const article of published) {
    const tags = article.frontmatter.tags || [];
    for (const tag of tags) {
      if (!streams.includes(tag)) {
        continue;
      }
      streamCounts.set(tag, (streamCounts.get(tag) || 0) + 1);
    }
  }

  const streamList = streams.length
    ? streams.map((stream) => {
      const count = streamCounts.get(stream) || 0;
      return `<li><a href="/streams/${stream}/">${escapeHtml(stream)}</a> (${count})</li>`;
    }).join('\n')
    : '<li class="archive-empty">No streams yet.</li>';

  const html = renderTemplate(
    applySlots(
      applyMeta(template, {
        canonical: joinUrl(SITE_URL, '/streams/'),
        description: SITE_DESCRIPTION
      }),
      { 'stream-list': streamList }
    ),
    {}
  );
  writeFile(path.join(OUTPUT_DIR, 'streams', 'index.html'), html);
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

  if (metaRows.length) {
    parts.push('  <dl class="summary-meta">');
    parts.push(metaRows.join('\n'));
    parts.push('  </dl>');
  }

  parts.push('</article>');
  return parts.join('\n');
}

function applySlots(html, slots) {
  if (!slots || typeof slots !== 'object') {
    return html;
  }
  return html.replace(
    /(<([a-zA-Z0-9:-]+)(?:\s[^>]*?)?\sdata-slot="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (full, openTag, tagName, slotName, inner, closeTag) => {
      if (!Object.prototype.hasOwnProperty.call(slots, slotName)) {
        return full;
      }
      return `${openTag}${slots[slotName]}${closeTag}`;
    }
  );
}

function applyContentAttributes(html, values) {
  let output = html;
  for (const [key, value] of Object.entries(values)) {
    const marker = `data-content="${key}"`;
    output = output.split(marker).join(`content="${escapeHtml(value)}"`);
  }
  return output;
}

function applyHrefAttributes(html, values) {
  let output = html;
  for (const [key, value] of Object.entries(values)) {
    const marker = `data-href="${key}"`;
    output = output.split(marker).join(`href="${escapeHtml(value)}"`);
  }
  return output;
}

function applyMeta(html, { canonical, description }) {
  const contentValues = {
    'meta-description': normalizeWhitespace(description || SITE_DESCRIPTION),
    'color-scheme': META_COLOR_SCHEME,
    'theme-color': META_THEME_COLOR
  };
  const hrefValues = {
    'canonical-url': canonical || SITE_URL
  };
  let output = applyContentAttributes(html, contentValues);
  output = applyHrefAttributes(output, hrefValues);
  return output;
}

function descriptionForArticle(article) {
  const summary = article.frontmatter.summary;
  if (summary) {
    const cleaned = stripInlineMarkup(summary);
    if (cleaned) {
      return cleaned;
    }
  }
  return SITE_DESCRIPTION;
}

function stripInlineMarkup(text) {
  return normalizeWhitespace(String(text)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`~]/g, ''));
}

function normalizeWhitespace(text) {
  return String(text).replace(/\s+/g, ' ').trim();
}

function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(item);
  }
  return map;
}

function countBy(items, keyFn) {
  const counts = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function sortItems(items, sort) {
  return items.slice().sort(makeSortFn(sort));
}

function monthName(month) {
  const index = Number(month) - 1;
  return MONTH_NAMES[index] || month;
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
