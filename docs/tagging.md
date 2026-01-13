# Series and Tags

I treat tags and series as two different ways of reading the archive. Tags describe what an article is about. Series describe which story an article belongs to. Keeping them separate lets the blog work as both a diary and a reference shelf.

## Series

A series is a narrative thread that runs through time. Order matters because the first entry sets context and the later pieces build on it. Reading a series out of order strips the story of its momentum, so series pages keep the sequence intact.

Series membership lives in frontmatter as a single value. It records author intent and makes the narrative explicit without asking tags to carry the weight of story structure.

## Tags

Tags are topical groupings. Order carries less weight here, so recency matters more than sequence. Tag pages surface newer material first to keep those collections useful for quick scanning and ongoing work.

Tags live in frontmatter as a flat list. An article may belong to one series or none, and it may carry any number of tags.

## Sorting Rules

Series pages sort chronologically, oldest first, to preserve narrative flow. Tag pages sort by recency, newest first, to keep topical pages current.

## Frontmatter Format

```yaml
title: "The Shape of the Archive"
series: genesis
tags: [tooling, publishing]
status: published
summary: "How this blog organises itself on disk instead of inside a database. The path does the work."
thumbnail: hero.jpg
```

Dates stay filesystem-derived. The article header metadata block renders the date and permalink without requiring it in the Markdown body.

## Indexing Behaviour

The build generates two kinds of lists. Series indexes pull every article that declares a `series` value and order the result by date ascending. Tag indexes pull every article that carries a tag and order the result by date descending. Both lists render as summaries, while full articles remain Markdown-first.
