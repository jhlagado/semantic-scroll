---


title: "Why I'm Building This in Public"
status: published
series: genesis
summary: "Explains why I build this in public and how writing reshapes the technical decisions. It also sets out how I keep pace without losing voice, using the prose-lint tool to catch drift."
tags:
  - writing
  - ai
  - automation
---
# Why I'm Building This in Public

I'm building this in public because writing details down changes how I think. When ideas stay private they remain vague and provisional. Writing for an imagined reader sharpens the ideas and shows the gaps as decisions harden on the page.

This repository is where I'm working decisions out and where those workings live. The notes and specs sit beside the code they shape, with half-decisions and revisions kept close by. They stay inside the process, present while I shape the code.

The writing is one of the tools I'm using to build the system. It affects the choices I make and keeps the work accountable because it has to be readable to someone besides me. One concrete example: when I wrote down the rule that templates should remain pure HTML, it stopped me from adding conditional logic in a rush. That single paragraph forced me to move selection into named queries and keep the rendering mechanical, which is now a fixed constraint in the build.

Speed matters to this experiment because the work happens in real time and the record only helps if I keep it current. That pace has a cost: it pulls me toward familiar phrasing and tidy scaffolding that drains the writing of its edge. I feel the slide when I announce a topic and leave the decision unstated, or when sentences line up into the same rhythm.

The `prose-lint` script is my counterweight. It catches scene-setting lines that do no work and contrast framing that drifts into narration. It also flags tidy lists that flatten nuance. One example I keep fixing is the empty opener. Draft: This section is about speed and quality in writing. Revision: I write fast to capture decisions while they are fresh. I then slow down to keep the voice intact. After the rewrite, I run another pass and keep the decision in front.

A central concern in the experiment is how AI fits into this. I want AI as a constrained collaborator with clear boundaries about authority and intent, along with what I allow to change. Those constraints preserve the shape of the work while still letting me use speed and advantage when they help. The blog that will appear here comes from the project and follows the same rules, so templates and queries show up alongside build scripts and deployment because the writing needs them. Another example came from tagging, where writing down the normalisation rule forced me to rename a handful of tags and rebuild the indexes so the archive stayed coherent and kept near-duplicates in one place.

I still work out my position, and I take my time with it. This is an attempt to think carefully and design slowly while leaving a readable trail behind. The trail should stand on its own, even if I am the only person who ever reads it end to end.
