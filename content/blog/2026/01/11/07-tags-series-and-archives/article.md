---
title: "Tags, Series, and Archives"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
  - indexing
  - tags
  - series
series: indexing
summary: "Tags and series are the same data with different ordering rules, and archives layer on top of that same index."
---

# Tags, Series, and Archives
*January 11, 2026* | Series: indexing | Tags: publishing, process, tooling, structure, indexing, tags, series

The same index feeds three different views: tags, series, and archives. The difference is sort order, not structure.

Tag pages sort by recency. They answer “what’s new on this topic.” Series pages sort by time ascending. They answer “what’s the story in order.” Archives group by date and preserve chronology at a broader scale.

Because the data model is a table of frontmatter plus derived dates, I don’t need extra metadata to create these pages. I apply a filter, choose an order, and render summaries.

This keeps the system honest. If I want a new view, I add a query and a template, not a new field. The archive stays legible because the rules stay simple.
