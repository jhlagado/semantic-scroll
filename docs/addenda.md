Good question. I’ve gone through that old document carefully and compared it against the **newer specs we’ve just produced** (queries, templating, pipeline, JS boundary, template authoring).

What follows are **only genuine deltas** — things that were present or implied in the old doc but are **not yet explicitly captured** in the newer specs, or are only partially covered. Each item is written as a clean **addendum** you can append to the relevant spec documents.

No restating of things you already locked.

---

## Addendum A: Author-Only Versioning and Visibility Semantics

**Where to attach:**

- `frontmatter.md`
- optionally referenced in `pipeline.md`

### Addendum text

> **Author-Only Versioning**
>
> The system does not expose revision history, edit timestamps, or version metadata to readers by default.
>
> - Git history is the sole source of historical truth.
> - Public HTML output represents the _current authored state only_.
> - No “last updated” badges, revision diffs, or edit timelines are generated unless explicitly authored as content.
>
> Status changes (`draft`, `review`, `published`, `archived`) are reversible and tracked only via version control.

**Why this is additive:**
You implied this strongly earlier (“history belongs to the author, not the UI”), but it is not stated explicitly in the newer specs.

---

## Addendum B: Status ↔ Visibility Contract

**Where to attach:**

- `frontmatter.md`
- `pipeline.md`

### Addendum text

> **Status Visibility Contract**
>
> Article `status` affects **indexing and selection only**, not rendering semantics.
>
> - `published` articles may appear in query results.
> - `draft`, `review`, and `archived` articles must never appear in rendered output unless a query explicitly selects them.
> - Templates do not and cannot detect article status.
>
> Visibility is determined solely by query definitions, not template logic.

**Why this is additive:**
Status is defined, but the _contract_ between status and visibility is not spelled out as a rule.

---

## Addendum C: Forward References in Queries and Templates

**Where to attach:**

- `queries.md`
- `templating.md`
- `pipeline.md` (warnings section)

### Addendum text

> **Forward References**
>
> The system permits forward references during authoring:
>
> - Queries may reference tags, series names, or dates that do not yet exist.
> - Templates may reference queries that currently resolve to zero results.
>
> These conditions must produce **warnings**, not build failures.
>
> Forward references become active automatically once matching content exists.

**Why this is additive:**
Forward references were discussed earlier (especially for writing flow), but not locked into the newer specs.

---

## Addendum D: Index Pages Are First-Class Outputs

**Where to attach:**

- `templating.md`
- `pipeline.md`

### Addendum text

> **Index Pages as First-Class Artifacts**
>
> Index pages (home, tag pages, day/month/year archives) are first-class rendered outputs, not derived views.
>
> - Each index page is rendered from an explicit template.
> - Each index page has a stable output path.
> - No index page is generated implicitly.
>
> If an index page exists, it exists because a template explicitly rendered it.

**Why this is additive:**
You implied this repeatedly (“no magic indexes”), but it’s not stated as a hard rule in the newer docs.

---

## Addendum E: Deterministic URL Ownership and Migration Rule

**Where to attach:**

- `pipeline.md`
- possibly a short note in `design.md`

### Addendum text

> **Canonical URL Ownership**
>
> Output URLs are owned by the filesystem layout and template mapping.
>
> - Slugs are durable identifiers.
> - Changing a slug is a deliberate migration.
> - Redirects, if required, must be explicitly authored.
>
> The system must never silently rewrite or infer redirects.

**Why this is additive:**
URL durability is mentioned philosophically, but not operationally.

---

## Addendum F: Cost and Hosting Constraint (Non-Functional Requirement)

**Where to attach:**

- `design.md` or `pipeline.md`

### Addendum text

> **Cost Constraint**
>
> The default assumption is zero or near-zero operating cost.
>
> - Static hosting is preferred.
> - CI should run on free tiers where possible.
> - Paid services are acceptable only with explicit justification.
>
> Tooling decisions must consider long-term maintenance cost, not just convenience.

**Why this is additive:**
This was present in the older narrative but not captured as a formal constraint.

---

## Addendum G: Build-the-Build as First Content Series

**Where to attach:**

- `design.md`

### Addendum text

> **Self-Documenting Build**
>
> The first published content series should document the construction of the system itself.
>
> - Each architectural decision should be representable as a post.
> - Spec documents should map cleanly to publishable narratives.
>
> The system is both the tool and its first case study.

**Why this is additive:**
This was explicit in the old doc (“first public content should document the build”), but not restated later.

---

## Summary

Nothing fundamental was missing — the **core architecture is fully covered** in the newer specs.

What these addenda do is:

- lock in **authorial intent**
- clarify **visibility and lifecycle semantics**
- prevent future “helpful” automation from creeping in
- preserve your **diary-first, classic-web** philosophy

If you want, next I can:

- map each addendum to **exact insertion points** in the existing spec files, or
- consolidate everything into a **final master spec index** document

Just say which.
