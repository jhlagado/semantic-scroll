# Semantic Scroll

Semantic Scroll is a small, opinionated blogging system for people who want to publish on their own domain with plain HTML and a clear folder structure. It does not use a database. Your content lives in folders, templates live beside it, and the build step writes static pages into `build/`.

This repo is also designed to be forked. The instance owns templates, assets, CSS, client-side JavaScript, and content inside `content/<contentDir>/`. The scripts live at the repo root and stay shared. That split lets you pull upstream updates without overwriting your site design. Instance files are the only source of templates, assets, and queries, so the site remains self-contained.

## What you get

You can use this even if you are not a developer, as long as you are comfortable with a small set of commands. The system gives you:

- a dated folder structure for posts
- HTML templates you can edit directly
- static output that works on GitHub Pages or any simple host

## Quick start (local preview)

Install Node.js from the official site: https://nodejs.org/en

Install the dev watcher once:

```sh
npm install -g nodemon
```

Clone the repo and install dependencies:

```sh
git clone https://github.com/jhlagado/semantic-scroll.git
cd semantic-scroll
npm install
```

Start the local server:

```sh
npm start
```

This builds the site and refreshes it when files change. If you prefer the short form, run `npm run dev` instead.

## Where to edit

Your site instance lives under `content/semantic-scroll/` by default. Posts live in dated folders and templates live in `content/semantic-scroll/templates/`. Assets and CSS live in `content/semantic-scroll/assets/`. Head metadata and site settings live in `content/semantic-scroll/site.json`.

If you want a different instance name, copy `site-config.example.json` to `site-config.json` and change `contentDir`. This repo uses defaults, so you do not need `site-config.json` unless you want to override settings. Instance queries live in `content/<contentDir>/queries.json` and do not fall back to a root copy.

## Build and lint

When you are ready to publish, build the site:

```sh
npm run build
```

Prose linting is optional and runs on demand:

```sh
npm run lint
npm run lint:all
npm run lint:gate
```

## Publishing to GitHub Pages

GitHub Pages serves the contents of `build/`. A typical flow is:

1. Build the site so `build/` is current.
2. Publish the `build/` directory to the `gh-pages` branch.
3. Set GitHub Pages to serve from that branch.

GitHub’s guide is here: https://docs.github.com/en/pages

## Custom domain and DNS

Once GitHub Pages is live, you can use a custom domain. Add a `CNAME` file to the published output with your domain name, then set the custom domain in the GitHub Pages settings. Your DNS provider will need the GitHub Pages records for apex and `www` depending on how you want the address to resolve.

## Keeping your fork in sync

If you want to pull upstream changes, these helpers will wire up the remote and merge updates:

```sh
npm run init
npm run update
```

## Tooling notes

More detail about the scripts is in [scripts/README.md](scripts/README.md).

## License

GPL 3.0. See `LICENSE`.
