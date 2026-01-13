---


title: "The Article Body"
status: published
series: contentstore
summary: "Explains why the body stays plain Markdown and readable on its own. It commits to a reader surface that survives even if the build disappears."
---
# The Article Body

Frontmatter defines an article for the build, but the body carries the meaning for readers. It is the section a reader actually meets, so I treat it as the record that must survive every build. Everything below the YAML block exists to be read, and that focus drives the format and the discipline. The body holds the text and keeps links and code beside the media, so the file stays readable before and after the build touches it.

Markdown keeps the text close to plain language. Paragraphs and headings read the same in a terminal or a diff viewer, so the file stays legible wherever it travels. That consistency lets me review drafts without leaving the file. That stability is why I keep the body in Markdown even as the rest of the system shifts. I begin the body with the title and sometimes a byline so the file stands on its own. Dates and tags sit in metadata blocks outside the prose. Sections use normal Markdown headings, which keeps the body free of page and layout syntax.

Layout lives in templates and the body stays focused on narrative structure. I add section breaks to serve the argument, and the template controls how headings appear on screen. Links point to published URLs and stay explicit in the prose, which keeps filesystem paths out of the body. Code blocks use fenced Markdown and avoid inline tooling because the code exists to be read. Syntax highlighting can happen in the browser when it helps.

Images and other assets live beside the article inside an `assets/` folder, so each entry carries its own attachments. There is no shared media pool, which keeps the archive legible on disk and makes a clone complete by default. It also keeps attribution and context close to the writing that references the files.

```
content/blog/2026/01/11/02-the-article-body/
  article.md
  assets/
    diagram.webp
    hero.jpg
```

The Markdown references assets by relative path so the entry stays self-contained when the folder moves. The build copies the `assets/` directory into the public tree and keeps the same structure in place, which keeps images working in indexes and on their own page. The source stays clean because the paths remain visible and easy to review.

```markdown
![Diagram of the content tree](./assets/diagram.webp "Content tree diagram")
```

The body avoids embedding logic and leaves lazy loading and presentation to templates, while the Markdown stays presentation-agnostic and media framing stays in the layout layer. That boundary keeps the writing stable, so I can edit a paragraph or add a code block without worrying about the rest of the system. The body remains a record, not a rendering script.

These posts describe the system that publishes them, and they do so in the same format as every other article. That keeps the documentation inside the pipeline, and the body serves as evidence of the approach. When the build changes, the archive stays reliable. If an idea cannot live inside Markdown with links and headings, I treat that as a design problem and fix the system until it can. The body is my promise to readers: it stays readable even if the build disappears.
