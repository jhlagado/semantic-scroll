# AI-Driven Blogging Platform

This repository defines an AI-assisted technical diary and publishing system built on classic web values. It is designed to capture daily technical work in durable, human-readable form without turning publishing into a chore. Posts are treated as long-lived documents rather than CMS entries, and the author retains control of voice, timing, and accountability at every step.

The PRD frames the project as a calm, authored web system: semantic HTML, accessibility, mobile-first layouts, and minimal JavaScript that never becomes a dependency. The workflow is meant to be fast enough for daily capture, but structured enough to support repurposing into talks, videos, or long-form writing. Cost and portability matter: the stack favors free or near-zero hosting, CLI-first tooling, and stable URLs owned by the author.

Architecturally, identity and chronology are derived from the filesystem (`/blog/YYYY/MM/DD/NN-slug/`), queries select content, templates remain pure HTML, and rendering is deterministic stamping. Summary and index views are a built-in render mode that uses frontmatter `title`, `summary`, and `thumbnail` with minimal inline formatting, while full article pages are authored in Markdown and may intentionally diverge from those summary titles. CSS is plain and semantic-first, and JavaScript is optional and additive, ensuring the site stays readable and navigable without it.

For the canonical goals and decisions, start with `docs/PRD.md`. The architecture is captured in `docs/queries.md`, with the Article Unit defined in `docs/article-spec.md` and frontmatter rules in `docs/articles-frontmatter.md`. The query schema and built-ins are in `docs/queries-spec.md` and `docs/queries-builtin.md`. Rendering, template rules, and the JavaScript boundary live in `docs/templating.md`, `docs/templating-conventions.md`, and `docs/templating-javascript.md`. Styling rules are defined in `docs/styling.md`, pipeline and CI rules in `docs/ci-pipeline.md`, and the implementation guide in `docs/design-reference.md`.

## License
MIT. See `LICENSE`.
