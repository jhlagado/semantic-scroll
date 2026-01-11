---
title: "An Article Is a File"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
series: content-store
summary: "Each article is a single Markdown file in a dated folder, with frontmatter for indexing and a body for readers. The path carries the time, and the file carries the content."
---

# An Article Is a File
*January 11, 2026* | Series: content-store | Tags: publishing, process, tooling, structure

In this system an article lives as one Markdown file inside its own directory. The folder fixes its place in time, and the file holds the text.

Open `article.md` in any entry and the shape stays the same. A YAML block sits at the top, followed by the Markdown body.

```markdown
---
title: "The Shape of the Archive"
summary: "How this blog organises itself on disk instead of inside a database. The path does the work."
series: genesis
tags: [tooling, publishing]
status: published
thumbnail: hero.jpg
---

Here is where the writing begins…
```

Everything above the divider is metadata. Everything below it carries the published text.

The build reads frontmatter to construct lists, series pages, and tag pages. Titles, summaries, thumbnails, tags, and series membership come from that block. The body stays untouched until an article page renders it.

Templates never reconcile the two layers. A series page pulls summaries in order. A tag page pulls summaries by recency. An article page renders the body and leaves the metadata alone. That keeps the data surfaces stable.

This design forces duplication when something matters in more than one place. A list title can differ from the heading in the article. A summary may never appear in the prose. I accept that because it keeps each surface predictable.

From a tooling point of view this keeps articles easy to work with. The file reads cleanly in a text editor. The metadata parses cleanly in scripts. Git diffs stay tight.

The result is a simple object model. The folder locates the article in time. The frontmatter locates it in series and tags. The body carries the text that gets published.
