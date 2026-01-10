#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DEFAULT_ROOT = path.join(ROOT, 'content', 'blog');

const DEFAULT_THRESHOLDS = {
  high: 1,
  medium: 3,
  low: 6
};

const FLAGS_WITH_VALUES = new Set(['--max-high', '--max-medium', '--max-low']);

const args = process.argv.slice(2);
const includePublished = args.includes('--all') || args.includes('--include-published');
const strict = args.includes('--strict');
const gate = args.includes('--gate') || args.includes('--ci');
const thresholds = resolveThresholds(args);
const targets = extractTargets(args);

const RULES = [
  {
    name: 'ai-writing-blacklist',
    weight: 10,
    patterns: [
      // Pivotal/Transformative
      /\bpivotal\b/i,
      /\bgame-changer\b/i,
      /\bunlock(?:s|ed|ing)?\b/i,
      /\bunleash(?:es|ed|ing)?\b/i,
      /\brevolutioniz(?:e|es|ed|ing)\b/i,
      /\blandscape\b/i,
      
      // Exploring/Navigating
      /\bdelve\b/i,
      /\bdive into\b/i,
      /\bnavigate the complexities\b/i,
      /\bembark on a journey\b/i,
      
      // Optimization/Efficiency
      /\bstreamline\b/i,
      /\bsynergize\b/i,
      /\bmaximize\b/i,
      /\bleverage\b/i,
      /\btap into\b/i,
      
      // Vague Value
      /\bcomprehensive\b/i,
      /\brobust\b/i,
      /\bbespoke\b/i,
      /\bseamless transition\b/i,
      /\bvibrant\b/i,
      
      // Summary Crutches
      /\bin today's fast-paced world\b/i,
      /\bin conclusion\b/i,
      /\blooking ahead\b/i,
      /\btestament\b/i
    ],
    message: 'Forbidden AI-ism (see docs/AI_WRITING.md)'
  },
  {
    name: 'banned-phrase',
    weight: 5,
    patterns: [
      /\bin short\b/i,
      /\bin summary\b/i,
      /\bat the end of the day\b/i,
      /\bthe key takeaway\b/i,
      /\bultimately\b/i,
      /\bin a nutshell\b/i,
      /\bwhat this means is\b/i,
      /\bit's worth noting\b/i,
      /\bat its core\b/i,
      /\bthis highlights the importance of\b/i
    ],
    message: 'Banned phrase'
  },
  {
    name: 'first-person-plural',
    weight: 3,
    patterns: [
      /\bwe\b/i,
      /\bour\b/i,
      /\bours\b/i,
      /\bus\b/i,
      /\bourselves\b/i
    ],
    message: 'First-person plural pronoun (prefer "I")'
  },
  {
    name: 'scene-setting',
    weight: 4,
    patterns: [
      /^(this|in this)\s+(post|article|section)\b/i
    ],
    message: 'Scene-setting opener',
    paragraphStart: true
  }
];

