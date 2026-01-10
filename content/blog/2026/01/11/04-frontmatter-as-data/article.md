---
title: "Frontmatter as Data"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
  - frontmatter
series: content-store
summary: "Frontmatter is a small data block the build reads for indexing, while the body stays for readers."
---

# Frontmatter as Data
*January 11, 2026* | Series: content-store | Tags: publishing, process, tooling, structure, frontmatter

I write the body for readers. I use frontmatter so the rest of the system can work without reading it. Everything above the YAML divider supports indexing, ordering, and layout. The build reads this small structured block and stops.

A typical frontmatter block looks like this:

```yaml
title: "An Article Is a File"
summary: "How each entry in this blog reduces to a single Markdown file."
series: genesis
tags: [publishing, process, tooling, structure]
status: published
thumbnail: assets/hero.jpg
```

Those fields form the row for this article in the site’s internal table. Titles and summaries let index pages render without scraping prose. The `series` field places the article inside a forward-moving narrative. `tags` attach it to topical collections. `status` controls whether it appears at all. `thumbnail` gives visual lists something concrete to render. These values stay out of the body unless a template decides to show them.

This separation lets the writing and the indexing evolve independently. A list title may not match the heading inside the article. A summary may never appear in the prose. I keep that duplication because it keeps each surface predictable. The body stays for readers. The frontmatter stays for machines and layout.

From a tooling perspective this keeps the pipeline simple. Scripts parse YAML, collect rows, and apply filters and sorts. They do not need to infer meaning from prose or inspect Markdown structure. Everything that participates in queries and lists lives in one place, in a form that stays stable even as the writing changes.
