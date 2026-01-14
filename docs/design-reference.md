# Reference Implementation and Execution Guide

This document provides the **concrete, implementation-facing guidance** for the blog system, without committing to a specific language or framework. It is derived from `docs/PRD.md`, `docs/queries.md`, `docs/templating.md`, and `docs/ci-pipeline.md`.

It is strictly derived from the previously defined architecture and does not introduce new concepts.

---

## Part 1: Reference Build Pseudocode (Implementation-Neutral)

This is the **authoritative execution order**.
Any implementation that deviates from this order is incorrect.

### 1. Initialize

```
load content/<contentDir>/queries.json
load template files
initialize empty article index
initialize empty render plan
```

---

### 2. Discover Articles

```
for each directory under content/<contentDir>/ (default content/semantic-scroll/ in this repo):
  validate path matches YYYY/MM/DD/NN-slug
  validate zero-padded numeric components
  validate NN matches numeric prefix of NN-slug
  locate article markdown file
```

Hard fail on any violation.

---

### 3. Build Article Index

```
for each discovered article:
  parse frontmatter
  validate required frontmatter fields
  derive fields from path (year, month, day, ordinal, slug)
  store index record:
    - derived fields
    - frontmatter fields
    - path to markdown
    - path to assets/ (if present)
```

Markdown body is not rendered here.

---

### 4. Validate Queries

```
for each named query:
  validate against query schema
  reject unknown keys
  reject invalid ranges or sorts
```

Fail build if any query is invalid.

---

### 5. Execute Queries

```
for each query:
  filter article index
  apply equality filters
  apply range filters
  sort results deterministically
  apply limit
  store ordered list of article records
```

---

### 6. Render Templates

```
for each template:
  parse HTML
  locate <template data-query="X"> slots
  for each slot in document order:
    lookup query result list
    if list empty:
      replace slot with fallback HTML
    else:
      for each article in list:
        if data-view is summary or summary-list:
          render built-in summary block from frontmatter and derived fields
        else:
          render markdown to HTML fragment
        inject fragment
  emit final HTML document
```

Templates do not access metadata. Full article rendering uses Markdown bodies, while summary views are a built-in exception that renders frontmatter fields.

---

### 7. Copy Assets

```
for each rendered article:
  if assets/ exists:
    copy assets to output location
```

Paths must remain stable.

Only files in assets/ are treated as publishable media. The article root should contain `article.md` and nothing else.

---

### 8. Validate Output

```
ensure no unresolved slots
ensure no duplicate output paths
ensure all referenced assets exist
```

---

### 9. Deploy

```
write output to clean build directory
publish build directory as site artifact
```

---

## Part 2: Minimal Repository Layout

This layout is **canonical**.

```
/
├─ content/
│  └─ <instance>/
│     ├─ YYYY/MM/DD/NN-slug/
│     │  ├─ article.md
│     │  └─ assets/
│     ├─ templates/
│     │  ├─ article.html
│     │  ├─ summary-index.html
│     │  └─ about.html
│     ├─ queries.json
│     ├─ assets/
│     └─ site.json
│
├─ config/
│  └─ prose-lint.json
│
├─ scripts/
│  ├─ discover.*
│  ├─ index.*
│  ├─ query.*
│  ├─ render.*
│  ├─ assets.*
│
├─ docs/
│  ├─ queries.md
│  ├─ templating.md
│  ├─ articles-frontmatter.md
│  ├─ ci-pipeline.md
│  ├─ templating-conventions.md
│  ├─ templating-javascript.md
│
└─ build/
```

### Script Responsibility Rules

Each script must:

- do **one thing**
- accept explicit inputs
- produce explicit outputs
- have no hidden state

Scripts must not:

- inspect templates unless rendering
- render markdown unless explicitly a render step
- make assumptions outside specs

---

## Part 3: CI Wiring (Logical, Not YAML)

### CI Stages

1. **Checkout**
2. **Install runtime**
3. **Run pipeline scripts in order**
4. **Fail fast on hard errors**
5. **Publish build artifact**

---

### CI Failure Matrix

| Category  | Condition               | Result    |
| --------- | ----------------------- | --------- |
| Structure | Invalid blog path       | ❌ Fail   |
| Structure | Ordinal mismatch        | ❌ Fail   |
| Metadata  | Missing status          | ❌ Fail   |
| Queries   | Unknown key             | ❌ Fail   |
| Metadata  | Article has no tags     | ⚠ Warning |
| Templates | Unknown query           | ❌ Fail   |
| Templates | No slots                | ⚠ Warning |
| Assets    | Missing referenced file | ❌ Fail   |

Warnings must appear in CI logs but not fail the run.

---

## Part 4: First Concrete Example (End-to-End)

### Query (`content/<contentDir>/queries.json`)

```json
{
  "latest-posts": {
    "source": "blog",
    "status": "published",
    "sort": "date-desc",
    "limit": 5
  }
}
```

---

### Template (`content/<contentDir>/templates/summary-index.html`)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- meta:head -->
  </head>
  <body>
    <main>
      <div data-slot="page-heading"></div>
      <div data-slot="page-body"></div>
    </main>
  </body>
</html>
```

---

### Article (`content/<contentDir>/2026/01/08/01-first-post/article.md`)

```md
---
status: published
tags:
  - z80
---

# First Post

This is the body of the article.
```

---

### Output

```
build/
└─ index.html
```

Where `<main>` contains the rendered Markdown HTML for the article.

Metadata blocks were rendered above and below the body; head metadata is stamped from frontmatter and path data.
No logic lived in the template.
Everything was deterministic.

---

## Final Status

At this point you have:

- a locked content taxonomy
- a constrained query language
- a mechanical renderer
- strict template rules
- explicit CI behaviour
- a clear implementation path