const CONTRAST_PATTERNS = [
  {
    label: 'not X. it is Y',
    weight: 8,
    regex: /\bnot\b[^.?!]{0,160}[.?!]\s+(it|this)\s+(is|'s)\b/gi
  },
  {
    label: "isn't X. it's Y",
    weight: 6,
    regex: /\bisn['’]t\b[^.?!]{0,160}[.?!]\s+it(?:'s|’s| is)\b/gi
  },
  {
    label: "goal isn't X. it's Y",
    weight: 8,
    regex: /\b(goal|aim|purpose|point|intent)\b[^.?!]{0,80}\bisn['’]t\b[^.?!]{0,160}[.?!]\s+it(?:'s|’s| is)\b/gi
  },
  {
    label: 'is/are not X. it/they <verb>',
    weight: 8,
    regex: /\b(?:is|are|was|were)\s+not\b[^.?!]{0,200}[.?!]\s+(?:it|this|they|these|that|those)\s+(?!do\s+not|does\s+not|did\s+not|is\s+not|are\s+not|was\s+not|were\s+not)\b\w+/gi
  },
  {
    label: 'do/does not X. it/they <verb>',
    weight: 8,
    regex: /\b(?:do|does|did)\s+not\b[^.?!]{0,200}[.?!]\s+(?:it|this|they|these|that|those)\s+(?!do\s+not|does\s+not|did\s+not|is\s+not|are\s+not|was\s+not|were\s+not)\b\w+/gi
  },
  {
    label: 'not X, but Y',
    weight: 6,
    regex: /\bnot\b[^.?!]{0,100}\bbut\b/gi
  },
  {
    label: 'not only X but Y',
    weight: 6,
    regex: /\bnot only\b[^.?!]{0,120}\bbut\b/gi
  },
  {
    label: 'rather than',
    weight: 4,
    regex: /\brather than\b/gi
  },
  {
    label: 'instead of',
    weight: 4,
    regex: /\binstead of\b/gi
  },
  {
    label: 'not about',
    weight: 3,
    regex: /\b(it is|it's|this is)\s+not\s+about\b/gi
  },
  {
    label: 'not a/an',
    weight: 3,
    regex: /\b(it is|it's|this is)\s+not\s+(a|an)\b/gi
  }
];

const CONTRAST_PARAGRAPH_CAP = 12;
const EMDASH_LINES_PER = 20;
const EMDASH_PATTERN = /—/g;
const PUNCTUATION_RULES = [
  {
    label: 'ellipsis',
    weight: 2,
    regex: /\.{3,}|…/g,
    message: 'Ellipsis'
  },
  {
    label: 'multiple-exclamation',
    weight: 2,
    regex: /!{2,}/g,
    message: 'Multiple exclamation points'
  },
  {
    label: 'interrobang',
    weight: 2,
    regex: /\?!|!\?/g,
    message: 'Interrobang'
  }
];

const DISCOURSE_MARKERS = [
  'however',
  'therefore',
  'moreover',
  'overall',
  'in addition',
  'in fact',
  'as a result',
  'in other words',
  'on the other hand'
];

function main() {
  const files = resolveTargets(targets.length ? targets : [DEFAULT_ROOT]);

  if (!files.length) {
    return;
  }

  let checked = 0;
  let skipped = 0;
  let totalIssues = 0;
  let totalScore = 0;
  const reports = [];

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = parseFrontmatter(raw);
    if (!parsed) {
      reports.push({
        filePath,
        status: 'unknown',
        score: 5,
        severityCounts: { high: 1, medium: 0, low: 0 },
        issues: [
          {
            line: 1,
            weight: 5,
            severity: 'high',
            message: 'Missing frontmatter'
          }
        ]
      });
      checked += 1;
      totalIssues += 1;
      totalScore += 5;
      continue;
    }

    const status = parsed.frontmatter.status || 'unknown';
    if (!includePublished && status === 'published') {
      skipped += 1;
      continue;
    }

    checked += 1;
    const result = lintDocument(filePath, parsed);
    totalIssues += result.issues.length;
    totalScore += result.score;
    reports.push(result);
  }

  if (!reports.length) {
    return;
  }

  let totalHigh = 0;
  let totalMedium = 0;
  let totalLow = 0;
  let warningFiles = 0;
  let errorFiles = 0;
  const gateEnabled = gate && !strict;

  for (const report of reports) {
    if (!report.severityCounts) {
      report.severityCounts = tallySeverities(report.issues);
    }
    const { high, medium, low } = report.severityCounts;
    totalHigh += high;
    totalMedium += medium;
    totalLow += low;

    report.thresholdStatus = gateEnabled
      ? evaluateThresholds(report.severityCounts, thresholds)
      : report.issues.length
        ? { status: 'warn', reasons: [] }
        : { status: 'pass', reasons: [] };

    if (gateEnabled) {
      if (report.thresholdStatus.status === 'error') {
        errorFiles += 1;
      } else if (report.thresholdStatus.status === 'warn') {
        warningFiles += 1;
      }
    }
  }

  if (totalIssues === 0) {
    return;
  }

  for (const report of reports) {
    if (!report.issues.length) {
      continue;
    }
    console.log(`${report.filePath}`);
    console.log(`Score: ${report.score}`);
    for (const issue of report.issues) {
      const lineInfo = issue.line ? `:${issue.line}` : '';
      const severityTag = issue.severity ? ` [${issue.severity}]` : '';
      console.log(`- ${report.filePath}${lineInfo}${severityTag} ${issue.message}`);
    }
    console.log(`Severity: high ${report.severityCounts.high} | medium ${report.severityCounts.medium} | low ${report.severityCounts.low}`);
    if (gateEnabled) {
      const status = report.thresholdStatus.status.toUpperCase();
      const reasons = report.thresholdStatus.reasons.length
        ? ` (${report.thresholdStatus.reasons.join(', ')})`
        : '';
      console.log(`Gate: ${status}${reasons}`);
    }
    console.log('');
  }

  console.log(`Checked: ${checked} | Skipped: ${skipped} | Issues: ${totalIssues} | Score: ${totalScore}`);
  console.log(`Severity totals: high ${totalHigh} | medium ${totalMedium} | low ${totalLow}`);
  if (gateEnabled) {
    console.log(`Thresholds (per file): high>=${thresholds.high}, medium>=${thresholds.medium}, low>=${thresholds.low}`);
    const gateStatus = errorFiles > 0 ? 'FAIL' : 'PASS';
    console.log(`Gate: ${gateStatus} | Errors: ${errorFiles} | Warnings: ${warningFiles}`);
  }

  if (strict && totalIssues > 0) {
    process.exitCode = 1;
  } else if (gateEnabled && errorFiles > 0) {
    process.exitCode = 1;
  }
}

function extractTargets(entries) {
  const targets = [];
  for (let i = 0; i < entries.length; i += 1) {
    const arg = entries[i];
    if (arg.startsWith('--')) {
      if (FLAGS_WITH_VALUES.has(arg)) {
        i += 1;
      }
      continue;
    }
    targets.push(arg);
  }
  return targets;
}

function resolveThresholds(entries) {
  const thresholds = { ...DEFAULT_THRESHOLDS };
  const high = readNumericFlag(entries, '--max-high');
  const medium = readNumericFlag(entries, '--max-medium');
  const low = readNumericFlag(entries, '--max-low');

  if (Number.isFinite(high) && high >= 0) {
    thresholds.high = high;
  }
  if (Number.isFinite(medium) && medium >= 0) {
    thresholds.medium = medium;
  }
  if (Number.isFinite(low) && low >= 0) {
    thresholds.low = low;
  }

  return thresholds;
}

function readNumericFlag(entries, flag) {
  const withEquals = entries.find((arg) => arg.startsWith(`${flag}=`));
  if (withEquals) {
    const value = Number(withEquals.split('=')[1]);
    return Number.isFinite(value) ? value : undefined;
  }
  const index = entries.indexOf(flag);
  if (index !== -1 && index + 1 < entries.length) {
    const value = Number(entries[index + 1]);
    return Number.isFinite(value) ? value : undefined;
  }
  return undefined;
}

function resolveTargets(entries) {
  const files = new Set();

  for (const entry of entries) {
    const resolved = path.resolve(entry);
    if (!fs.existsSync(resolved)) {
      continue;
    }
    const stat = fs.statSync(resolved);
    if (stat.isFile()) {
      if (path.basename(resolved) === 'article.md') {
        files.add(resolved);
      }
      continue;
    }
    if (stat.isDirectory()) {
      walk(resolved, files);
    }
  }

  return Array.from(files).sort();
}

function walk(dirPath, files) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.isFile() && entry.name === 'article.md') {
      files.add(fullPath);
    }
  }
}

