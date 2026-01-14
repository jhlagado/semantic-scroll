# The Article Unit: A Specification for Durable Content

This document defines the **Article Unit**, the fundamental atomic unit of the blog. It is derived from `docs/PRD.md` and aligned with `docs/articles-frontmatter.md`. Rather than treating blog posts as simple entries in a database, we treat each one as a self-contained, portable, and durable document. An Article Unit must be capable of fulfilling many roles—from a quick technical thought captured in a diary to a formal, multi-page technical specification. It is designed to be readable as a standalone Markdown file for decades, independent of the build system used to render it.

---

## 1. Filesystem Identity and the Ordinal Invariant

The identity of an article is rooted in the filesystem, which serves as the sole authoritative source for its chronological position and unique identity. We use a structured path hierarchy: `/content/<contentDir>/YYYY/MM/DD/NN-slug/article.md` (default `content/example/` in this repo).

`contentDir` acts as a **Namespace**. This structure isolates all instance-specific data (content, templates, assets) into a single folder. The primary benefit is **Upstream Merge Isolation**: when you fork the repository and pull updates from the original source, your local customizations in `content/my-blog/` are never overwritten by updates to the reference instance (`content/example/`).

The article directory may also contain an `assets/` subfolder for images, code, PDFs, and other media. Aside from `article.md`, the root of the directory should not contain other files.

The most critical part of this path is the **NN** ordinal prefix in the leaf directory. This two-digit ordinal prefix (`NN`) ensures that multiple articles created on the same day are sorted correctly by both human-centric tools and automated build scripts, preventing accidental alphabetical sorting of slugs. The leaf directory is named with its human-readable **NN-slug** (e.g., `01-first-post/`). Once an article is assigned to its folder, it remains there for its entire lifecycle; even if the content is revised years later, its birth folder remains its permanent home, preserving its place in history. Each article directory must contain exactly one canonical Markdown body file; missing or ambiguous candidates are build failures.

---

## 2. Constructing the Document

An Article Unit is divided into two functional regions: the invisible metadata (Frontmatter) and the visible prose (Body). The strict separation between these two is a core architectural choice.

### 2.1 The Invisible Index (Frontmatter)

Frontmatter is used for indexing, query execution, and summary rendering. It is not used as a source for full article rendering. A typical frontmatter block defines the article's current lifecycle state and thematic track:

```yaml
---
title: "Short title used for index views"
status: published
tags: [z80, assembly, retrocomputing]
series: build-log
summary: "Short factual summary used in index views. It stays plain and direct."
thumbnail: assets/thumbnail.jpg
---
```

Here, the `status` field controls visibility (e.g., preventing drafts from appearing in public feeds). The `title`, `summary`, and `thumbnail` fields are used by built-in summary views and external feeds, not by full article rendering. Thumbnails must live in the article’s `assets/` subfolder and be referenced by a path relative to that folder. The build resolves the path to an absolute URL in rendered HTML. Title and summary may include minimal inline formatting (bold, italic, and inline links only). Dates remain filesystem-derived rather than frontmatter-defined.

### 2.2 The Visible Document (Body First)

Templates remain "dumb," but full article pages include fixed metadata blocks above and below the Markdown body. Those blocks render the article date, permalink, series, and tags from frontmatter and the filesystem path. The body is reserved for the title, byline, and the prose itself, which keeps the document readable even when extracted from the build.

Every article begins with a straightforward body header that is part of the prose:

```markdown
# Building the Z80 Disassembler: Part 1

By John Hardy
```

If you want the date, series, or tags repeated inside the body text, you can still write them explicitly. The default expectation is that those values live in the metadata blocks instead.

The body also supports captioned code listings. If the next non-empty line after a fenced code block starts with `@@Caption:`, the build wraps the code block in a `<figure class="listing">` and renders the caption as `<figcaption>`. This keeps listings semantic and accessible without forcing raw HTML into the Markdown.

````markdown
```html
<ul>
  <li>First post</li>
  <li>Second post</li>
</ul>
```
@@Caption: Short posts I want to surface on the home page.
````

The body also supports a fold marker that hides the remainder of a page behind a native `<details>` element. If a line contains `@@Fold` on its own, the build splits the article at that point. Everything after the marker is wrapped in `<details class="article-fold">`, with a `<summary>` label that defaults to “Read more”. You can customise the label by adding text after a colon, for example `@@Fold: Continue reading`.

---

## 3. Archetypes in Action

While the Article Unit is flexible, it typically aligns with specific archetypes that dictate its prose style and structure. The following examples illustrate how the same fundamental unit adapts to different publishing needs.

### 3.1 The Technical Diary (Series Log)

A diary entry focuses on rapid capture and narrative flow. It often exists as part of a continuous **series**, providing a chronological account of progress or discovery. Series membership is declared in frontmatter as a single value, while tags remain topical. The style is informal and conversational, prioritised for speed and clarity of thought.

> _Example (Diary)_:
>
> # Day 14: Solving the Timing Glitch
>
> Today I finally tracked down the timing issue in the bus controller. It wasn't a logic error in the code, but a subtle propagation delay on the physical board. By shifting the clock edge slightly, the signals stabilised. This log records the specific probe points and values that led to the fix...

### 3.2 The Formal Specification (Spec)

A specification is normative and precise. It uses explicitly numbered sections and a formal tone to define rules or protocols. This archetype often includes a status section to track its evolution (e.g., PROPOSED, LOCKED).

> _Example (Spec)_:
>
> # Protocol Definition: SYNC-GATE v1.2
>
> **Status**: LOCKED (Stable)
>
> 1.0 **Overview**: This specification defines the SYNC-GATE protocol for inter-module communication.
> 2.0 **Signal Requirements**: All modules must pull the CLK pin high during idle...

### 3.3 The Reference Document

Reference docs are optimised for long-term lookup. They use objective prose, frequent headings, and extensive code blocks to provide a durable resource for a specific topic.

---

## 4. Authoring Responsibility

Anyone creating or revising a post must maintain the integrity of the Article Unit. The `/NN-slug/` folder structure must be enforced and metadata should remain accurate in frontmatter so the header and footer blocks stay consistent. The body should read as crafted writing rather than a collection of data points.
