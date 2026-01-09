# jhardy.work

AI-assisted technical diary and publishing system built on classic web values. The project defines a deterministic, query-driven static pipeline with strict separation of concerns, frontmatter-driven summary views, and durable filesystem-based identity. It favors human legibility, minimal tooling, and long-term portability over framework convenience.

## Highlights
- Canonical content layout is filesystem-based (`/blog/YYYY/MM/DD/NN-slug/`) with stable URLs and derived dates.
- Templates are pure HTML and never read metadata; queries select content; rendering is deterministic stamping.
- Summary and index views are built-in render modes using frontmatter `title`, `summary`, and `thumbnail` with minimal inline formatting.
- Full article pages are authored in Markdown and may diverge from frontmatter titles.
- JavaScript is optional and additive; the site must remain readable and navigable without it.
- CSS is plain, semantic-first, accessible, and optimized for long-form readability.
- Tooling is lightweight, CI-driven, and designed for free or near-zero hosting.

## Specs
- `docs/PRD.md` - Product requirements and vision
- `docs/queries.md` - Architecture and design decisions
- `docs/article-spec.md` - Specification for the Article Unit
- `docs/articles-frontmatter.md` - Frontmatter and metadata rules
- `docs/queries-spec.md` - Query JSON schema
- `docs/queries-builtin.md` - Canonical built-in queries
- `docs/templating.md` - Templating and rendering specification
- `docs/templating-conventions.md` - Template authoring conventions
- `docs/templating-javascript.md` - Progressive enhancement and JS boundary
- `docs/styling.md` - CSS and styling specification
- `docs/ci-pipeline.md` - Build pipeline and CI rules
- `docs/design-reference.md` - Reference implementation and execution guide

## License
MIT. See `LICENSE`.
