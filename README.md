# Semantic Scroll

A minimalist blogging platform built on classic web values: semantic HTML, accessibility, and filesystem simplicity. No database, no build complexity—just content organised by date and rendered as clean, static pages.

## Design Philosophy

Semantic Scroll embraces simplicity at every level:

- **Filesystem as database**: Content, templates, and assets live in namespaced directories under `/content/<contentDir>/` (default `content/semantic-scroll/` in this repo). This ensures that upstream updates to the platform logic or the reference instance never overwrite your local customizations during a merge.
- **HTML-first templates**: Pure, accessible markup without framework lock-in. Templates are resolved by checking the instance directory first, then falling back to the core defaults.
- **Mobile-first**: Responsive layouts that work everywhere.
- **Minimal JavaScript**: Progressive enhancement, never a dependency.
- **Deterministic builds**: Same input always produces the same output.

The platform is designed for writers who want to publish quickly without fighting tooling or memorizing commands.

## Architecture

Identity and chronology derive naturally from the filesystem structure. Queries select content, templates remain pure HTML, and rendering produces static pages. For detailed goals and decisions, see the docs.

Optional `site-config.json` overrides site metadata and the content root. This repo runs on the built-in defaults; use `site-config.example.json` when you want to set up a different instance without having upstream changes overwrite your local settings.

## Installation

Install Node.js from the official site: https://nodejs.org/en

Install `nodemon` globally for the development watcher:

```sh
npm install -g nodemon
```

See [scripts/README.md](scripts/README.md) for more detail on the tooling.

## Run locally

For local development, `npm start` clears the terminal and runs the dev server. It currently runs `dev` twice to match the requested workflow:

```sh
git clone https://github.com/jhlagado/semantic-scroll.git
cd semantic-scroll
npm install
```

```sh
npm start
```

You can also run the dev server directly:

```sh
npm run dev
```

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

## Keeping your fork in sync

If you are using this repo as a base for your own blog, the helper scripts below wire up the upstream remote and pull changes from it:

```sh
npm run init
npm run update
```

`npm run init` adds the upstream remote (if it does not exist yet) and fetches it. `npm run update` merges the latest upstream `main` into your branch so you can pick up platform changes without losing your instance content.

## Publishing to GitHub Pages

Static output in `build/` can be deployed to any web host.

For GitHub Pages, publish the contents of `build/` to the `gh-pages` branch (CI does this in the default setup) and set Pages to serve from that branch. GitHub’s guide is here: https://docs.github.com/en/pages

## Custom domain and DNS

If you want to use a custom domain, add a `CNAME` file to the published output containing your domain and configure your DNS provider to point the apex at GitHub Pages. You will also need to register the domain with a registrar and set the nameservers or DNS records per your provider’s instructions.

Base URL considerations and a more detailed walk‑through are tracked for a future doc update.

## License

GPL 3.0. See `LICENSE`.
