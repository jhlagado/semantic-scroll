# Template Authoring Conventions

This document defines **mandatory conventions** for authoring HTML templates in the blog system. It is derived from `docs/templating.md` and `docs/PRD.md`.

Templates are structural documents, not programs.
They must remain readable, predictable, and boring.

If a template violates these conventions, it is invalid by definition.

---

## 1. Purpose of Templates

Templates exist to:

* define page structure
* establish layout and navigation
* declare where query results appear
* provide fallback copy for empty states

Templates do **not** exist to:

* compute values
* conditionally render content
* inspect metadata
* transform article content
* behave like components

---

## 2. Template Scope

### 2.1 What a Template Controls

A template controls:

* document outline
* semantic HTML structure
* placement of rendered article content
* static UI elements (header, footer, nav)
* fallback messaging

### 2.2 What a Template Does Not Control

A template must never control:

* which articles are selected
* article ordering
* article visibility
* article metadata values
* rendering mode (full vs excerpt)

These are resolved **before** templating.

---

## 3. Valid Template Files

Templates must be:

* valid HTML5 documents
* parseable without JavaScript
* readable without preprocessing
* free of templating syntax

### 3.1 Required Structure (Page Templates)

Every page template must include:

```html
<!doctype html>
<html lang="en">
  <head>...</head>
  <body>...</body>
</html>
```

Fragment-only templates are not supported in MVP.

---

## 4. Use of `<template>` Render Slots

### 4.1 Required Pattern

All dynamic content insertion points **must** use `<template>`:

```html
<template data-query="query-name">
  <!-- fallback content -->
</template>
```

Rules:

* `data-query` is mandatory
* value must match a defined named query
* fallback content must be valid HTML
* `data-view` is optional and must be one of `article`, `summary`, or `summary-list`

Summary render modes are built-in and produce fixed HTML. Templates may only select a mode via `data-view` and may not attempt to re-create summary markup manually.

Use `summary-list` only when the template slot is inside a `<ul>` or `<ol>` container, since it renders list items.

---

### 4.2 Forbidden Patterns

Templates must not:

* use `<div data-query=…>`
* use custom attributes outside `<template>`
* contain multiple `data-query` attributes in one element
* nest `<template>` elements

Nested templates are explicitly forbidden to avoid ambiguity.

---

## 5. Fallback Content Conventions

Fallback content is rendered **only** when a query returns zero results.

Fallback content should:

* be human-readable
* explain the empty state
* not rely on CSS or JS to appear

Example:

```html
<template data-query="posts-by-tag">
  <p>No posts have been published under this tag yet.</p>
</template>
```

Fallback content must never:

* assume metadata values
* contain placeholders
* include logic comments

---

## 6. Semantic HTML Requirements

Templates must prioritize semantic elements over generic containers.

### 6.1 Strongly Preferred Elements

Use where appropriate:

* `<main>`
* `<nav>`
* `<header>`
* `<footer>`
* `<section>`
* `<article>`
* `<aside>`

Avoid excessive `<div>` usage.

---

### 6.2 Heading Discipline

Templates must:

* define the top-level document outline
* avoid injecting headings inside render slots
* not assume article heading structure

Articles define their own internal heading hierarchy.

---

## 7. Styling Boundaries

Templates may:

* include class names
* include layout-related structure
* reference global CSS files

Templates must not:

* encode visual semantics in class names (e.g. `post-title`)
* assume article markup structure
* style based on metadata-derived attributes

CSS must tolerate arbitrary article HTML.

---

## 8. Linking Conventions

Templates may include:

* navigation links
* archive links
* static internal links

Templates must not:

* generate links based on metadata
* assume slug formats
* construct URLs programmatically

All URLs used in templates must be:

* literal
* stable
* human-readable

---

## 9. Accessibility Requirements

Templates must:

* include `lang` attribute on `<html>`
* use semantic landmarks
* support keyboard navigation
* avoid focus traps
* avoid reliance on JavaScript for meaning

ARIA roles may be used **only** when native semantics are insufficient.

---

## 10. Interaction with Article Content

Templates must treat injected article HTML as:

* opaque
* complete
* self-describing

Templates must not:

* wrap individual articles in assumed containers
* add per-article chrome
* split or truncate article HTML
* reorder elements within article HTML

If a different presentation is desired, it must be authored in Markdown.

---

## 11. Multiple Render Slots

Templates may contain multiple render slots.

Rules:

* each slot must reference a named query
* slots are evaluated top-to-bottom
* slots must not overlap in intent
* identical queries may be reused deliberately

Example:

```html
<template data-query="latest-posts"></template>
<template data-query="posts-by-tag"></template>
```

---

## 12. Forbidden Constructs

Templates must never contain:

* inline JavaScript
* templating syntax of any kind
* conditional comments
* HTML comments intended as logic
* dynamic attributes
* server-side includes

If a template “feels like code”, it is wrong.

---

## 13. Validation Rules

### Hard errors

* unknown `data-query` value
* nested `<template>` elements
* missing `<main>` element
* invalid HTML structure
* duplicate output paths

### Warnings

* unused templates
* templates with no render slots
* templates with only fallback content

---

## 14. Design Intent

These conventions exist to ensure:

* templates remain readable in isolation
* AI agents cannot accidentally invent logic
* humans can understand output by inspection
* the system ages well

Templates should look like something Tim Berners-Lee would recognize, not something a framework generated.

---

## 15. Status

These conventions are **locked**.

Any template violating these rules is invalid, regardless of whether it “works”.
