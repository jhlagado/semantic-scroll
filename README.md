# Semantic Scroll

This repository holds the Semantic Scroll blog content and presentation: the articles, templates, assets, and site metadata that define the published site.

The site is built with Scribere (the upstream engine). This repo is the instance data that Scribere reads to generate the static site.

Key directories:

- `content/`: articles, templates, assets, and site settings
- `content/site.json`: site metadata used in the build

## Draft and publish workflow

An article begins with `status: draft`. Semantic Scroll deliberately builds its article permalink while leaving the draft out of the journal, archives, topics, series, feeds, and sitemap. Anyone who knows the permalink can review the page, but the URL is not an access-control mechanism.

An instruction to an LLM can therefore be as short as: “Draft a Semantic Scroll post about this subject and deploy the unlisted draft.” The LLM creates the dated Markdown article with `status: draft`, checks the static build, and runs `npm run publish` to commit and push it.

After review, “Publish this draft” means changing its status to `published`, rebuilding, and running `npm run publish` again. That one metadata change adds the article to the journal and the relevant indexes and feeds.

Prose quality is handled during drafting and revision with the applicable writing skills. No mechanical prose checker or prose-quality deployment gate remains.

License: GPL-3.0 (see `LICENSE`).