function lintDocument(filePath, parsed) {
  const issues = [];
  const { frontmatter, frontmatterLines, body, bodyStartLine } = parsed;

  lintFrontmatterField(filePath, 'title', frontmatter, frontmatterLines, issues);
  lintFrontmatterField(filePath, 'summary', frontmatter, frontmatterLines, issues);

  lintBody(filePath, body, bodyStartLine, issues);
  lintMetrics(filePath, body, issues);

  const score = issues.reduce((sum, issue) => sum + issue.weight, 0);
  return { filePath, score, issues, severityCounts: tallySeverities(issues) };
}

function lintFrontmatterField(filePath, field, frontmatter, frontmatterLines, issues) {
  const value = frontmatter[field];
  if (!value) {
    return;
  }
  const lineNumber = frontmatterLines[field] || 1;
  lintLine(filePath, value, lineNumber, issues);
}

function lintBody(filePath, body, lineOffset, issues) {
  const lines = body.split(/\r?\n/);
  let inCode = false;
  let prevBlank = true;
  let paragraphLines = [];
  let paragraphStartLine = 0;
  let listMode = null;
  let orderedListBlocks = 0;
  let unorderedListBlocks = 0;
  const paragraphs = [];

  function flushParagraph() {
    if (!paragraphLines.length) {
      return;
    }
    const paragraphText = paragraphLines.join(' ').trim();
    if (paragraphText) {
      lintContrastParagraph(paragraphText, paragraphStartLine, issues);
      paragraphs.push({ text: paragraphText, line: paragraphStartLine });
    }
    paragraphLines = [];
    paragraphStartLine = 0;
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNumber = lineOffset + i;

    if (trimmed.startsWith('```')) {
      if (!inCode) {
        flushParagraph();
        listMode = null;
      }
      inCode = !inCode;
      continue;
    }

    if (inCode) {
      continue;
    }

    const isOrdered = /^\s*\d+[.)]\s+\S/.test(line);
    const isUnordered = /^\s*[-*+]\s+\S/.test(line);

    if (isOrdered) {
      if (listMode !== 'ordered') {
        orderedListBlocks += 1;
        listMode = 'ordered';
      }
    } else if (isUnordered) {
      if (listMode !== 'unordered') {
        unorderedListBlocks += 1;
        listMode = 'unordered';
      }
    } else {
      listMode = null;
    }

    if (trimmed) {
      lintLine(filePath, line, lineNumber, issues);
      if (prevBlank) {
        lintParagraphStart(filePath, line, lineNumber, issues);
        paragraphStartLine = lineNumber;
      }
      if (!isOrdered && !isUnordered) {
        paragraphLines.push(line);
      }
      prevBlank = false;
    } else {
      flushParagraph();
      prevBlank = true;
      listMode = null;
    }
  }

  flushParagraph();
  lintListBlocks(orderedListBlocks, unorderedListBlocks, issues);
  lintConditionalClosing(paragraphs, issues);
}

