---


title: "The Article Body"
status: published
series: contentstore
summary: "The body is the readable record, written as plain Markdown with links and code, while layout stays in templates. Everything the reader sees lives here so the file stands alone without the build."
---
# The Article Body
_January 11, 2026_ | Series: contentstore

Frontmatter tells the system what an article is, while the body tells the reader what it says.

Everything below the YAML block exists for rendering and reading. That drives decisions about format and discipline. The body carries text along with links and code plus any media in a form that stays readable long before and long after any build step touches it.

Markdown works here because it stays close to plain text, so paragraphs read like paragraphs and headings read like headings while links stay visible. When I open a file in a terminal or a diff viewer, the writing stays legible even in a chat window.

The structure stays steady because the body begins with a clear title and a date line so a reader can orient themselves without metadata. Sections use normal Markdown headings, and there is no special syntax for pages or layout because those concerns belong to templates.

That boundary keeps narrative structure separate from visual structure. When I add a section break, I am thinking about the argument, not the styling. The template decides how headings appear on screen.

Links stay explicit: internal links point to published URLs while external links stay plain, so filesystem paths stay out of the body. Nothing relies on shortcodes or custom syntax, so if a link breaks it does so in a way a human can see and fix.

Code blocks use fenced Markdown with no embedded runners or inline tooling because the code exists to be read. Syntax highlighting can happen in the browser later if it happens at all.

Images and other assets sit in the same folder as the article, and the Markdown references them by relative path so the entry stays self-contained when the folder moves. The build copies assets into the public site and keeps the same structure in place.

The body carries no embedding logic, so images that need lazy-loading get handled by the template and external video stays as a link unless the template renders it differently. The Markdown stays presentation-agnostic while the template handles those choices.

That boundary keeps the writing stable, so I can edit a paragraph or add a code block without worrying about the rest of the system. The file remains text with attachments, and the build system turns it into a page.

The self-referential thread of this project shows up here. The articles describe the system that renders them, but they do so in the same format as everything else. There is no special channel for documentation. The documentation lives inside the system it documents.

That constraint forces clarity because if a concept cannot fit into Markdown with links and headings, it does not exist in a form the system can carry. Writing becomes a design tool and shapes the system as it grows.

The article body stays simple because it has to, since this is the one place where all of this meets a human reader and everything else can be mechanical while the body stays readable.

