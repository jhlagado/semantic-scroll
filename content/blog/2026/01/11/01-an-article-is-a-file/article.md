---


title: "An Article Is a File"
status: published
series: contentstore
summary: "Each article lives as a single Markdown file in its own dated folder so the archive stays inspectable, URLs stay stable, and indexing stays mechanical."
---
# An Article Is a File
_January 11, 2026_ | Series: contentstore

I treat each article as a single Markdown file inside its own folder because I want the archive to stay inspectable and durable. A reader can open the file and see the full text in a stable shape, which keeps the record legible years later. You can also clone the archive and read it in plain text when the build changes.

Each entry lives in its own folder. The folder path carries the date and slug. The file carries the writing, so URLs stay aligned with edits.

Open `article.md` in any entry and you always see the same two-section structure. A YAML block sits at the top and the Markdown body follows, which keeps the writing distinct from the data surface.

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

Everything above the divider is frontmatter for indexing, and everything below it carries the published text. The build reads the YAML block to assemble lists for series and tags, then renders the body as the article page. That keeps selection mechanical and keeps templates focused on structure.

Some values appear in both places because each surface has a job. Titles and summaries belong in lists, while the article uses its own headline. A summary can stay out of the body so indexes stay concise. That keeps index pages tight while the article stays expansive. It also keeps readers from re-reading the same text in two places.

From a tooling point of view this keeps articles easy to work with. The file reads cleanly in a text editor. The metadata parses cleanly in small scripts. Git diffs stay tight enough to scan in seconds.

For readers this means the permalink remains stable and the record stays open to inspection. For me it means a predictable build and a file I can review years later. That durability is the payoff of treating the file system as the source.
