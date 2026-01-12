---


title: "Blog Philosophy"
status: published
series: genesis
summary: "I outline the motivations and design instincts that shape the blog, from classic HTML to a minimal toolchain. The focus stays on legibility, accessibility, and a system that documents itself while it runs."
tags:
  - philosophy
  - web
---
# Blog Philosophy
_January 12, 2026_ | Series: genesis

I write this down early because it is the anchor I will keep returning to and the blog only works if it lets me publish day to day technical work without friction while AI drafts alongside me and I keep control of the final voice. That constraint is the condition that makes the rest of the system worth building.

The centre of it, for me, is the web itself. I keep coming back to classic HTML and the original web idea from Tim Berners-Lee. A document should read cleanly in source and still make sense without scripts, and a link should act as a stable address with no runtime dependency. I want this site to feel like the early web did when it was a network of human readable documents where the page is the page and the URL means what it says.

That stance forces decisions about durability and access. Accessibility and internationalisation are not optional if I want the site to last, so headings and landmarks must make sense to assistive tools and links must remain clear. Text and layout choices cannot collapse when language or fonts change, or when the reader never uses a mouse. Performance and cacheability live in the same layer. Pages need to load fast on slow networks and stay responsive on old devices.

Discoverability sits beside all of that, so clean URLs and meaningful titles should show their intent without JavaScript. Indexable pages should do the same work to show intent. SEO and AI visibility should follow from clear structure and plain metadata, without overlays or tricks. I will use unobtrusive JavaScript where it helps navigation, but I keep the baseline page intact with classic HTML as the foundation.

The tooling has to match that posture, so I favour a minimal toolchain and native JavaScript while keeping the feature scope tight. I will add theming and user settings only when they serve reading.

This spec should grow by addenda so the trail stays visible. I am writing the blog while building the blog, and that loop stays central. A philosophy should show in the site, and the site should reveal any drift.
Tags: philosophy, web
