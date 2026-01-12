---
title: "A Blog That Is Also the Build System"
status: published
tags:
  - publishing
  - process
  - tooling
  - structure
series: genesis
summary: "I keep writing and scripts in one place so the site grows alongside its build path. The repository becomes the diary where tooling changes show up as entries in the record."
---
# A Blog That Is Also the Build System
_January 12, 2026_ | Series: genesis

I built the repository to be the blog and the build system with the record of how the build changes kept in the same place. That sounds neat as a concept, but it is also a practical choice. If I keep the content in a single place and put the scripts that shape it in the same place, I can read the whole system like a diary where the log of work becomes the work and the writing lives inside the software taking shape.

This idea changes how I think about content. A post is a folder with a markdown file and nearby assets, plus a small amount of metadata that makes indexing possible. The folder tree is the public rhythm of the blog. Dates become paths and months become folders, so each post sits as a leaf in the tree. I can point at the layout and show how the site thinks.

It also changes the role of automation. I rely on a handful of scripts that are obvious when I read them, because that makes the system legible to me and to the AI that maintains it. The scripts handle repetition, and the repo holds the permanent record. When the AI adds a script, it becomes an event in the diary and the change itself becomes content so the build system learns in public.

The same principle applies to templates, which are plain HTML and only stamp content into a page. Queries decide what exists, and those queries live beside the content they select. That is the heart of this approach. The data and selection stay visible, and the render stays visible too. When I say that the blog is the build system, I mean that the entire path from idea to page is traceable inside one repository.

I do this because I want to write about building the blog while I build it. The first posts will be about the system that is learning to publish the posts. I am comfortable with that because I treat the system as a living artifact. The repo is the journal, which becomes the site and the build.

Tags: publishing, process, tooling, structure
