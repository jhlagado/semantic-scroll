---


title: "The Article Body"
status: published
series: contentstore
summary: "The body is the reader's record in plain Markdown so the text stays legible without the build, while templates handle layout and indexing."
---
# The Article Body
_January 11, 2026_ | Series: contentstore

Frontmatter defines an article for the build, but the body carries the meaning for readers. It is the section a reader actually meets, so I treat it as the record that must survive every build. Everything below the YAML block exists to be read, and that focus drives the format and the discipline. The body holds the text and keeps links and code beside the media, so the file stays readable before and after the build touches it.

Markdown keeps the text close to plain language. Paragraphs and headings read the same in a terminal or a diff viewer, so the file stays legible wherever it travels. That consistency lets me review drafts without leaving the file. That stability is why I keep the body in Markdown even as the rest of the system shifts. I begin the body with the title and date line so the file stands on its own and the reader can orient without metadata. Sections use normal Markdown headings, which keeps the body free of page and layout syntax.

Layout lives in templates and the body stays focused on narrative structure. I add section breaks to serve the argument, and the template controls how headings appear on screen. Links point to published URLs and stay explicit in the prose, which keeps filesystem paths out of the body. Code blocks use fenced Markdown and avoid inline tooling because the code exists to be read. Syntax highlighting can happen in the browser when it helps.

Images and other assets sit in the same folder as the article, and the Markdown references them by relative path so the entry stays self-contained when the folder moves. The build copies that folder into the public tree and keeps the same structure in place, which keeps images working in indexes and on their own page. The body avoids embedding logic and keeps lazy loading in templates, while the Markdown stays presentation-agnostic and media framing stays in the layout layer. That boundary keeps the writing stable, so I can edit a paragraph or add a code block without worrying about the rest of the system. The file remains text with attachments, and the build system turns it into a page.

These posts describe the system that publishes them, and they do so in the same format as every other article. That keeps the documentation inside the pipeline, and the body serves as evidence of the approach. When the build changes, the archive stays reliable. If an idea cannot live inside Markdown with links and headings, I treat that as a design problem and fix the system until it can. The article body stays simple because it is the only place a human meets the work, so everything else can remain mechanical.