function lintLine(filePath, line, lineNumber, issues) {
  for (const rule of RULES) {
    if (rule.paragraphStart) {
      continue;
    }
    for (const pattern of rule.patterns) {
      if (pattern.test(line)) {
        addIssue(issues, {
          line: lineNumber,
          weight: rule.weight,
          message: `${rule.message}: "${extractMatch(pattern, line)}"`
        });
      }
    }
  }
}

function lintContrastParagraph(paragraph, lineNumber, issues) {
  let score = 0;
  const matches = [];

  for (const pattern of CONTRAST_PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;
    while ((match = pattern.regex.exec(paragraph)) !== null) {
      score += pattern.weight;
      matches.push({ label: pattern.label, text: match[0] });
    }
  }

  if (!score) {
    return;
  }

  const capped = Math.min(score, CONTRAST_PARAGRAPH_CAP);
  const sample = matches.slice(0, 3).map((item) => `${item.label}: "${trimSnippet(item.text)}"`).join('; ');
  addIssue(issues, {
    line: lineNumber,
    weight: capped,
    message: `Contrast framing (${score} raw, ${capped} capped). ${sample}`
  });
}

function lintConditionalClosing(paragraphs, issues) {
  if (!paragraphs.length) {
    return;
  }
  const last = paragraphs[paragraphs.length - 1];
  const sentences = splitSentences(last.text);
  if (sentences.length < 2) {
    return;
  }
  const ifStarts = sentences.filter((sentence) => sentence.trim().toLowerCase().startsWith('if ')).length;
  if (ifStarts >= 2) {
    addIssue(issues, {
      line: last.line,
      weight: 3,
      message: `Conditional closing (multiple "If" sentences in final paragraph)`
    });
  }
}

function lintListBlocks(orderedCount, unorderedCount, issues) {
  const total = orderedCount + unorderedCount;
  const allowed = 1;
  if (total <= allowed) {
    return;
  }
  const over = total - allowed;
  addIssue(issues, {
    line: 0,
    weight: 2 * over,
    message: `List blocks (${total}) exceed preferred max (${allowed}). Ordered: ${orderedCount}, unordered: ${unorderedCount}`
  });
}

function lintParagraphStart(filePath, line, lineNumber, issues) {
  for (const rule of RULES) {
    if (!rule.paragraphStart) {
      continue;
    }
    for (const pattern of rule.patterns) {
      if (pattern.test(line)) {
        addIssue(issues, {
          line: lineNumber,
          weight: rule.weight,
          message: `${rule.message}: "${extractMatch(pattern, line)}"`
        });
      }
    }
  }
}

