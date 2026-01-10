---
title: "The Content Store and the Article Unit"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
series: content-store
summary: "The content store lives in the filesystem, and each article follows a fixed directory and document structure."
---

# The Content Store and the Article Unit
*January 10, 2026* | Series: content-store | Tags: publishing, process, tooling, structure

I treat the content store as the filesystem itself. The repository holds the blog in plain folders, and every entry stays readable with a text editor long after the build scripts change.

Each post lives at `content/blog/YYYY/MM/DD/NN-slug/`. The date and ordinal live in the path, and the slug gives a human handle. That path sets the URL and the order, and it stays fixed as the text evolves.

```
content/blog/YYYY/MM/DD/NN-slug/
  article.md
```

Inside the directory I keep a single `article.md` and optional assets for that entry. The directory holds the history, and the file is what I read.

Frontmatter holds status, tags, and summary. The build reads those fields for indexing and queries. The body carries the title, date, and tags in visible text so the Markdown file reads clean on its own.

Queries select which articles appear, and templates stamp them into HTML. The content store feeds both sides, and the structure keeps the mechanics obvious.

I want the archive to be legible a year from now. The path tells me when the work happened, the frontmatter tells me how it was indexed, and the body gives me the full record.
