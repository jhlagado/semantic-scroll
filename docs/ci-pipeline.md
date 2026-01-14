# Build Pipeline and CI Specification

This document defines the **end-to-end build pipeline** for the blog system, including discovery, indexing, querying, rendering, asset handling, and deployment. It is derived from `docs/PRD.md` and aligned with `docs/queries.md` and `docs/templating.md`.

It also defines **CI validation rules**, including which conditions are **hard errors** versus **warnings**.

This pipeline is deliberately simple, deterministic, and inspectable.

---

## 1. Pipeline Goals

The pipeline exists to:

- convert Markdown articles into static HTML
- generate index pages via named queries
- validate structure and metadata rigorously
- deploy a reproducible site artifact

The pipeline must be:

- deterministic
- filesystem-driven
- free of hidden state
- runnable locally and in CI
- boring by design

Prose linting is treated as editorial feedback, not a hard gate. CI builds should succeed even when the lint report contains issues. The report is still generated for visibility, but it does not block publication.

Local development may run with `SOFT_FAIL=1`, which downgrades hard errors in discovery and frontmatter validation to warnings and skips invalid entries so previews stay usable. CI and release builds must run without `SOFT_FAIL` so the hard-error matrix remains authoritative.

---

## 2. High-Level Pipeline Stages

The pipeline executes in the following **strict order**:

1. Discovery
2. Index construction
3. Query validation
4. Query execution
5. Template rendering
6. Asset copying
7. Output validation
8. Deployment

Each stage consumes the output of the previous stage only.

---

## 3. Stage 1: Discovery

### 3.1 Purpose

Discover all article directories and validate their filesystem structure.

### 3.2 Canonical Article Path

Articles must exist at:

```
content/<contentDir>/YYYY/MM/DD/NN-slug/
```

`contentDir` defaults to `semantic-scroll`. If `site-config.json` sets `contentDir`, the same structure applies inside that instance directory.

### 3.3 Configuration and Instance Overrides

The build optionally reads `site-config.json` at the repo root.
If present, it may override site metadata and set `contentDir`, which selects the instance directory under `content/`.
If the file is missing, defaults apply and the active instance is `content/semantic-scroll/` in this repo. Instance metadata and head tags are owned by `content/<contentDir>/site.json`.

Instance resources are resolved from the active instance only:

- Templates: `content/<contentDir>/templates/`
- Assets: `content/<contentDir>/assets/`
- Queries: `content/<contentDir>/queries.json`

### 3.4 Discovery Process

For each directory under `content/<contentDir>/` (default `content/semantic-scroll/` in this repo):

- verify `YYYY/MM/DD/NN-slug` structure
- verify all numeric components are zero-padded
- verify `NN` matches numeric prefix of `NN-slug`
- locate the single canonical article Markdown file (canonical name, e.g. `article.md`)
- fail if the article Markdown file is missing or ambiguous

### 3.5 Discovery Outputs

- list of article directories
- derived path fields:

  - year
  - month
  - day
  - ordinal
  - slug
  - full relative path

---

## 4. Stage 2: Index Construction

### 4.1 Purpose

Build an **article index** used by queries.

### 4.2 Index Inputs

- derived path fields
- parsed frontmatter from article Markdown

### 4.3 Frontmatter Rules

- frontmatter is parsed but **not rendered**
- frontmatter values supplement derived fields
- derived fields are authoritative

### 4.4 Index Record Contents

Each article index record includes:

- path-derived fields
- frontmatter fields (status, title, tags, summary, thumbnail)
- absolute source path to article directory
- path to Markdown file

Markdown body is **not read** at this stage.

---

## 5. Stage 3: Query Validation

### 5.1 Purpose

Ensure all named queries are valid **before execution**.

### 5.2 Validation Rules

For each query in `content/<contentDir>/queries.json`:

- conforms to query schema
- contains required `source`
- contains no unknown keys
- applies ranges only to allowed fields
- uses valid `sort` values
- uses valid `limit` values

Validation failures here **halt the build**.

---

## 6. Stage 4: Query Execution

### 6.1 Purpose

Resolve each named query into an ordered list of article records.

### 6.2 Execution Steps

For each query:

1. filter index records by equality filters
2. apply numeric range filters
3. sort results
4. apply limit (if present)

### 6.3 Determinism

- execution must be stable
- ties must resolve deterministically (e.g. path lexical order)

### 6.4 Outputs

- map of `query-name → ordered article record list`

