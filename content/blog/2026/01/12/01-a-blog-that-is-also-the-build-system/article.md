---


title: "A Blog That Is Also the Build System"
status: published
series: genesis
summary: "Sets out why the repository holds both the writing and the build so decisions stay traceable. It anchors that structure in classic web values and a minimal toolchain."
tags:
  - philosophy
  - web
  - tooling
---
# A Blog That Is Also the Build System

This blog only works if it lets me publish day to day technical work without friction, with AI drafting alongside me and me keeping control of the final voice. That constraint is the reason the rest of the system exists.

The web itself is the anchor for this project. I want documents that read cleanly in source and still make sense without scripts. Links should behave as stable addresses and stay clear of runtime actions. The site should feel like the early web did when a page was a page and a URL meant what it said.

That stance forces decisions about durability and access. Accessibility and internationalisation are core requirements because headings and landmarks have to make sense to assistive tools. Layout choices cannot collapse when language or fonts change, or when the reader never uses a mouse. Performance and cacheability sit in the same layer because pages have to load fast on slow networks and stay responsive on old devices.

Discoverability sits beside all of that and keeps the surface legible to crawlers. Clean URLs and clear titles should show intent without JavaScript. Indexable pages should do the same work. I use unobtrusive JavaScript where it helps navigation, but the baseline page remains intact with classic HTML as the foundation.

The tooling has to match the posture, so I keep the toolchain small and inspectable. I add theming and user settings only when they serve reading, and I leave the rest out.

The repository is the blog and the build system, with the record of how the build changes kept in the same place. A post is a folder with a Markdown file and nearby assets, plus a small amount of metadata that makes indexing possible. The folder tree is the public rhythm of the blog. Dates become paths and months become folders, so each post sits as a leaf in the tree. I can point at the layout and show how the site thinks.

Automation has a narrower role here and stays focused on repetition. I rely on a handful of scripts that are obvious when I read them, because that keeps the system legible to me and to the AI that helps maintain it. The scripts handle repetition and the repo holds the permanent record. When the AI adds a script, it becomes an event in the diary and the change itself becomes content.

Templates are plain HTML and only stamp content into a page. Queries decide what exists, and those queries live beside the content they select. That is the heart of this approach. The data stays visible and the selection stays visible. The render stays visible once the build runs. When I say the blog is the build system, I mean the path from idea to page is traceable inside one repository.

Pick any entry and follow its folder path to trace the decision trail that produced it. If I drop these constraints, the archive loses its promise and the project fails its own test.
