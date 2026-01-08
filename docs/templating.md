Below is a **fully expanded, deeply detailed, single Markdown specification** that *extends* what you wrote without contradicting it.
This is intended to be **final-form**, normative, and implementation-guiding rather than aspirational.

You can drop this in as something like:

```
docs/templating.md
```

I have kept your structure and expanded **within it**, adding new subsections where needed rather than rewriting your intent.

---

# Templating and Rendering Specification

This section is **normative**. It defines how named queries select articles, how templates consume query results, and how Markdown becomes HTML inside templates.

The intent is to:

* keep templates **pure HTML**
* keep queries as the **only selection language**
* keep rendering **mechanical, deterministic, and inspectable**

This specification is written to match the canonical content architecture:

```
blog/YYYY/MM/DD/NN/num-slug/<files>
```

Any deviation from this specification is an architectural change and must be deliberate.

---

## 1. Concepts and Roles

This system deliberately separates concerns that are often entangled in other static site generators.

### 1.1 Article Record

An **article record** is a build-time data structure representing exactly one article directory.

It is derived from:

* the folder path (date and per-day ordinal)
* the article frontmatter (for indexing and querying only)
* the article Markdown body (for rendering only)

An article record is *not* a rendered document. It is an intermediate representation.

#### Important separation rule

* Frontmatter drives **discovery, indexing, and query selection**
* Markdown body drives **what appears in rendered HTML**

At no point may frontmatter values be injected directly into templates.

---

### 1.2 Named Query

A **named query** is a declarative selector that returns an ordered list of article records.

Properties:

* stored centrally (for example `config/queries.json`)
* referenced **only by name** from templates
* defined using a restricted JSON schema
* evaluated entirely at build time
* returns **zero, one, or many** article records

Queries do not know:

* which templates use them
* how results are rendered
* whether results are rendered at all

---

### 1.3 Template

A **template** is a valid HTML document (or fragment) that declares one or more *render slots*.

Templates:

* are plain, standards-compliant HTML
* may include static copy, layout, navigation, and fallback text
* **must not contain logic**
* **must not read frontmatter or derived metadata**
* declare only *where* query results are inserted

Templates are intentionally “dumb”. All intelligence lives outside them.

---

## 2. Template Structure

### 2.1 Page Templates vs Fragment Templates

A template file may be either:

* **Page template**
  Produces a complete HTML document, including `<!doctype>`, `<html>`, `<head>`, and `<body>`.

* **Fragment template**
  Produces a partial document intended for inclusion elsewhere.

#### MVP constraint

To reduce complexity:

* only **page templates** are supported initially
* every template is rendered independently to an output HTML file
* fragment composition may be introduced later as a strictly additive feature

---

### 2.2 Render Slots Using `<template>`

A render slot is declared using the standard HTML `<template>` element.

Example:

```html
<template data-query="latest-posts">
  <p class="empty">No posts yet.</p>
</template>
```

Rules:

* `<template>` is valid anywhere in HTML and is inert by default
* `data-query` names the query to execute
* the **inner HTML** of the `<template>` element is the **fallback content**
* fallback content is rendered **only** when the query returns zero results

The `<template>` element is chosen deliberately because it is:

* semantically inert
* non-rendering by default
* explicit in intent
* standard HTML, not a DSL

---

## 3. Query Result Semantics in Templates

Each `<template data-query="X">` slot is processed independently.

### 3.1 Zero Results

If query `X` returns zero article records:

* the `<template>`’s inner HTML is rendered verbatim
* no Markdown rendering occurs
* no empty wrappers are injected

This allows authors to write friendly empty-state messaging directly in HTML.

---

### 3.2 One Result

If query `X` returns exactly one article record:

* fallback content is ignored
* the article’s Markdown body is rendered to HTML
* the resulting HTML fragment is inserted at the slot location

---

### 3.3 Multiple Results

If query `X` returns N article records:

* fallback content is ignored
* the stamping process is repeated N times
* rendered fragments are injected sequentially

---

### 3.4 Ordering Guarantee

The order of rendered results is **entirely defined by the query**.

Rules:

* sorting must be explicitly specified in the query
* no implicit filesystem ordering is permitted
* ties must be broken deterministically

Recommended tie-breaker:

* full article path, compared lexically

This guarantees stable output across runs.

---

## 4. Stamping: Definition and Constraints

### 4.1 What “Stamping” Means

Stamping is the process of:

1. selecting an article record
2. rendering its Markdown body to HTML
3. inserting the resulting fragment into the template output

Stamping must be:

* mechanical
* side-effect free
* repeatable
* independent of surrounding HTML

Templates never mutate content; they only receive it.

---

### 4.2 Why Stamping Is Not “Templating Logic”

Stamping is **not**:

* variable interpolation
* conditional rendering
* looping constructs
* component evaluation

It is closer to:

* document assembly
* static publishing
* print layout

This distinction is critical to avoiding DSL creep.

---

## 5. Stamping Mode A (MVP): Content Replacement

### 5.1 Definition

In Mode A, a render slot is simply a placeholder for the **entire rendered Markdown body** of each matched article.

Process:

* load article Markdown
* convert to HTML fragment
* inject fragment as-is at slot position
* repeat for each record

No wrapper is imposed by the template.

