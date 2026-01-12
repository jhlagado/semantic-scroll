---


title: "Why I'm Building This in Public"
status: published
series: genesis
summary: "Defends public writing as a decision tool and shows how it changes the repository. It offers concrete examples of decisions that moved from prose into code."
tags:
  - writing
  - ai
---
# Why I'm Building This in Public
_January 9, 2026_ | Series: genesis

I'm building this in public because writing details down changes how I think. When ideas stay private they remain vague and provisional. Writing for an imagined reader sharpens the ideas and shows the gaps as decisions harden on the page.

This repository is where I'm working decisions out and where those workings live. The notes and specs sit beside the code they shape, with half-decisions and revisions kept close by. They stay inside the process, present while I shape the code.

The writing is one of the tools I'm using to build the system. It affects the choices I make and keeps the work accountable because it has to be readable to someone besides me. One concrete example: when I wrote down the rule that templates should remain pure HTML, it stopped me from adding conditional logic in a rush. That single paragraph forced me to move selection into named queries and keep the rendering mechanical, which is now a fixed constraint in the build.

A central concern in the experiment is how AI fits into this. I want AI as a constrained collaborator with clear boundaries about authority and intent, along with what I allow to change. Those constraints preserve the shape of the work while still letting me use speed and advantage when they help. The blog that will appear here comes from the project and follows the same rules, so templates and queries show up alongside build scripts and deployment because the writing needs them. Another example came from tagging, where writing down the normalisation rule forced me to rename a handful of tags and rebuild the indexes so the archive stayed coherent and kept near-duplicates in one place. If you want the companion piece on pace and voice, read [Writing Fast Without Writing Sloppily](/content/blog/2026/01/09/03-writing-fast-without-writing-sloppily/).

I still work out my position, and I take my time with it. This is an attempt to think carefully and design slowly while leaving a readable trail behind. The trail should stand on its own, even if I am the only person who ever reads it end to end.

Tags: writing, ai
