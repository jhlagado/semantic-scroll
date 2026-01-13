---


title: "Indexing as Queries"
status: published
series: indexing
summary: "Defends a declarative selection model where queries choose and templates stamp. It keeps lists debuggable and prevents hidden selection rules."
tags:
  - indexing
  - queries
---
# Indexing as Queries

I treat indexing as a query problem, not a rendering problem. Every list on the site comes from a named query that selects a set of articles and a sort order. That keeps selection declarative and repeatable, and it keeps logic out of templates.

Queries live in JSON, not inside templates. A template names the query and provides a slot. Then the build fills that slot with either summaries or full article bodies. The template never decides what exists, and it never learns how selection works.

This separation keeps indexing logic small and inspectable. If a list looks wrong, I can read the query and see exactly why those items appear. The build avoids inference and guesswork, which prevents hidden selection and keeps the lists predictable.

The constraint is intentional because queries are plain objects, not a DSL. They cannot grow into a second programming language. That limit is a feature: it prevents hidden logic and keeps the system declarative, not imperative.

This keeps the lists debuggable because every entry maps back to a named filter.

Series and tag pages use the same index but serve different reading modes. A series carries narrative order, so those pages sort by date ascending and read like a sequence. Tag pages group by topic and sort by recency, because readers usually want the latest work first. Both views are built from the same frontmatter table, with the difference coming from the query and sort rules and avoiding extra fields.

Feeds follow the same rule, and the global feed plus tag or series feeds come from named queries that avoid scraped HTML. That keeps discovery aligned with the rest of the site and makes the outputs small and deterministic.

I can change a template without changing the data, or refine a query without touching markup. Indexes remain mechanical outputs of named inputs. The result is no surprise lists and no invisible filters.
