Here is a **single, cohesive Markdown document** covering the **build pipeline end-to-end**, including **CI stages, validation rules, and the error / warning matrix**.
It is written to be dropped directly into your repo as something like:

```
docs/pipeline.md
```

Everything here is consistent with the decisions already locked.

---

# Build Pipeline and CI Specification

This document defines the **end-to-end build pipeline** for the blog system, including discovery, indexing, querying, rendering, asset handling, and deployment.

It also defines **CI validation rules**, including which conditions are **hard errors** versus **warnings**.

This pipeline is deliberately simple, deterministic, and inspectable.

---

## 1. Pipeline Goals

The pipeline exists to:

* convert Markdown articles into static HTML
* generate index pages via named queries
* validate structure and metadata rigorously
* deploy a reproducible site artifact

The pipeline must be:

* deterministic
* filesystem-driven
* free of hidden state
* runnable locally and in CI
* boring by design

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
blog/YYYY/MM/DD/NN/num-slug/
```

### 3.3 Discovery Process

For each directory under `blog/`:

* verify `YYYY/MM/DD/NN/num-slug` structure
* verify all numeric components are zero-padded
* verify `NN` matches numeric prefix of `num-slug`
* locate the article Markdown file (canonical name, e.g. `article.md`)

### 3.4 Discovery Outputs

* list of article directories
* derived path fields:

  * year
  * month
  * day
  * ordinal
  * slug
  * full relative path

---

## 4. Stage 2: Index Construction

### 4.1 Purpose

Build an **article index** used by queries.

### 4.2 Index Inputs

* derived path fields
* parsed frontmatter from article Markdown

### 4.3 Frontmatter Rules

* frontmatter is parsed but **not rendered**
* frontmatter values supplement derived fields
* derived fields are authoritative

### 4.4 Index Record Contents

Each article index record includes:

* path-derived fields
* frontmatter fields (status, tags, series)
* absolute source path to article directory
* path to Markdown file

Markdown body is **not read** at this stage.

---

## 5. Stage 3: Query Validation

### 5.1 Purpose

Ensure all named queries are valid **before execution**.

### 5.2 Validation Rules

For each query in `config/queries.json`:

* conforms to query schema
* contains required `source`
* contains no unknown keys
* applies ranges only to allowed fields
* uses valid `sort` values
* uses valid `limit` values

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

* execution must be stable
* ties must resolve deterministically (e.g. path lexical order)

### 6.4 Outputs

* map of `query-name → ordered article record list`

---

## 7. Stage 5: Template Rendering

### 7.1 Purpose

Generate HTML pages from templates and query results.

### 7.2 Template Inputs

Templates are valid HTML files containing one or more:

```html
<template data-query="query-name">
  fallback content
</template>
```

### 7.3 Rendering Semantics

For each `<template data-query="X">`:

* zero results → render fallback body
* one result → inject rendered Markdown once
* N results → inject rendered Markdown N times

### 7.4 Markdown Rendering

For each article record used:

* load Markdown body
* convert to HTML fragment
* inject fragment verbatim

Templates **never** access frontmatter or derived metadata.

---

## 8. Stage 6: Asset Copying

### 8.1 Purpose

Ensure all referenced assets are available in output.

### 8.2 Rules

For each article directory:

* copy `assets/` directory (if present)
* preserve relative paths
* output assets alongside rendered article HTML

Assets are never deduplicated or optimized automatically at this stage.

---

## 9. Stage 7: Output Validation

### 9.1 Purpose

Verify the generated output is internally consistent.

### 9.2 Checks

* no unresolved query references
* all referenced assets exist
* no duplicate output paths
* no missing HTML outputs for required templates

---

## 10. Stage 8: Deployment

### 10.1 Purpose

Publish the generated site artifact.

### 10.2 Deployment Model

* build output placed in a clean directory (e.g. `build/`)
* CI deploys output to `gh-pages` branch
* no manual edits to deployment branch

---

## 11. CI Error vs Warning Matrix

### 11.1 Hard Errors (Fail Build)

The build **must fail** if any of the following occur:

#### Filesystem & Structure

* invalid article path structure
* missing `NN` or `num-slug`
* ordinal mismatch between `NN` and slug
* missing article Markdown file

#### Frontmatter

* missing frontmatter
* missing or invalid `status`
* frontmatter defines derived fields

#### Queries

* invalid query schema
* unknown query keys
* invalid range definitions
* invalid sort values
* template references unknown query

#### Rendering

* failure to render Markdown
* duplicate output paths

---

### 11.2 Warnings (Non-Fatal)

The build **may warn** but continue if:

* query returns zero results
* article has no tags
* unused query definitions exist
* unused templates exist
* asset directory exists but is unused

Warnings must be visible in CI output.

---

## 12. Incrementality and Performance

Initial implementation may:

* rebuild the entire site on every run

Later optimizations may include:

* incremental builds
* cached index results
* partial template re-rendering

Correctness always takes priority over speed.

---

## 13. Design Invariants

This pipeline must remain:

* linear
* inspectable
* deterministic
* free of hidden state
* independent of UI tooling

If a change requires:

* dynamic runtime state
* template logic
* metadata rendering

…it violates this specification.

---

## 14. Status

This pipeline specification is **locked**.

Any deviation requires explicit architectural review.

