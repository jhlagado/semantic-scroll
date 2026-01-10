---
title: "Feeds and Discovery"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
  - indexing
  - feeds
series: indexing
summary: "Feeds are build artifacts derived from queries so subscriptions stay deterministic and easy to discover."
---

# Feeds and Discovery
*January 11, 2026* | Series: indexing | Tags: publishing, process, tooling, structure, indexing, feeds

I treat feeds as first-class build artifacts. They are generated from the same query system that powers indexes, not from scraped HTML.

The global feed is a view of the latest posts. Tag feeds and series feeds reuse the same data with different ordering rules. That keeps subscriptions aligned with the rest of the site.

Discovery lives in the head tags. A feed reader should find the feed URL without crawling the page body, and the URL should be stable enough to paste into a reader directly.

This approach keeps the feed honest. It is small, deterministic, and derived from the same source as everything else.
