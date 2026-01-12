---
title: "Assets"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
  - assets
series: contentstore
summary: "Assets live beside the article that uses them, named in Markdown and resolved to absolute URLs at build time. Keeping files local to each entry makes moves safe and links stable."
---
# Assets
_January 11, 2026_ | Series: contentstore

An article rarely stands on text alone. Screenshots and diagrams sit beside photos and small media files within the same unit of work. In this system those files live beside the article that references them.

A typical article folder looks like this:

```
content/blog/2026/01/11/03-assets/
  article.md
  assets/
    tree-structure.webp
    hero.jpg
```

`article.md` holds the writing. Everything in `assets/` exists only to support that writing. There is no shared media pool and no global upload directory, so each article carries its own attachments.

The Markdown body names assets by relative path, and the build resolves those paths to absolute URLs anchored to the article permalink.

```markdown
![Tree structure diagram](./assets/tree-structure.webp "Tree structure diagram")
```

Because the image sits next to the file that references it, the source stays stable when the folder moves or the repository gets cloned. The build converts that source path into a permalink-safe URL so the same image works whether the article appears on its own page or inside an index.

Images serve different roles; some get promoted into indexes as thumbnails, while others appear inline as diagrams or screenshots. That distinction comes from frontmatter and templates, and the Markdown only names a file.

The same approach applies to any other asset, including animated images and small videos as well as data files or reference PDFs. The build copies the `assets/` folder into the output tree and preserves the on-disk structure while emitting absolute URLs in rendered HTML.

Nothing in the article body needs to know how the site will present an image because it only names a file. The template decides whether that file becomes responsive or lazy-loaded, and how it gets styled.

That boundary keeps the writing stable, so I can edit a paragraph or add a code block without worrying about the rest of the system even when I drop in a diagram. The file remains text with attachments and the build system turns it into a page.

The body stays clean because it has to. It is the place where all of this meets a human reader.

![Tree structure diagram](./assets/tree-structure.webp "Tree structure diagram")

Tags: publishing, process, tooling, structure, assets
