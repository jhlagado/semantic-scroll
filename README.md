# Live Blogging Platform

This repository defines an AI-assisted technical diary and publishing system built on classic web values. It is designed to capture daily technical work in durable, human-readable form without turning publishing into a chore. Posts are treated as long-lived documents rather than CMS entries, and the author retains control of voice, timing, and accountability at every step. AI tools and automation must follow `AGENTS.md` before making changes.

The PRD frames the project as a calm, authored web system: semantic HTML, accessibility, mobile-first layouts, and minimal JavaScript that never becomes a dependency. The workflow is meant to be fast enough for daily capture, but structured enough to support repurposing into talks, videos, or long-form writing. Cost and portability matter: the stack favors free or near-zero hosting, CLI-first tooling, and stable URLs owned by the author.

Architecturally, identity and chronology are derived from the filesystem (`/content/blog/YYYY/MM/DD/NN-slug/`), queries select content, templates remain pure HTML, and rendering is deterministic stamping. Summary and index views are built-in render modes that use frontmatter `title`, `summary`, and `thumbnail` with minimal inline formatting, while full article pages are authored in Markdown and may intentionally diverge from those summary titles. Frontmatter is rendered only in summary and index views, never in full article rendering. CSS is plain and semantic-first, and JavaScript is optional and additive, ensuring the site stays readable and navigable without it.

For the canonical goals and decisions, start with [docs/PRD.md](docs/PRD.md). The architecture is captured in [docs/queries.md](docs/queries.md), with the Article Unit defined in [docs/article-spec.md](docs/article-spec.md) and frontmatter rules in [docs/articles-frontmatter.md](docs/articles-frontmatter.md). The query schema and built-ins are in [docs/queries-spec.md](docs/queries-spec.md) and [docs/queries-builtin.md](docs/queries-builtin.md). Rendering, template rules, and the JavaScript boundary live in [docs/templating.md](docs/templating.md), [docs/templating-conventions.md](docs/templating-conventions.md), and [docs/templating-javascript.md](docs/templating-javascript.md). Styling rules are defined in [docs/styling.md](docs/styling.md), pipeline and CI rules in [docs/ci-pipeline.md](docs/ci-pipeline.md), and the implementation guide in [docs/design-reference.md](docs/design-reference.md).

## Local tooling

Local scripts run on Node.js and the repo keeps installs outside the tree. Install Node.js with your preferred system tool, then install `nodemon` globally for the dev watcher.

```sh
npm install -g nodemon
```

More detail lives in [scripts/README.md](scripts/README.md).

## Build and lint

`npm run build` runs the strict prose linter first and stops on lint errors, then writes the site into `build/`.

```sh
npm run build
```

`npm run lint` checks drafts only. `npm run lint:all` includes published posts, and `npm run lint:gate` applies threshold checks for CI.

```sh
npm run lint
npm run lint:all
npm run lint:gate
```

## Local development

`npm run dev` runs a non-blocking lint report, builds the site, starts the server, and rebuilds on changes under `content/`, `templates/`, `assets/`, and `config/`. The dev server binds to `127.0.0.1:8000` by default; override with `HOST` and `PORT` if needed.

```sh
npm run dev
```

## Deferred notes

Two topics are intentionally deferred: a GitHub Pages and custom domain walkthrough, and a clear base‑URL story for GitHub Pages versus custom domains. Both will be documented after the next pass on deployment.

## License

MIT. See `LICENSE`.
