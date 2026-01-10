---
title: "A Blog That Is Also the Build System"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
series: genesis
summary: "I keep the writing, scripts, and structure in one place so the site grows alongside its build path."
---

# A Blog That Is Also the Build System
*January 12, 2026* | Series: genesis | Tags: publishing, process, tooling, structure

I want the repository to be the blog, the build system, and the record of how the build system changes. That sounds neat as a concept, but it is also a practical choice. If I keep the content in a single place and put the scripts that shape it in the same place, I can read the whole system like a diary. The log of work becomes the work. The writing is part of the software that is taking shape.

This idea changes how I think about content. A post is a folder with a markdown file, assets next to it, and a small amount of metadata that makes indexing possible. The folder tree is the public rhythm of the blog. A date is a path. A month is a folder. A post is a leaf. I can point at the layout and show how the site thinks.

It also changes the role of automation. I rely on a handful of scripts that are obvious when I read them, because that makes the system legible to me and to the AI that maintains it. The scripts do the repetitive part. The repo does the permanent part. When the AI adds a script, it is an event in the diary. When the script changes, that change is itself content. The build system learns in public.

The same principle applies to templates. They are plain HTML and only stamp content into a page. Queries decide what exists, and those queries live beside the content they select. That is the heart of this approach. The data is visible, the selection is visible, and the render is visible. When I say that the blog is the build system, I mean that the entire path from idea to page is traceable inside one repository.

I am doing this because I want to write about building the blog while I build it. The first posts will be about the system that is learning to publish the posts. I am comfortable with that because I am treating the system as a living artifact. The repo is the journal. The journal is the site. The site is the build.
