---
title: "The Article Body"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
series: content-store
summary: "The body is the readable record: plain Markdown text, links, code, and media, with layout left to templates."
---

# The Article Body
*January 11, 2026* | Series: content-store | Tags: publishing, process, tooling, structure

Frontmatter tells the system what an article is. The body tells the reader what it says.

Everything below the YAML block exists for rendering and reading. That drives decisions about format and discipline. The body carries text, links, code, and media in a form that stays readable long before and long after any build step touches it.

Markdown works here because it stays close to plain text. Paragraphs read like paragraphs. Headings read like headings. Links are visible. When I open a file in a terminal, a diff viewer, or a chat window, the writing stays legible.

The structure is steady. The body begins with a clear title and a date line so a reader can orient themselves without metadata. Sections use normal Markdown headings. There is no special syntax for pages, columns, or layout. Those concerns belong to templates.

That boundary keeps narrative structure separate from visual structure. When I add a section break, I am thinking about the argument, not the styling. The template decides how headings appear on screen.

Links stay explicit. Internal links point to their published URLs, not to filesystem paths. External links stay as plain URLs. Nothing relies on shortcodes or custom syntax. If a link breaks, it breaks in a way a human can see and fix.

Code blocks use fenced Markdown. No embedded runners. No inline tooling. Code exists to be read. Syntax highlighting can happen in the browser later if it happens at all.

Images and other assets sit in the same folder as the article. The Markdown references them by relative path. That keeps the entry self-contained. When the folder moves, the links still work. The build copies assets into the public site and keeps the same structure in place.

The body carries no embedding logic. If an image needs to be lazy-loaded, the template handles it. An external video appears as a link unless a template renders it differently. The Markdown stays presentation-agnostic.

That boundary keeps the writing stable. I can edit a paragraph, add a code block, or drop in a diagram without worrying about the rest of the system. The file remains text with attachments. The build system turns it into a page.

The self-referential thread of this project shows up here. The articles describe the system that renders them, but they do so in the same format as everything else. There is no special channel for documentation. The documentation lives inside the system it documents.

That constraint forces clarity. If a concept cannot fit into Markdown with links and headings, it does not exist in a form the system can carry. Writing becomes a design tool and shapes the system as it grows.

The article body stays simple because it has to. This is the one place where all of this meets a human reader. Everything else can be mechanical. The body stays readable.
