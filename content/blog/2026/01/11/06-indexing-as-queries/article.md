---
title: "Indexing as Queries"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
  - indexing
  - queries
series: indexing
summary: "Indexes are built by named queries, not ad-hoc logic, so selection stays declarative and repeatable."
---

# Indexing as Queries
*January 11, 2026* | Series: indexing | Tags: publishing, process, tooling, structure, indexing, queries

I treat indexing as a query problem, not a rendering problem. Every list on the site comes from a named query that selects a set of articles and a sort order. That keeps selection declarative and repeatable.

Queries live in JSON, not inside templates. A template names the query and provides a slot. The build fills that slot with either summaries or full article bodies. The template never decides what exists.

This separation keeps my indexing logic small and inspectable. If a list looks wrong, I can read the query and see exactly why those items appear. The build does not infer or guess.

It also keeps the system stable over time. I can change a template without changing the data, or refine a query without touching markup. Indexes remain mechanical outputs of named inputs.
