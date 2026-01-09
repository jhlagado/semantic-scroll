# Blog Architecture & Design Decisions

This document records the architectural and design decisions for the AI-assisted blog system.
It is derived from `docs/PRD.md` and is **normative**: if future work conflicts with this document, the future work is wrong unless this document is explicitly updated.

The system prioritizes clarity, durability, classic web principles, and strict separation of concerns.

---

## 1. Core Philosophy

- The system is **content-first**, not tool-first.
- AI agents are treated as **experts**, not junior developers.
- Tooling exists to standardize and automate, **not** to compensate for lack of skill.
- We favor **first-principles implementations** when the problem is simple and bounded.
- External dependencies are allowed **only** when they provide clear, non-trivial value.
- Default assumption is zero or near-zero operating cost; static hosting is preferred; paid services require explicit justification and long-term maintenance cost must be considered.
- Avoid frameworks, DSL sprawl, and Turing-complete template systems.

This is a deliberately _boring_, _legible_, _durable_ web system.

### 1.1 Self-Documenting Build

The first published content stream should document the construction of the system itself.

- Each architectural decision should be representable as a post.
- Spec documents should map cleanly to publishable narratives.

---

## 2. Canonical Repository Taxonomy

### 2.1 Blog Content Layout (Non-Negotiable)

The canonical structure is:

```
content/blog/YYYY/MM/DD/NN-slug/<files>
```

Where:

- `YYYY` = 4-digit year
- `MM` = 2-digit month, **leading zero required**
- `DD` = 2-digit day, **leading zero required**
- `NN-slug` = leaf directory with a 2-digit ordinal prefix followed by a human-readable slug

### 2.2 Article Example

```
content/blog/2026/01/08/01-first-post/
  article.md
  assets/
    diagram.png
```

### 2.3 Ordinal Rules

- `NN` determines ordering _within a day_.
- `NN` **must match** the numeric prefix of the `NN-slug` directory.
- This ordering is for filesystem sanity and human inspection.
- Authoritative ordering can always be reconstructed from metadata.

### 2.4 Canonical URL Ownership

Output URLs are owned by the filesystem layout and template mapping.

- slugs are durable identifiers
- changing a slug is a deliberate migration
- redirects, if required, must be explicitly authored

The system must never silently rewrite or infer redirects.

---

## 3. Article Structure

Each article directory contains:

- one primary Markdown file (canonical name to be standardized, e.g. `article.md`)
- optional `assets/` directory (images, code, PDFs, etc.)

Assets are **co-located** with articles to ensure portability and narrative locality.

---

## 4. Metadata vs Published Content

### 4.1 Frontmatter Metadata

Frontmatter exists **only** to support:

- discovery
- indexing
- querying
- build-time decisions
- summary rendering in built-in views

Templates do not access metadata. Full article rendering uses only Markdown bodies. Summary views are a built-in render mode that may use frontmatter fields.

### 4.2 Published Content Rule

If a field is visible on a full article page (date, tag, label, etc.):

- it **must exist in the Markdown body**
- even if it also exists in metadata

Summary and index views are a controlled exception: they may render frontmatter values using the built-in summary renderer.

---

## 5. Templates

### 5.1 Template Language

- Templates are written in **plain, valid HTML**
- No curly-brace syntax
- No embedded logic
- No access to metadata
- No conditionals or loops

Templates define **structure only**.

### 5.2 Use of `<template>`

- HTML `<template>` elements are used as **inert placeholders**
- They are legal anywhere in the document
- Their contents are not rendered by default

This is preferred over `<div>` because it is:

- semantically inert
- explicit in intent
- safe from accidental rendering

---

## 6. Query-Driven Rendering Model

### 6.1 Concept

Rendering is driven by **named queries**.

Templates do not decide _what_ to render.
Queries decide _what exists_.

Templates only decide _how it looks_.

### 6.2 Template–Query Link

Templates reference queries by name:

```html
<template data-query="latest-posts"></template>
```

Templates never embed query logic.

---

## 7. Query System

### 7.1 Storage Format

- Queries are stored as **JSON-compatible data structures** in the system configuration.
- Example location:

  ```
  config/queries.json
  ```

### 7.2 Example

```json
{
  "latest-posts": {
    "source": "blog",
    "status": "published",
    "sort": "date-desc",
    "limit": 10
  }
}
```

Templates only ever reference `"latest-posts"`.

---

## 8. Query Capabilities

### 8.1 Equality Matching

Allowed for:

- `status`
- `stream`
- `tag` (set membership)
- `year`
- `month`
- `day`

Exact match only.
AND semantics only.

Month and day values are normalized to integers before comparison. The filesystem uses zero-padded segments, but queries may use numeric values or zero-padded strings as long as they normalize to the same integer.

---

### 8.2 Numeric Ranges

Ranges are allowed **only** for numeric/date-like fields.

Range notation is **explicit objects**, not expressions:

```json
"day": { "from": 1, "to": 7 }
"ordinal": { "from": 1, "to": 3 }
```

Rules:

- inclusive
- both endpoints required
- no open-ended ranges
- no `<`, `>`, `<=`, `>=`

---

### 8.3 Sorting

Allowed values only:

- `date-asc`
- `date-desc`
- `ordinal-asc`
- `ordinal-desc`

One sort key only.

---

### 8.4 Limiting

```json
"limit": 10
```

- hard truncation
- no offset
- no pagination

---

## 9. Forbidden Query Features

Queries must **never** support:

- boolean logic
- OR conditions
- nested expressions
- functions
- computed fields
- template inspection
- markdown body access
- filesystem-order dependence

If a requirement cannot be expressed, a **new query** or **new index page** is required.

---

## 10. Query Evaluation Order

Queries are evaluated in a fixed, mechanical pipeline:

1. filesystem discovery
2. metadata read
3. filtering
4. sorting
5. limiting

Markdown bodies are read **only after** query resolution.

---

## 11. Rendering Semantics

For a given `<template data-query="X">`:

- zero results → render template body as fallback message
- one result → replace template body once
- N results → repeat template body N times, in order

Injected content is **HTML converted from Markdown**.

---

## 12. Toolchain Policy

- Prefer custom scripts over frameworks
- Avoid ESLint, TypeScript, heavy build systems
- AI performs code hygiene
- Dependencies allowed only for:

  - non-trivial correctness
  - non-trivial optimization (e.g. minification)

Core pipeline must remain inspectable and boring.

---

## 13. Relationship to Existing Systems

This system is **not** Eleventy, Hugo, Jekyll, or React:

- metadata is not used in templates
- templates are not programming languages
- queries are centralized and named
- rendering is document stamping, not component evaluation

This is closer to:

- classic publishing pipelines
- relational views
- static document assembly

---

## 14. Design Invariants

These must never erode:

- templates stay dumb
- queries stay declarative
- metadata never leaks into full article presentation; summary views are a controlled exception
- folder taxonomy remains stable
- filesystem order always makes sense to a human, but traversal order has no semantic meaning

If behavior matters, it must be specified explicitly. No smart defaults or silent guessing.

---

## 15. Forward References

The system permits forward references during authoring.

- Queries may reference tags, stream names, or dates that do not yet exist.
- Templates may reference queries that currently resolve to zero results.

These conditions must produce warnings, not build failures. Forward references become active automatically once matching content exists.

---

## 16. Status

All decisions in this document are **locked** unless explicitly revised.

Future work must conform to this design, not reinterpret it.
