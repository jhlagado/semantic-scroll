---


title: "Indexing as Queries"
status: published
series: indexing
summary: "Indexes are built by named queries, not ad-hoc logic, so selection stays declarative and repeatable. Templates stay dumb while queries stay readable, which keeps the archive explainable."
tags:
  - indexing
  - queries
---
# Indexing as Queries
_January 11, 2026_ | Series: indexing

I treat indexing as a query problem, not a rendering problem. Every list on the site comes from a named query that selects a set of articles and a sort order. That keeps selection declarative and repeatable, and it keeps logic out of templates.

Queries live in JSON, not inside templates. A template names the query and provides a slot. The build fills that slot with either summaries or full article bodies. The template never decides what exists, and it never learns how selection works.

This separation keeps indexing logic small and inspectable. If a list looks wrong, I can read the query and see exactly why those items appear. The build does not infer or guess.

The constraint is intentional because queries are plain objects, not a DSL. They cannot grow into a second programming language. That limit is a feature: it prevents hidden logic and keeps the system declarative, not imperative.

Feeds follow the same rule, and the global feed plus tag or series feeds come from named queries that avoid scraped HTML. That keeps discovery aligned with the rest of the site and makes the outputs small and deterministic.

I can change a template without changing the data, or refine a query without touching markup. Indexes remain mechanical outputs of named inputs.

Tags: indexing, queries