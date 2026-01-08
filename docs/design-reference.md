Alright — below is **all four**, written as **normative, copy-pasteable Markdown**, with no fluff and no contradictions to the specs you’ve already locked.

I’ve kept each section clearly separated so you can either keep this as **one master doc** or split it later.

---

# Reference Implementation and Execution Guide

This document provides the **concrete, implementation-facing guidance** for the blog system, without committing to a specific language or framework.

It is strictly derived from the previously defined architecture and does not introduce new concepts.

---

## Part 1: Reference Build Pseudocode (Implementation-Neutral)

This is the **authoritative execution order**.
Any implementation that deviates from this order is incorrect.

### 1. Initialize

```
load config/queries.json
load template files
initialize empty article index
initialize empty render plan
```

---

### 2. Discover Articles

```
for each directory under blog/:
  validate path matches YYYY/MM/DD/NN/num-slug
  validate zero-padded numeric components
  validate NN matches numeric prefix of num-slug
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
    - path to assets
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
        render markdown to HTML fragment
        inject fragment
  emit final HTML document
```

No metadata access at render time. Visible metadata (title, date, etc.) must be authored directly in the Markdown body.

---

### 7. Copy Assets

```
for each rendered article:
  if assets/ exists:
    copy assets to output location
```

Paths must remain stable.

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
├─ blog/
│  └─ YYYY/MM/DD/NN/num-slug/
│     ├─ article.md
│     └─ assets/
│
├─ templates/
│  ├─ home.html
│  ├─ day.html
│  ├─ tag.html
│
├─ config/
│  └─ queries.json
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
│  ├─ frontmatter.md
│  ├─ pipeline.md
│  ├─ template-authoring.md
│
└─ build/
```

### Script Responsibility Rules

Each script must:

* do **one thing**
* accept explicit inputs
* produce explicit outputs
* have no hidden state

Scripts must not:

* inspect templates unless rendering
* render markdown unless explicitly a render step
* make assumptions outside specs

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
| Structure | Invalid blog path       | ❌ Fail    |
| Structure | Ordinal mismatch        | ❌ Fail    |
| Metadata  | Missing status          | ❌ Fail    |
| Queries   | Unknown key             | ❌ Fail    |
| Metadata  | Missing stream          | ⚠ Warning |
| Templates | Unknown query           | ❌ Fail    |
| Templates | No slots                | ⚠ Warning |
| Assets    | Missing referenced file | ❌ Fail    |

Warnings must appear in CI logs but not fail the run.

---

## Part 4: First Concrete Example (End-to-End)

### Query (`config/queries.json`)

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

### Template (`templates/home.html`)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Home</title>
</head>
<body>
  <main>
    <h1>Recent Posts</h1>

    <template data-query="latest-posts">
      <p>No posts yet.</p>
    </template>
  </main>
</body>
</html>
```

---

### Article (`blog/2026/01/08/01/01-first-post/article.md`)

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

No metadata was rendered.
No logic lived in the template.
Everything was deterministic.

---

## Final Status

At this point you have:

* a locked content taxonomy
* a constrained query language
* a mechanical renderer
* strict template rules
* explicit CI behavior
* a clear implementation path