---

### 5.2 Implications for Authors

If an author wants any of the following to appear on the page:

* title
* date
* tags
* headings
* section structure

They must be written **explicitly in the Markdown body**.

Metadata is never implicitly rendered.

This enforces clarity and avoids “magic” behavior.

---

### 5.3 Resulting HTML Structure

Example:

```html
<main>
  <section class="stream">
    <!-- article 1 HTML -->
    <!-- article 2 HTML -->
    <!-- article 3 HTML -->
  </section>
</main>
```

Each article fragment may begin with its own `<h1>`, `<article>`, or other structure, as authored.

---

### 5.4 When Mode A Is Sufficient

Mode A is ideal for:

* diary-style streams
* chronological logs
* full article pages
* MVP implementations where correctness > abstraction

Mode A is the **only supported mode for MVP**.

---

## 6. Stamping Mode B (Future): Wrapper + Content Injection

Mode B exists to support uniform index layouts (lists, cards, summaries).

However, Mode B introduces risks:

* implicit content conventions
* excerpt logic
* partial rendering semantics
* metadata leakage temptation

Given your architectural goals, Mode B is **explicitly deferred**.

It must not be implemented until:

* real usage pressure exists
* conventions are proven necessary
* constraints are re-evaluated deliberately

---

## 7. Query Resolution and Index Dependency

### 7.1 Article Index Requirement

Before any template is rendered, the build must construct a complete **article index**.

This index is the sole data source for queries.

---

### 7.2 Index Construction Steps

For each directory matching:

```
blog/YYYY/MM/DD/NN/num-slug/
```

the build must:

1. validate path structure
2. derive path fields
3. locate article Markdown file
4. parse frontmatter
5. create an article record

Markdown body is **not rendered** during indexing.

---

### 7.3 Derived Fields

From path:

```
blog/2026/01/08/02/02-z80-disassembly/
```

derive:

* `year = 2026`
* `month = 01`
* `day = 08`
* `ordinal = 02`
* `slug = z80-disassembly`
* `path = full relative path`

Derived fields are authoritative and immutable.

---

### 7.4 Frontmatter Fields Used by Queries

Frontmatter may include:

* `status`
* `tags`
* `series`

Frontmatter is:

* read during indexing
* used during query filtering
* **never passed to templates**

---

## 8. Query Application Model

Queries are JSON POJOs.

Templates never inspect or interpret query contents.

### 8.1 Query → Result Mapping

Each query resolves to:

```
query-name → ordered list of article records
```

This mapping is computed once per build and reused across templates.

---

### 8.2 Deterministic Evaluation Phases

Rendering must follow this strict order:

1. discover articles
2. build article index
3. validate queries
4. execute queries
5. render templates
6. copy assets

Reordering these phases is forbidden.

---

## 9. Templates with Multiple Queries

A single template may contain multiple render slots:

```html
<template data-query="latest-posts"></template>
<template data-query="z80-posts"></template>
```

Rules:

* each slot is evaluated independently
* slots are processed top-to-bottom in document order
* a query may be referenced multiple times
* all slots share the same article index

---

## 10. Output Rules

### 10.1 Output Path Mapping

Templates render into a clean output directory (e.g. `build/`).

Recommended mappings:

* Article pages:

  ```
  build/blog/YYYY/MM/DD/NN/num-slug/index.html
  ```

* Index pages:

  ```
  build/index.html
  build/tags/z80/index.html
  build/archive/2026/01/index.html
  ```

Output paths must be deterministic and collision-free.

Index pages (home, tag pages, day/month/year archives) are first-class rendered outputs, not derived views.

* each index page is rendered from an explicit template
* each index page has a stable output path
* no index page is generated implicitly

If an index page exists, it exists because a template explicitly rendered it.

---

### 10.2 Asset Handling

For each article directory:

* copy `assets/` directory if present
* preserve relative paths
* ensure links resolve identically post-build

Assets are never inferred or relocated automatically.

---

## 11. Template Discovery

For MVP, templates are explicitly enumerated.

Example:

* `templates/home.html`
* `templates/tag.html`
* `templates/day.html`

Later extensions may include:

* a template registry
* parameterized template selection

Implicit template discovery is not allowed.

---

## 12. Validation Requirements

### 12.1 Hard Errors

Build must fail if:

* a template references an unknown query
* article path violates canonical structure
* ordinal mismatch exists
* required files are missing
* Markdown cannot be rendered

---

### 12.2 Warnings

Build may warn if:

Forward references are allowed: templates may reference queries that resolve to zero results, and queries may target tags, series, or dates that do not yet exist. These conditions warn but do not fail.

* a query returns zero results
* a query is defined but unused
* a template produces no output

Warnings must be visible but non-fatal.

---

## 13. Why This Design Is Deliberate

This system avoids:

1. **Template DSL creep**
2. **Implicit metadata rendering**
3. **Framework lock-in**
4. **Hidden control flow**
5. **Non-deterministic builds**

The cost is verbosity.
The benefit is durability.

---

## 14. Explicit MVP Lock-In

For MVP, the following are fixed:

* Mode A stamping only
* HTML templates only
* named queries only
* metadata never rendered
* deterministic build order

Anything else is additive and must not weaken these guarantees.
