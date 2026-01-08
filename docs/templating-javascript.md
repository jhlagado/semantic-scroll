Here is **(3) the Progressive Enhancement & JavaScript Boundary Specification**, written as a **fully normative Markdown document** you can paste directly into:

```
docs/progressive-enhancement.md
```

This locks down *exactly* what JavaScript may and may not do, so the system cannot slowly drift into an application framework.

---

# Progressive Enhancement and JavaScript Boundary Specification

This document defines the **strict boundaries** for JavaScript usage in the blog system.

JavaScript is **optional**, **non-authoritative**, and **additive only**.
The site must remain fully readable, navigable, and meaningful with JavaScript disabled.

This specification exists to prevent gradual erosion of classic web guarantees.

---

## 1. Core Principle

**JavaScript must never be required for correctness.**

The canonical source of truth is:

* filesystem structure
* Markdown content
* HTML generated at build time

JavaScript may only enhance *experience*, never *meaning*.

---

## 2. Baseline Guarantees (No JavaScript)

With JavaScript disabled:

* all pages load via normal HTTP navigation
* all content is visible
* all links work
* all indexes are accessible
* all articles are readable
* all URLs are stable and human-readable

If any of the above fail, the system is broken by definition.

---

## 3. What JavaScript Is Allowed to Do

JavaScript may be used **only** for the following classes of behavior.

### 3.1 Navigation Enhancement

Allowed:

* intercept internal link clicks
* perform same-origin fetch of pre-rendered HTML
* swap `<main>` or equivalent content region
* update browser history via `pushState`

Constraints:

* full page navigation must remain the fallback
* no URL rewriting beyond history state
* no hidden routing logic
* no client-side rendering of Markdown

Purpose:

* reduce page load flicker
* preserve scroll position
* provide smoother transitions

---

### 3.2 Cosmetic Enhancements

Allowed:

* theme switching (light/dark)
* font size adjustments
* motion reduction
* class toggling for UI state

Constraints:

* must default to system preferences
* must persist via local storage or cookies only
* must not affect content semantics

---

### 3.3 Optional Client-Side Search

Allowed:

* client-side search over a pre-built index
* JSON index generated at build time
* full-text or keyword-based filtering

Constraints:

* search must be optional
* site remains usable without it
* no server dependency
* no content fetched dynamically from APIs

---

### 3.4 Minor Interaction Enhancements

Allowed:

* collapsible sections
* table-of-contents highlighting
* scroll-to-top helpers
* copy-to-clipboard buttons

Constraints:

* content must be visible by default
* interaction must be reversible
* no state required for comprehension

---

## 4. What JavaScript Is Explicitly Forbidden to Do

JavaScript must **never**:

* render Markdown
* execute queries
* select articles
* filter content
* access frontmatter
* change content order
* generate HTML structure
* decide what content exists
* fetch unpublished content
* substitute for templates

If JavaScript is involved in *deciding what appears*, the boundary has been crossed.

---

## 5. Relationship to Templates

Templates are rendered **entirely at build time**.

JavaScript must not:

* inspect `<template>` elements
* populate render slots
* repeat or stamp content
* read `data-query` attributes

All `<template>` processing occurs at build time only.

At runtime, `<template>` elements must not exist in output HTML.

---

## 6. Relationship to Queries

Queries are evaluated **once, at build time**.

JavaScript must not:

* reference query names
* know query semantics
* re-run or approximate queries
* perform filtering equivalent to queries

The browser is not a query engine.

---

## 7. Progressive Enhancement Contract

Every JavaScript feature must obey this contract:

> If JavaScript fails to load, errors, or is disabled, the user must still be able to read, navigate, and understand the site.

This applies to:

* navigation
* archives
* tags
* stream
* articles
* assets

---

## 8. Loading Strategy

JavaScript must be:

* loaded at the end of the document or deferred
* bundled minimally
* free of framework bootstraps
* versioned alongside the site

No JavaScript may block initial render.

---

## 9. Performance Constraints

JavaScript must:

* be small
* be readable
* be optional
* avoid long-running tasks
* avoid layout thrashing

Target:

* zero JavaScript required for first contentful paint
* enhancement only after DOM is ready

---

## 10. Failure Modes

JavaScript failures must be:

* silent or gracefully degraded
* non-destructive
* non-blocking

A JavaScript exception must never blank the page or hide content.

---

## 11. Validation Rules

### Hard failures (build-time)

* JavaScript attempts to access frontmatter
* JavaScript manipulates content selection
* JavaScript depends on query logic

### Runtime expectations

* page remains readable with JS disabled
* links still work
* content order unchanged

---

## 12. Design Intent

This boundary exists to prevent the site from becoming:

* a client-side app
* a hidden SPA
* a framework-dependent system
* a runtime-rendered document

The goal is:

> **HTML first, CSS for readability, JavaScript only for comfort.**

---

## 13. Status

This specification is **locked**.

Any JavaScript feature that violates this boundary is invalid, regardless of convenience.

---

If you want to continue, the remaining clean steps are:

1. template authoring conventions
2. reference build pseudocode
3. minimal script layout and responsibilities

Say the number.
