# The Article Unit: A Specification for Durable Content

This document defines the **Article Unit**, the fundamental atomic unit of the blog. It is derived from `docs/PRD.md` and aligned with `docs/articles-frontmatter.md`. Rather than treating blog posts as simple entries in a database, we treat each one as a self-contained, portable, and durable document. An Article Unit must be capable of fulfilling many roles—from a quick technical thought captured in a diary to a formal, multi-page technical specification. It is designed to be readable as a standalone Markdown file for decades, independent of the build system used to render it.

---

## 1. Filesystem Identity and the Ordinal Invariant

The identity of an article is rooted in the filesystem, which serves as the sole authoritative source for its chronological position and unique identity. We use a structured path hierarchy: `/content/blog/YYYY/MM/DD/NN-slug/article.md`.

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
stream: rebuild-log
summary: "Short factual summary used in index views"
thumbnail: assets/thumbnail.jpg
---
```

Here, the `status` field controls visibility (e.g., preventing drafts from appearing in public feeds), while the `stream` field categorizes the post into an ongoing thematic flow (like a specific project log). The `title`, `summary`, and `thumbnail` fields are used by built-in summary views and external feeds, not by full article rendering. Title and summary may include minimal inline formatting (bold, italic, and inline links only). Dates remain filesystem-derived rather than frontmatter-defined.

### 2.2 The Visible Document (The Mirroring Requirement)

Because our rendering templates are intentionally "dumb" and cannot access frontmatter, the document body must be self-contained. Any information intended for the reader—such as the title, the date of creation, or the categorical tags—must be authored directly in the Markdown prose. This "mirroring" ensures that if the build system disappears tomorrow, the document remains perfectly legible to a human reader.

Every article begins with a standard header block that fulfills this requirement:

```markdown
# Building the Z80 Disassembler: Part 1

_January 9, 2026_ | Tags: #z80, #assembly, #retrocomputing
```

---

## 3. Archetypes in Action

While the Article Unit is flexible, it typically aligns with specific archetypes that dictate its prose style and structure. The following examples illustrate how the same fundamental unit adapts to different publishing needs.

### 3.1 The Technical Diary (Stream Log)

A diary entry focuses on rapid capture and narrative flow. It often exists as part of a continuous **stream**, providing a chronological account of progress or discovery. The style is informal and conversational, prioritized for speed and clarity of thought.

> _Example (Diary)_:
>
> # Day 14: Solving the Timing Glitch
>
> _January 10, 2026_ | Tags: #hardware, #debugging
>
> Today I finally tracked down the timing issue in the bus controller. It wasn't a logic error in the code, but a subtle propagation delay on the physical board. By shifting the clock edge slightly, the signals stabilized. This log records the specific probe points and values that led to the fix...

### 3.2 The Formal Specification (Spec)

A specification is normative and precise. It uses explicitly numbered sections and a formal tone to define rules or protocols. This archetype often includes a status section to track its evolution (e.g., PROPOSED, LOCKED).

> _Example (Spec)_:
>
> # Protocol Definition: SYNC-GATE v1.2
>
> _January 11, 2026_ | Tags: #protocol, #standards
>
> **Status**: LOCKED (Stable)
>
> 1.0 **Overview**: This specification defines the SYNC-GATE protocol for inter-module communication.
> 2.0 **Signal Requirements**: All modules must pull the CLK pin high during idle...

### 3.3 The Reference Document

Reference docs are optimized for long-term lookup. They use objective prose, frequent headings, and extensive code blocks to provide a durable resource for a specific topic.

---

## 4. Authoring Responsibility

Anyone creating or revising a post must maintain the integrity of the Article Unit. The `/NN-slug/` folder structure must be enforced and all relevant metadata must be mirrored correctly in the body. Tags should be normalized within the prose to ensure consistency with the searchable index, transforming informal mentions like "hardware" into their canonical forms like "#hardware". Above all, the document should read as crafted writing rather than a collection of data points.
