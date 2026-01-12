---


title: "Frontmatter as Data"
status: published
series: contentstore
summary: "Separates machine data from prose so indexing stays deterministic. It keeps list logic away from the article voice."
tags:
  - frontmatter
---
# Frontmatter as Data
_January 11, 2026_ | Series: contentstore

I write the body for readers and use frontmatter so the build can work without reading it. Everything above the YAML divider supports indexing and ordering along with layout. The build reads this small structured block and stops. That boundary keeps the prose for people while the data stays available to the pipeline.

A typical frontmatter block looks like this:

```yaml
title: "An Article Is a File"
summary: "How each entry in this blog reduces to a single Markdown file. The body stays human, the header stays machine."
series: genesis
tags: [publishing, process, tooling, structure]
status: published
thumbnail: assets/hero.jpg
```

Those fields form the row for this article in the site's internal table. Titles and summaries let index pages render without scraping prose, and the series value places the article inside a forward-moving narrative. Tags attach the entry to topics, and status controls visibility. The thumbnail gives lists a concrete image.

This separation lets writing and indexing evolve independently. A list title may not match the heading inside the article, and a summary may never appear in the prose. I keep that duplication because it keeps each surface predictable and keeps the body readable even when the index logic changes.

It keeps the voice in the body intact when I revise the indexing rules.

From a tooling perspective this keeps the pipeline simple. Scripts parse YAML and collect rows, then apply filters and sorts without reading the body. That keeps selection mechanical and prevents hidden inference. Everything that participates in queries and lists lives in one place, in a form that stays stable even as the writing changes.

Tags: frontmatter
