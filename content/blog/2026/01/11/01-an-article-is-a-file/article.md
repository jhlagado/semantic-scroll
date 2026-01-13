---


title: "An Article Is a File"
status: published
series: contentstore
summary: "Defines the article as a single file in a dated folder so the URL stays stable. It links that structure to reader trust in old links and a durable archive."
---
# An Article Is a File
_January 11, 2026_ | Series: contentstore

I treat each article as a single Markdown file inside its own folder because I want the archive to stay inspectable and durable. A reader can open the file and see the full text in a stable shape, which keeps the record legible years later. You can also clone the archive and read it in plain text when the build changes.

Each entry lives in its own folder. The folder path carries the date and slug. The file carries the writing, so URLs stay aligned with edits.

Open `article.md` in any entry and you always see the same two-section structure. A YAML block sits at the top and the Markdown body follows, which keeps the writing distinct from the data surface. I write the body for readers and use frontmatter so the build can work without reading it.

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

Everything above the divider is frontmatter for indexing, and everything below it carries the published text. The build reads the YAML block to assemble lists for series and tags, then renders the body as the article page. Titles and summaries let index pages render without scraping prose, and the series value places the article inside a narrative. Tags attach the entry to topics and status controls visibility, so lists stay mechanical and templates stay focused on structure.

That pairing is the reason each permalink stays stable and reviewable even when the build changes.

Some values appear in both places because each surface has a job. Titles and summaries belong in lists, while the article uses its own headline. A summary can stay out of the body so indexes stay concise, which keeps index pages tight while the article stays expansive. This separation keeps the body’s voice intact even when I refine index rules.

From a tooling point of view this keeps articles easy to work with. The file reads cleanly in a text editor. The metadata parses cleanly in small scripts. Git diffs stay tight enough to scan in seconds.

For readers this means the permalink remains stable and the record stays open to inspection. For me it means a predictable build and a file I can review years later. That durability is the payoff of treating the file system as the source.
