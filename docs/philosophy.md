# Blog Philosophy: Working Spec

I am starting this spec as a place to hold the motivations and shape of the blog. I will expand it as the system grows, and I want the first person voice to make the intent clear and traceable over time.

I begin with a need for a frictionless way to publish day to day technical work, with AI drafting and me keeping control. I weigh WordPress against a static site because I care about ownership, portability, and markdown first content. I am early in the decision, but I want a system that keeps momentum and does not pull me into a UI.

I start framing the blog as both a diary and a public voice, with room for different subject threads. I question heavy generators like Eleventy because the AI already writes scripts, so the build system can be small and bespoke. I move toward a repo that is both tool and artifact, with scripts and guidance living alongside content.

I decide to build the specification in sections so each part can become a future post. I articulate a core web philosophy around semantic HTML, accessibility, minimal JavaScript, and classic URLs. I agree that the spec should read linearly and can later be retold in first person as articles.

I keep coming back to classic HTML and the original web idea from Tim Berners-Lee. A document should be legible without tooling, and a link should be a durable pointer instead of a fragile runtime action. I want the site to feel like the early web did when it was a network of human readable documents, not a set of app shells.

I take accessibility and internationalisation seriously because a durable site has to be readable across time, devices, and languages. I want headings, landmarks, and links that make sense to assistive tools. I want text and layout choices that do not collapse when the language changes, when the font changes, or when a reader does not use a mouse.

I treat performance and cacheability as core design features. I want pages that load fast on slow networks and stay responsive on old devices. I want to publish assets in a way that makes caching predictable, so the site feels light even when the archive grows.

I treat discoverability as part of the craft. I want clean URLs, meaningful titles, and indexable pages that show their intent without JavaScript. I want SEO and AI visibility to follow from clear structure and honest metadata, not from overlays or tricks.

I outline design foundations around semantics, accessibility, and mobile first readability. I introduce unobtrusive JavaScript as navigation smoothing that keeps the app style impulse in check. I connect the idea of smooth transitions to reducing link friction without breaking the web, and I keep classic HTML as the baseline even when enhancements exist.

I ask for addenda in place of rewrites so the document stays modular as it grows. I emphasize a minimal toolchain, native JavaScript, and a bias against dependency sprawl. I add theme preferences and user settings as a styling concern while I keep the feature scope tight.

I shift toward data architecture and insist on a clean, date based folder tree. I separate date based posts from evergreen material like resumes or reference pages. I decide that each article should live in its own folder with its assets nearby.

I move to indexing and explain why tags cut across a strict taxonomy. I add featured as a taglike flag and ask for metadata summaries to power indexes. I see indexing as the main path to discovery alongside chronological navigation.

I move into publishing, describing HTML templates and a deterministic build step. I align the build output with a gh-pages branch so deployment stays mechanical. I ask for CI as the place to automate the build and publish flow.

I push back on heavy tools and keep the plan minimal, scriptable, and inspectable. I loop back to the outline to see which sections still need to be written. I decide the next discussion should focus on the content creation workflow.
