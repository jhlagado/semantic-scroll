---
title: "Series, Tags, and Time"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
  - series
  - tags
series: indexing
summary: "Series and tags use the same frontmatter data but sort and group it differently for narrative and topical reading."
---

# Series, Tags, and Time
*January 11, 2026* | Series: indexing | Tags: publishing, process, tooling, structure, series, tags

I treat the archive as an ordering problem once articles exist as files with frontmatter. The same set of entries groups in different ways depending on what a reader wants. Two of those groupings matter here: series and tags.

A series describes a narrative. It carries the idea that one entry follows another and that reading in order carries meaning. Series pages group all articles with the same `series` value and sort them by date ascending. The first article sets context. Each one extends it. The list grows forward in time.

Tags describe subject matter. They collect material that shares a topic without implying sequence. A reader who clicks a tag expects to see what is most recent first, since recency tends to track relevance. Tag pages group by tag and sort by date descending. Older entries remain available, but they do not define the view.

Both groupings come from the same frontmatter table. Each article contributes a row with its date, tags, and series. The build applies different sorts to that same data. I need no extra structure in the files themselves. What changes is how I shape the list.

This distinction lets the archive behave in two different ways at once. A series behaves like a log or a chaptered notebook, where order carries weight. A tag behaves like a topical index, where breadth and freshness matter more than sequence. The same article can sit inside both without conflict, because one describes its place in a story and the other describes what it is about.

From a maintenance point of view this stays simple. Adding an article means adding one more row. Whether it appears in a series page, a tag page, or a month index depends only on how that row gets filtered and sorted.
