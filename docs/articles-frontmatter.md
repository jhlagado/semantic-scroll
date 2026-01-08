# Frontmatter and Metadata Specification

This document defines how frontmatter metadata is used in the blog system.

Frontmatter exists **only** to support discovery, indexing, and querying.
It is **never** used directly for rendering HTML.

If a value appears in rendered output, it must exist explicitly in the Markdown body.

---

## 1. Purpose of Frontmatter

Frontmatter is used exclusively for:

* filesystem discovery
* query evaluation
* index construction
* build-time validation

Frontmatter must **not**:

* influence templates
* inject values into HTML
* replace visible content

Rendered pages are self-contained documents.

---

## 2. Required Frontmatter Fields

Every article Markdown file must include:

```yaml
status: published
```

### Allowed values

* `draft`
* `review`
* `published`
* `archived`

Any other value is invalid and must fail the build.

### 2.1 Author-Only Versioning

The system does not expose revision history, edit timestamps, or version metadata to readers by default.

* Git history is the sole source of historical truth.
* Public HTML output represents the current authored state only.
* No "last updated" badges, revision diffs, or edit timelines are generated unless explicitly authored as content.

Status changes (`draft`, `review`, `published`, `archived`) are reversible and tracked only via version control.

### 2.2 Status Visibility Contract

Article `status` affects indexing and selection only, not rendering semantics.

* `published` articles may appear in query results.
* `draft`, `review`, and `archived` articles must never appear in rendered output unless a query explicitly selects them.
* Templates do not and cannot detect article status.

Visibility is determined solely by query definitions, not template logic.

---

## 3. Optional Frontmatter Fields

### 3.1 Tags

```yaml
tags:
  - z80
  - retrocomputing
```

Rules:

* tags are case-normalized
* hyphens and underscores are normalized
* treated as a set (no duplicates)
* order is not significant

Tags are used **only** for querying and indexing.

---

### 3.2 Series

```yaml
series: build-log
```

Rules:

* optional
* single value only
* exact match semantics

---

## 4. Derived Fields (From Filesystem Path)

From the canonical article path:

```
blog/YYYY/MM/DD/NN/num-slug/
```

The build system derives the following fields automatically:

* `year`
* `month`
* `day`
* `ordinal` (from `NN`)
* `slug` (from `num-slug`, numeric prefix removed)
* `path` (full relative path)

### Rules

* Derived fields must **not** appear in frontmatter
* Frontmatter values must never override derived values
* Filesystem structure is authoritative

---

## 5. Rendering Rule (Hard Constraint)

Frontmatter is **not visible** to templates.

If the rendered page needs to show:

* a date
* a tag
* a series label
* any other metadata

…it must be written explicitly in the Markdown body.

Frontmatter duplication is allowed and expected when values must be visible.

---

## 6. Validation Rules

### Build must fail if:

* frontmatter is missing
* `status` is missing or invalid
* `tags` is malformed
* frontmatter attempts to define derived fields

### Build may warn (non-fatal):

* unused metadata
* articles without tags
* inconsistent tag usage across posts

---

## 7. Design Intent

Frontmatter is an **index**, not a document.

* Metadata enables selection.
* Markdown defines meaning.
* Templates define structure.

These responsibilities must remain strictly separate.
