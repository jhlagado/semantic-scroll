---
title: "Blog Philosophy"
status: published
tags:
  - philosophy
  - publishing
  - web
  - process
series: genesis
summary: "I outline the motivations and design instincts that shape the blog, from classic HTML to a minimal toolchain. The focus stays on legibility, accessibility, and a system that documents itself while it runs."
---

# Blog Philosophy
*January 12, 2026* | Series: genesis | Tags: philosophy, publishing, web, process

I write this down early because it is the anchor I will keep returning to. The blog only works if it lets me publish day to day technical work without friction, with AI drafting alongside me, and with me keeping control of the final voice. That constraint is the condition that makes the rest of the system worth building.

The middle of it, for me, is the web itself. I keep coming back to classic HTML and the original web idea from Tim Berners-Lee. A document should be legible without tooling, and a link should be a durable pointer, not a fragile runtime action. I want this site to feel like the early web did when it was a network of human readable documents, where the page is the page and the URL means what it says.

That stance forces decisions. Accessibility and internationalisation are not optional if I want the site to last. Headings, landmarks, and links have to make sense to assistive tools. Text and layout choices cannot collapse when the language changes, when the font changes, or when the reader never uses a mouse. Performance and cacheability live in the same layer. Pages need to load fast on slow networks and stay responsive on old devices.

Discoverability sits beside all of that. Clean URLs, meaningful titles, and indexable pages should show their intent without JavaScript. SEO and AI visibility should follow from clear structure and honest metadata, without overlays or tricks. I will use unobtrusive JavaScript where it helps navigation, but I keep the baseline page intact. Classic HTML stays the foundation.

The tooling has to match that posture. I favor a minimal toolchain and native JavaScript, and I keep the feature scope tight. I will add theming and user settings only when they serve reading.

This spec should grow by addenda so the trail stays visible. I am writing the blog while building the blog, and that loop stays central. An honest philosophy should show in the site, and the site will reveal any drift.
