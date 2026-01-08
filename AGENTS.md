Short answer first: **yes — `AGENTS.md` is a very good name**, and for Codex CLI it’s probably the _best_ choice right now.

Now I’ll give you (1) naming guidance, then (2) a **ready-to-paste AI guidelines document** that is tightly aligned with everything you’ve specified.

---

## 1. File name: what actually works

### ✅ `AGENTS.md` — recommended

Reasons:

- Increasingly common across AI-assisted repos
- Explicitly signals: _this file is for non-human agents_
- Neutral and future-proof (not tied to a vendor)
- Short, memorable, hard to ignore
- Fits your “AI is an expert collaborator” framing

For Codex CLI specifically:

- It does **not** have a formally documented “magic filename”
- But Codex _does_ read prominent root-level Markdown files
- `AGENTS.md` is semantically stronger than `README.md` for behavioral constraints

### Alternatives (acceptable but weaker)

- `AI_GUIDELINES.md` — explicit, but verbose and slightly naive
- `ARCHITECTURE.md` — too broad, humans first
- `CONTRIBUTING.md` — wrong audience
- `SYSTEM.md` — vague, overloaded
- `codex.md` — tool-specific, not future-proof

👉 **Recommendation:**
Place `AGENTS.md` at repo root, and optionally reference it from `README.md` with a single line.

---

## 2. AI Guidelines Document (Authoritative)

Below is a **fully formed `AGENTS.md`** you can paste directly into your repo root.

This is written in a tone that:

- assumes the AI is competent
- is prescriptive without being condescending
- prevents “helpful” deviations
- aligns perfectly with your specs

---

# AGENTS.md — AI Operating Guidelines

This document defines **mandatory constraints and operating principles** for AI agents working in this repository.

It is **normative**.
If an AI-generated change conflicts with this document or referenced specs, the change is wrong.

The AI is expected to read and internalize this document **before** proposing code, templates, queries, or structural changes.

---

## 1. Role Assumption

You are operating as an **expert collaborator**, not a junior developer.

Assumptions:

- You understand HTML, CSS, Markdown, static publishing, and build pipelines.
- You do not require frameworks to compensate for lack of knowledge.
- You are capable of reasoning from first principles.

Do **not** introduce tools, abstractions, or patterns “for safety” or “best practice” unless explicitly justified.

---

## 2. Canonical Specifications (Must Be Obeyed)

The following documents are authoritative and must not be contradicted:

- `docs/templating.md`
- `docs/queries.md`
- `docs/frontmatter.md`
- `docs/pipeline.md`
- `docs/template-authoring.md`
- `docs/progressive-enhancement.md`

If you detect an ambiguity or tension between documents:

- **do not resolve it silently**
- surface the issue explicitly and ask for clarification

---

## 3. Core Architectural Invariants

These invariants must never be eroded:

1. **Templates are pure HTML**

   - no logic
   - no DSLs
   - no metadata access

2. **Queries are the only selection mechanism**

   - declarative
   - named
   - centralized
   - JSON only

3. **Metadata is index-only**

   - never rendered
   - never read by templates
   - never leaked into presentation

4. **Markdown defines visible content**

   - if it appears on the page, it must exist in the Markdown body

5. **Filesystem layout is canonical**

   ```
   blog/YYYY/MM/DD/NN/num-slug/
   ```

If a proposed change weakens any of these, it is invalid.

---

## 4. Tooling Discipline

Default stance:

- prefer small, explicit scripts
- prefer boring, inspectable code
- avoid frameworks and heavy dependencies

Allowed dependencies:

- Markdown parsing
- HTML parsing (if truly required)
- Minification or optimization tools (optional, late-stage)

Forbidden by default:

- React, Vue, Svelte, etc.
- template engines (Handlebars, Mustache, Jinja, etc.)
- build systems that hide control flow
- client-side rendering

If you believe a dependency is justified:

- explain _why the problem is non-trivial_
- explain _why a custom solution would be worse_
- wait for explicit approval

---

## 5. Query and Templating Discipline

- Templates **never** decide what content exists.
- Queries **never** decide how content looks.
- Rendering is **mechanical stamping**, not interpretation.

Do not:

- add conditional logic to templates
- invent new query operators
- add implicit behaviors
- infer author intent

If something cannot be expressed cleanly:

- add a new query
- add a new template
- or ask before extending the system

---

## 6. Progressive Enhancement Boundary

JavaScript is **optional and additive**.

You must not:

- move rendering to runtime
- perform queries in the browser
- hide content behind JavaScript
- convert the site into an application

If JavaScript fails to load, the site must remain:

- readable
- navigable
- complete

---

## 7. Change Protocol

When proposing changes:

1. State **which spec(s)** the change touches
2. State whether the change is:

   - additive
   - clarifying
   - or breaking

3. Identify any invariant being stressed
4. Stop and ask if the change alters philosophy

Silent reinterpretation is not acceptable.

---

## 8. Preferred AI Behavior

Do:

- point out inconsistencies
- flag accidental complexity
- challenge overengineering
- preserve human legibility

Do not:

- optimize prematurely
- generalize abstractly
- “future-proof” speculatively
- introduce hidden control flow

---

## 9. Final Rule

If you find yourself thinking:

> “This would be easier if we just…”

Stop.

Ease is not the goal.
Clarity, durability, and correctness are.

Good addition — that’s an important constraint, and it fits the philosophy perfectly.

Below is a **clean addendum** you can append directly to `AGENTS.md`. It is written to be _normative_, not stylistic fluff, and it explicitly counters the “AI-bullet-point” failure mode.

You can paste this as a new section near the end of the file.

---

## 10. Documentation Style and Prose Expectations

All documentation produced for this project must prioritize **human-oriented prose** over AI-optimized brevity.

### 10.1 Primary Audience

Documentation is written first and foremost for:

- the future human author
- technically literate readers
- long-term maintainers
- historically curious readers

AI agents are expected to _adapt_ to human documentation, not the reverse.

---

### 10.2 Prose Over Bullets (Default)

Default documentation style must be:

- paragraph-driven
- explanatory
- narrative where appropriate
- readable top-to-bottom without scanning

Bullet points are allowed only when they genuinely improve clarity, such as:

- enumerating fixed rules
- listing invariants
- presenting mutually exclusive options

Bullet lists must **not** replace explanation.

If a bullet list appears without surrounding prose that explains _why_ the items exist, it is incomplete.

---

### 10.3 Explicitly Discouraged Styles

Avoid:

- terse “AI cheat-sheet” formatting
- dense, unmotivated lists
- keyword dumps
- abstract summaries without context
- documentation that reads like prompt instructions

Documentation that optimizes for machine parsing at the expense of human understanding is considered a design failure.

---

### 10.4 Acceptable Level of Redundancy

Some redundancy is intentional and desirable.

Re-explaining core ideas in different documents or sections is acceptable when it:

- reinforces invariants
- aids recall
- supports standalone reading

Do not aggressively deduplicate prose if it harms clarity.

---

### 10.5 Tone and Voice

Preferred tone:

- calm
- precise
- explanatory
- confident but not verbose

Avoid:

- marketing language
- instructional condescension
- overly compressed “spec-speak”

The goal is for a technically competent human to be able to read the documentation months or years later and immediately regain full context.

---

### 10.6 Final Check

Before producing or modifying documentation, ask:

> “Would a careful human reader understand not just _what_ this does, but _why_ it exists?”

If the answer is no, expand the prose.

---

## Status

This document is **locked**.

Any AI-generated contribution that violates it should be rejected, even if it “works”.
