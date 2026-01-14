# Feeds and Discovery

Feeds are build artifacts, not templates. They exist so readers and tools can subscribe without scraping HTML, and so the archive stays discoverable outside the site chrome. The feed is produced during the build, using the same query system that drives indexes.

The canonical feed is generated from the `latest-posts` query. It includes the frontmatter title, summary, permalink, and publication date for each item. The build does not read Markdown bodies to construct feeds. This keeps the feed deterministic and aligned with the index data model.

Feed discovery is provided in the HTML head via an alternate link tag. Readers do not need to see the raw URL to benefit from it, but the URL remains stable and accessible for direct use.

The canonical feed lives at `/feed.xml`. Tag feeds live at `/tags/<tag>/feed.xml` and series feeds live at `/series/<series>/feed.xml`, using the same ordering rules as their index pages.
