# Semantic Scroll

This repository contains the **Semantic Scroll** blog instance. The build engine lives in the Scribere repository:

https://github.com/jhlagado/scribere

If you want to start a new blog, follow the Scribere setup guide. This repo is the reference instance and includes the content, templates, assets, and queries under `content/`.

## Local development

Install Node.js from the official site: https://nodejs.org/en

The dev server uses `nodemon` for file watching, and it is installed as a dev dependency. Install dependencies and start the dev server:

```sh
npm install
npm start
```

## Instance configuration

Instance metadata lives in `content/site.json`.

## Pulling engine updates

This repo can pull updates from Scribere without overwriting instance files:

```sh
npm run update
```

## Licence

GPL 3.0. See `LICENSE`.
