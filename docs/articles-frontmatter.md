# Frontmatter and Metadata Specification

This document defines how frontmatter metadata is used in the blog system. It is derived from `docs/PRD.md` and aligned with `docs/queries.md`.

Frontmatter exists to support discovery, indexing, querying, and fixed metadata blocks that surround full article bodies. It is not used to render the article body itself.

If a value should appear inside the body prose, it must be authored directly in the Markdown body.

---

## 1. Purpose of Frontmatter

Frontmatter is used for:

- filesystem discovery
- query evaluation
- index construction
- build-time validation
- summary views
- article metadata blocks

Frontmatter must **not**:

- influence templates
- replace or rewrite the Markdown body

Rendered pages are self-contained documents.

---

## 2. Required Frontmatter Fields

Every article Markdown file must include:

```yaml
status: published
```

### Allowed values

- `draft`
- `review`
- `published`
- `archived`

Any other value is invalid and must fail the build.

### 2.1 Author-Only Versioning

The system does not expose revision history, edit timestamps, or version metadata to readers by default.

- Git history is the sole source of historical truth.
- Public HTML output represents the current authored state only.
- No "last updated" badges, revision diffs, or edit timelines are generated unless explicitly authored as content.

Status changes (`draft`, `review`, `published`, `archived`) are reversible and tracked only via version control.

### 2.2 Status Visibility Contract

Article `status` affects indexing and selection only, not rendering semantics.

- `published` articles may appear in query results.
- `draft`, `review`, and `archived` articles must never appear in rendered output unless a query explicitly selects them.
- Templates do not and cannot detect article status.

Visibility is determined solely by query definitions, not template logic.

---

## 3. Optional Frontmatter Fields

### 3.1 Title

```yaml
title: "Readable title for summary and index views."
```

Rules:

- optional, but required for any article that appears in summary or index views
- may differ from the Markdown body title
- supports a minimal inline Markdown subset (see Summary)

The frontmatter title is used by summary renderers and for head metadata (the `<title>` tag and social meta). It is never injected into the article body.

---

### 3.2 Tags

```yaml
tags:
  - z80
  - retrocomputing
```

Rules:

- tags are case-normalized
- hyphens and underscores are normalized
- treated as a set (no duplicates)
- order is not significant

Tags are used for querying, index pages, summary views, and article metadata blocks.

---

### 3.3 Series

```yaml
series: build-log
```

Rules:

- optional
- single value only
- exact match semantics

Series are narrative groupings where order matters. They are author-declared and sorted chronologically. Series are used for querying, index pages, summary views, and article metadata blocks.

---

### 3.4 Summary

```yaml
summary: Short, factual description of the article. It stays plain and direct.
```

Rules:

- optional
- short and descriptive, not promotional
- at least two sentences
- used for summary and index views or external feeds, not full article rendering
- supports a minimal inline Markdown subset: bold, italic, and inline links only

Other Markdown constructs and inline HTML are not supported in title or summary fields.

If a summary needs to be visible in the body, it must also be written in the Markdown body.

---

### 3.5 Thumbnail

```yaml
thumbnail: assets/thumbnail.jpg
```

Rules:

- optional
- path relative to the article directory
- resolved to an absolute URL at build time
- must point inside the article's `assets/` subfolder
- used for indexing or external feeds, not rendering

If a thumbnail needs to be visible in the body, it must also be authored in the Markdown body.

---

## 4. Derived Fields (From Filesystem Path)

From the canonical article path:

```
content/<contentDir>/YYYY/MM/DD/NN-slug/
```

`contentDir` defaults to `example` in this repo. If `site-config.json` sets `contentDir`, the same structure applies inside that instance directory.

Derived fields:

- `year`, `month`, `day` (from directory structure)
- `ordinal` (from the `NN` prefix of the leaf directory)
- `slug` (the slug portion of the leaf directory, with the `NN-` prefix removed)

### Rules

- **Filesystem Authority**: The folder path defines the creation date and permanent URL.
- **Modified Articles**: When an article is updated, it **must** remain in its original folder hierarchy. Its chronological relationship is defined by its creation location, not its modification time.
- **No Redundancy**: Derived fields must **not** appear in frontmatter.
- **Ignores and Overrides**: Any `date` fields found in frontmatter are ignored to prevent metadata drift.

---

## 5. Rendering Rule: Body vs Metadata Blocks

Frontmatter is not visible to templates except through fixed render modes for summary views and article metadata blocks.

On full article pages, the build renders a metadata header and footer around the Markdown body. These blocks expose the date, series, and tags without forcing them into the body text. If an author wants those values repeated in the prose, they can still write them explicitly, but duplication is no longer required.

The Markdown body remains the sole source of visible article prose, headings, and bylines.

---

## 6. Validation Rules

### Build must fail if:

- frontmatter is missing
- `status` is missing or invalid
- `tags` is malformed
- frontmatter attempts to define derived fields
- a summary view is rendered without a frontmatter `title`

### Build may warn (non-fatal):

- unused metadata
- articles without tags
- inconsistent tag usage across posts

---

## 7. Design Intent

Frontmatter is an **index**, not a document.

- Metadata enables selection.
- Markdown defines meaning.
- Templates define structure.

These responsibilities must remain strictly separate.