### 6.5 Status Visibility Contract

Article `status` affects indexing and selection only, not rendering semantics.

- `published` articles may appear in query results.
- `draft`, `review`, and `archived` articles must never appear in rendered output unless a query explicitly selects them.
- Templates do not and cannot detect article status.

Visibility is determined solely by query definitions, not template logic.

---

## 7. Stage 5: Template Rendering

### 7.1 Purpose

Generate HTML pages from templates and query results.

### 7.2 Template Inputs

Templates are valid HTML files containing one or more:

```html
<template data-query="query-name" data-view="summary-list">
  fallback content
</template>
```

### 7.3 Rendering Semantics

For each `<template data-query="X">`:

- zero results → render fallback body
- one result → inject output once based on render mode
- N results → inject output N times based on render mode

### 7.4 Markdown Rendering

Render mode determines output:

- `article` renders the Markdown body to HTML
- `summary` and `summary-list` render a built-in summary block using frontmatter and derived fields

Templates **never** access frontmatter or derived metadata directly.

### 7.5 Index Pages as First-Class Artifacts

Index pages (home, tag pages, series pages, day/month/year archives) are first-class rendered outputs, not derived views.

- each index page is rendered from an explicit template
- each index page has a stable output path
- no index page is generated implicitly

If an index page exists, it exists because a template explicitly rendered it.

### 7.6 Series Indexing

Series are declared in frontmatter as a single value. During rendering, the build groups published articles by `series` to generate series index pages, and it sorts those entries chronologically. Tag pages remain a separate, topical index sorted by recency.

---

## 8. Stage 6: Asset Copying

### 8.1 Purpose

Ensure all referenced assets are available in output.

### 8.2 Rules

For each article directory:

- copy `assets/` directory (if present)
- preserve relative paths
- output assets alongside rendered article HTML

Only files inside `assets/` are treated as publishable assets. The article root should contain `article.md` and nothing else.

Assets are never deduplicated or optimised automatically at this stage.

---

## 9. Stage 7: Output Validation

### 9.1 Purpose

Verify the generated output is internally consistent.

### 9.2 Checks

- no unresolved query references
- all referenced assets exist
- no duplicate output paths
- no missing HTML outputs for required templates
- no `<template>` elements remain in output HTML

### 9.3 Canonical URL Ownership

Output URLs are owned by the filesystem layout and template mapping.

- slugs are durable identifiers
- changing a slug is a deliberate migration
- redirects, if required, must be explicitly authored

The system must never silently rewrite or infer redirects.

---

## 10. Stage 8: Deployment

### 10.1 Purpose

Publish the generated site artifact.

### 10.2 Deployment Model

- build output placed in a clean directory (e.g. `build/`)
- CI deploys output to `gh-pages` branch
- no manual edits to deployment branch

---

## 11. CI Error vs Warning Matrix

### 11.1 Hard Errors (Fail Build)

The build **must fail** if any of the following occur:

#### Filesystem & Structure

- invalid article path structure
- missing `NN-slug`
- ordinal mismatch between `NN` and `NN-slug`
- missing article Markdown file
- multiple or ambiguous article Markdown files

#### Frontmatter

- missing frontmatter
- missing or invalid `status`
- frontmatter defines derived fields

#### Queries

- invalid query schema
- unknown query keys
- invalid range definitions
- invalid sort values
- template references unknown query

#### Rendering

- failure to render Markdown
- duplicate output paths
- unknown `data-view` value in templates
- summary view rendered without a frontmatter `title`

---

### 11.2 Warnings (Non-Fatal)

The build **may warn** but continue if:

Forward references are allowed; queries or templates that target not-yet-existing content should warn but not fail.

- query returns zero results
- query references tags or dates that do not yet exist
- article has no tags
- unused query definitions exist
- unused templates exist
- asset directory exists but is unused

Warnings must be visible in CI output.

---

## 12. Incrementality and Performance

Initial implementation may:

- rebuild the entire site on every run

Later optimizations may include:

- incremental builds
- cached index results
- partial template re-rendering

Correctness always takes priority over speed.

---

## 13. Design Invariants

This pipeline must remain:

- linear
- inspectable
- deterministic
- free of hidden state
- independent of UI tooling

If a change requires:

- dynamic runtime state
- template logic
- metadata rendering

…it violates this specification.

---

## 14. Status

This pipeline specification is **locked**.

Any deviation requires explicit architectural review.
