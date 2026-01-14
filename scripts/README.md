# Local Scripts

These scripts are intended for local use and are not part of CI. The repository does not manage tool installs. Instead, the required tools are installed globally and used as needed.

Node.js is required to run the scripts in this folder. Install it globally using your preferred method. Two common options are:

With nvm (macOS/Linux):

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts
nvm use --lts
```

With Homebrew (macOS):

```sh
brew install node
```

## Build the site

```sh
npm run build
```

The build script writes the site output only. Prose linting is a separate step you run when you want it.

## Build on change and serve

Install nodemon globally:

```sh
npm install -g nodemon
```

```sh
npm run dev
```

This runs the lint report, builds the site, starts the local server, and rebuilds on changes in `content/`, `config/`, and `site-config.json`. If a root `templates/` or `assets/` directory exists, changes there are watched as well. By default the dev server binds to `127.0.0.1`; set `HOST=0.0.0.0` if you need to reach it from another device, and override the port with `PORT=xxxx` if needed.

The dev loop prints a short status line when lint and build succeed. Lint issues are reported without stopping the server.

## Lint prose in drafts

The prose linter scans `content/<contentDir>/**/article.md` (defaults to `content/semantic-scroll/` in this repo).
If `site-config.json` is present, it uses the `contentDir` override.
It only prints output when it finds issues.

```sh
npm run lint
```

To include published posts:

```sh
npm run lint:all
```

To enforce thresholds (useful for CI):

```sh
npm run lint:gate
```

Defaults are per file: high>=1, medium>=3, low>=6. You can override them:

```sh
node scripts/prose-lint.js --all --gate --max-high=1 --max-medium=2 --max-low=5
```

If you want fail-fast instead of thresholds:

```sh
npm run lint:strict
```
