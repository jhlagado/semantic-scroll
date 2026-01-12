---


title: "An Article Is a File"
status: published
series: contentstore
summary: "Each article is a single Markdown file in a dated folder, with frontmatter for indexing and a body for readers. The path carries the time, and the file carries the content."
---
# An Article Is a File
_January 11, 2026_ | Series: contentstore

In this system an article lives as one Markdown file inside its own directory and each entry sits in one folder with one file that fixes its place in time while the file holds the text. I can open any entry months later and still see the same shape, which matters more to me than a clever template layer.

Open `article.md` in any entry and the shape stays the same. A YAML block sits at the top, followed by the Markdown body, so the layout does not drift.

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

Everything above the divider is metadata, and everything below it carries the published text.

The build reads frontmatter to construct lists for series and tags. That block holds titles and summaries, plus thumbnails and series membership for indexing. The body stays untouched until an article page renders it.

Templates never reconcile the two layers, so series pages pull summaries in order and tag pages pull summaries by recency. Article pages render the body while leaving the metadata alone, and that keeps the data surfaces stable.

This design forces duplication when something matters in more than one place. A list title can differ from the heading in the article. A summary may never appear in the prose. I accept that because it keeps each surface predictable.

From a tooling point of view this keeps articles easy to work with. The file reads cleanly in a text editor and the metadata parses cleanly in scripts, while Git diffs stay tight so I can scan changes in seconds.

The result is a simple object model. The folder locates the article in time. The frontmatter locates it in series and tags, while the body carries the text that gets published.

