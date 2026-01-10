---
title: "Assets"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
  - assets
series: content-store
summary: "Assets live beside the article that uses them, named in Markdown and resolved to absolute URLs at build time."
---

# Assets
*January 11, 2026* | Series: content-store | Tags: publishing, process, tooling, structure, assets

An article rarely stands on text alone. Screenshots, diagrams, photos, and small media files belong to the same unit of work. In this system those files live beside the article that references them.

A typical article folder looks like this:

```
content/blog/2026/01/11/03-assets/
  article.md
  assets/
    tree-structure.webp
    hero.jpg
```

`article.md` holds the writing. Everything in `assets/` exists only to support that writing. There is no shared media pool and no global upload directory. Each article carries its own attachments.

The Markdown body names assets by relative path, and the build resolves those paths to absolute URLs anchored to the article permalink:

```markdown
![Tree structure diagram](./assets/tree-structure.webp "Tree structure diagram")
```

Because the image sits next to the file that references it, the source stays stable when the folder moves or the repository gets cloned. The build converts that source path into a permalink-safe URL so the same image works whether the article appears on its own page or inside an index.

Images serve different roles. Some get promoted into indexes as thumbnails. Some appear inline as diagrams or screenshots. That distinction comes from frontmatter and templates. The Markdown only names a file.

The same approach applies to any other asset. Animated images, small videos, data files, or reference PDFs sit beside the article that uses them. The build copies the `assets/` folder into the output tree and preserves the on-disk structure while emitting absolute URLs in rendered HTML.

Nothing in the article body needs to know how the site will present an image. It names a file. The template decides whether that file becomes responsive, lazy-loaded, or styled in a particular way.

That boundary keeps the writing stable. I can edit a paragraph, add a code block, or drop in a diagram without worrying about the rest of the system. The file remains text with attachments. The build system turns it into a page.

The body stays clean because it has to. It is the place where all of this meets a human reader.

![Tree structure diagram](./assets/tree-structure.webp "Tree structure diagram")