function lintMetrics(filePath, body, issues) {
  const cleaned = stripCodeBlocks(body);
  const sentences = splitSentences(cleaned);
  const lineCount = cleaned ? cleaned.split(/\r?\n/).length : 0;

  if (lineCount) {
    const emdashCount = countMatches(cleaned, EMDASH_PATTERN);
    const allowed = Math.max(1, Math.ceil(lineCount / EMDASH_LINES_PER));
    if (emdashCount > allowed) {
      addIssue(issues, {
        line: 0,
        weight: 3,
        message: `Em dash density (${emdashCount}/${lineCount} lines, allowed ${allowed})`
      });
    }

    for (const rule of PUNCTUATION_RULES) {
      const count = countMatches(cleaned, rule.regex);
      if (count) {
        const weight = rule.weight * Math.min(count, 3);
        addIssue(issues, {
          line: 0,
          weight,
          message: `${rule.message} (${count})`
        });
      }
    }
  }

  if (sentences.length >= 6) {
    const lengths = sentences.map((sentence) => wordCount(sentence));
    const variance = stddev(lengths);
    if (variance < 4) {
      addIssue(issues, {
        line: 0,
        weight: 4,
        message: `Low sentence-length variance (${variance.toFixed(2)})`
      });
    }

    const markerCount = sentences.filter(startsWithMarker).length;
    const ratio = markerCount / sentences.length;
    if (ratio >= 0.35) {
      addIssue(issues, {
        line: 0,
        weight: 3,
        message: `High discourse-marker ratio (${(ratio * 100).toFixed(0)}%)`
      });
    }
  }
}

function stripCodeBlocks(text) {
  return text.replace(/```[\s\S]*?```/g, '');
}

function splitSentences(text) {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) {
    return [];
  }
  return cleaned.split(/(?<=[.!?])\s+/);
}

function wordCount(text) {
  const matches = text.match(/[A-Za-z0-9']+/g);
  return matches ? matches.length : 0;
}

function startsWithMarker(sentence) {
  const lower = sentence.trim().toLowerCase();
  return DISCOURSE_MARKERS.some((marker) => lower.startsWith(marker + ' '));
}

function stddev(numbers) {
  if (!numbers.length) {
    return 0;
  }
  const mean = numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
  const variance = numbers.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
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
  const parsedFrontmatter = parseFrontmatterLines(frontmatterLines, 2);

  return {
    frontmatter: parsedFrontmatter.data,
    frontmatterLines: parsedFrontmatter.lineMap,
    body,
    bodyStartLine: endIndex + 2
  };
}

function parseFrontmatterLines(lines, startLineNumber) {
  const data = {};
  const lineMap = {};
  let currentKey = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const lineNumber = startLineNumber + i;

    if (!line.trim()) {
      continue;
    }

    if (line.trim().startsWith('#')) {
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const rawValue = keyMatch[2];
      lineMap[currentKey] = lineNumber;

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

  return { data, lineMap };
}

function stripQuotes(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  return value;
}

function addIssue(issues, { line, weight, message, severity }) {
  const resolvedSeverity = severity || severityFromWeight(weight);
  issues.push({
    line,
    weight,
    severity: resolvedSeverity,
    message
  });
}

function severityFromWeight(weight) {
  if (weight >= 8) {
    return 'high';
  }
  if (weight >= 4) {
    return 'medium';
  }
  return 'low';
}

function tallySeverities(issues) {
  const counts = { high: 0, medium: 0, low: 0 };
  for (const issue of issues) {
    const severity = issue.severity || severityFromWeight(issue.weight);
    if (!counts[severity]) {
      counts[severity] = 0;
    }
    counts[severity] += 1;
  }
  return counts;
}

function evaluateThresholds(counts, thresholds) {
  const reasons = [];
  if (counts.high >= thresholds.high) {
    reasons.push(`high >= ${thresholds.high}`);
  }
  if (counts.medium >= thresholds.medium) {
    reasons.push(`medium >= ${thresholds.medium}`);
  }
  if (counts.low >= thresholds.low) {
    reasons.push(`low >= ${thresholds.low}`);
  }
  if (reasons.length) {
    return { status: 'error', reasons };
  }
  const total = counts.high + counts.medium + counts.low;
  if (total > 0) {
    return { status: 'warn', reasons: [] };
  }
  return { status: 'pass', reasons: [] };
}

function extractMatch(pattern, line) {
  const match = line.match(pattern);
  if (!match) {
    return line.trim();
  }
  return match[0].trim();
}

function trimSnippet(text) {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= 80) {
    return trimmed;
  }
  return `${trimmed.slice(0, 77)}...`;
}

function countMatches(text, regex) {
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

main();
