# Frontmatter and Metadata Specification

This document defines how frontmatter metadata is used in the blog system. It is derived from `docs/PRD.md` and aligned with `docs/queries.md`.

Frontmatter exists **only** to support discovery, indexing, and querying.
It is **never** used directly for rendering HTML.

If a value appears in rendered output, it must exist explicitly in the Markdown body.

---

## 1. Purpose of Frontmatter

Frontmatter is used exclusively for:

- filesystem discovery
- query evaluation
- index construction
- build-time validation

Frontmatter must **not**:

- influence templates
- inject values into HTML
- replace visible content

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

The frontmatter title is used only by summary renderers and never injected into full article pages.

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

Tags are used **only** for querying and indexing.

---

Tags also serve as the raw material for streams. The system nominates certain tags as streams via the collections registry, so articles never declare a stream field in frontmatter.

---

### 3.3 Summary

```yaml
summary: Short, factual description of the article.
```

Rules:

- optional
- short and descriptive, not promotional
- used for summary and index views or external feeds, not full article rendering
- supports a minimal inline Markdown subset: bold, italic, and inline links only

Other Markdown constructs and inline HTML are not supported in title or summary fields.

If a summary needs to be visible, it must also be written in the Markdown body.

---

### 3.5 Thumbnail

```yaml
thumbnail: assets/thumbnail.jpg
```

Rules:

- optional
- relative path within the article directory
- used for indexing or external feeds, not rendering

If a thumbnail needs to be visible, it must also be authored in the Markdown body.

---

## 4. Derived Fields (From Filesystem Path)

From the canonical article path:

```
content/blog/YYYY/MM/DD/NN-slug/
```

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

## 5. Rendering Rule: The Mirroring Requirement

Frontmatter is **not visible** to templates and is **never** used for rendering.

If a value needs to be visible on the page:

- a title
- a date (e.g., "January 9, 2026")
- a tag list
  - a stream label (rendered as a promoted tag in the collections registry)

…it **must** be written explicitly in the Markdown body. Frontmatter is an index for machines; Markdown is the document for humans.

Frontmatter duplication is allowed and expected when values must be visible.

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
