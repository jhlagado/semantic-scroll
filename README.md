# Semantic Scroll

A minimalist blogging platform built on classic web values: semantic HTML, accessibility, and filesystem simplicity. No database, no build complexity—just content organized by date and rendered as clean, fast static HTML.

## Design Philosophy

Semantic Scroll embraces simplicity at every level:

- **Filesystem as database**: Content lives in dated folders (`/content/blog/YYYY/MM/DD/NN-slug/`), making your writing human-readable and version-control friendly
- **HTML-first templates**: Pure, accessible markup without framework lock-in
- **Mobile-first**: Responsive layouts that work everywhere
- **Minimal JavaScript**: Progressive enhancement, never a dependency
- **Deterministic builds**: Same input always produces the same output

The platform is designed for writers who want to publish quickly without fighting tooling or memorizing commands.

## Architecture

Identity and chronology derive naturally from the filesystem structure. Queries select content, templates remain pure HTML, and rendering produces static pages. For detailed goals and decisions, see [docs/PRD.md](docs/PRD.md). The query system is documented in [docs/queries.md](docs/queries.md), and the content format is defined in [docs/article-spec.md](docs/article-spec.md).

## Local tooling

Requires Node.js. Install `nodemon` globally for the development watcher:

```sh
npm install -g nodemon
```

See [scripts/README.md](scripts/README.md) for more detail.

## Build and lint

`npm run build` checks prose quality first, then writes the site to `build/`:

```sh
npm run build
```

Lint commands: `npm run lint` (drafts only), `npm run lint:all` (all content), `npm run lint:gate` (CI thresholds).

```sh
npm run lint
npm run lint:all
npm run lint:gate
```

## Local development

`npm run dev` starts a development server with live reload. The server binds to `127.0.0.1` and rebuilds automatically when content, templates, assets, or config change:

```sh
npm run dev
```

## Publishing

Static output in `build/` can be deployed to any web host. GitHub Pages and custom domain configuration will be documented in an upcoming release.

## License

MIT. See `LICENSE`.