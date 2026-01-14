# AI-Driven Blogging Setup: Product Requirements

This document defines the product requirements and operating principles for an AI-assisted technical diary and publishing system built on classic web values.

## Table of Contents

- [1. Introduction](#1-introduction)
- [2. Design Foundations](#2-design-foundations)
- [3. Content Creation Workflow](#3-content-creation-workflow)
- [4. Draft Lifecycle](#4-draft-lifecycle)
- [5. Metadata & Tagging Rules](#5-metadata--tagging-rules)
- [6. Internal Linking Conventions](#6-internal-linking-conventions)
- [7. Asset Management](#7-asset-management)
- [8. Review Gate](#8-review-gate)
- [9. AI Vocabulary](#9-ai-vocabulary)
- [10. CI and Publishing Process](#10-ci-and-publishing-process)
- [11. CI and Publishing Implementation Details](#11-ci-and-publishing-implementation-details)
- [12. CSS and Styling](#12-css-and-styling)
- [13. Explicit Non-Goals](#13-explicit-non-goals)
- [14. Execution Plan](#14-execution-plan)
- [15. Specifications Map](#15-specifications-map)
- [Conclusion](#conclusion)

## 1. Introduction

In this section, we’re setting the stage for the entire project. The vision is to create a blog that serves two major purposes: first, it’s a comprehensive documentation tool for capturing technical processes, ideas, and experiences. Second, it acts as a testbed where we experiment with AI-driven content creation and classic web design principles.

The core philosophy of this blog is to embrace the original spirit of the web: clean, semantic HTML that’s easy for both humans and machines to read, minimal and unobtrusive JavaScript that enhances rather than overwhelms, and a strong focus on accessibility. We want the blog to be readable and navigable by everyone, including those using assistive technologies.

We’re also leaning into a mobile-first approach, ensuring the blog looks and works great on smaller screens before scaling up gracefully to larger ones. This sets the tone for the entire project: a timeless, user-friendly, and AI-assisted platform that showcases both your technical journey and the enduring values of the web.

Scope and audience are explicit: the primary reader is the author and technically curious peers who need a durable record of decisions. AI support is advisory; final edits, publication timing, and accountability remain with the human author.

The blog also serves as a primary source for a broader content strategy. Material captured here in the form of a technical diary is intended to be repurposed for future media, including YouTube videos, Tiktoks, or longer-form books. This long-term purpose means that clarity, durable metadata, and stable URLs matter from day one, as these entries are intended to seed a broader content strategy that transcends the blog itself.

Ease of capture is critical. A post should be draftable in minutes, with the AI handling structure and presentation while the author supplies intent and raw material. The system should feel closer to narrating a workday than to running a publishing project.

The blog is also a technical diary. Posts should be easy to create on demand, often in the 500-word range, with enough structure to carry links, code, and images when needed. The aim is to document daily work in a way that remains useful later, both to the author and to readers who want a concise, high-quality view into the process.

The project is also an experiment in public voice and discoverability. It should be friendly to search engines and to other AI systems that ingest and summarise content, which means clarity, stable structure, and predictable metadata.

Quality should remain high even with rapid posting. Posts should read as deliberate and well-formed, not as rough dumps, while still keeping the barrier to capture low enough for daily use.

Freshness matters for the author’s momentum and for external visibility. The system should encourage a steady cadence without turning publishing into a chore.

Owning the domain is a non-negotiable requirement. The publishing stack can evolve, but DNS and canonical URLs should remain under the author's control to keep content portable. Over time, the system should support multiple subject series (for example, retrocomputing and Z80 work alongside modern AI tooling) without fragmenting the archive. Series live in frontmatter as a single, author-declared value so the archive can hold narrative arcs without rewriting tags.

Each section should read as a standalone piece that can be published with minimal rewriting when the build story goes live.

The first public content should document the build itself. This spec should translate into a narrative **series** that shows the decisions, tradeoffs, and implementation steps behind the blog.

This project is a deliberate trial of a new model of software development and content production. The repository is both the laboratory and the record, and the publishing system is expected to surface its own discoveries as they happen. The documentation process is the first subject, not a preface, and the earliest posts should show how the specs were shaped, how constraints were chosen, and why the system is being built this way.

The opening publishing arc should be ten or more posts written in the author's voice. It should start with the documentation process itself and the reasons this experiment exists, then move through the philosophy and technical choices that define it: classic web values, the stance on toolchains and dependencies, the approach to design, performance, and accessibility, and the story of CI and deployment to GitHub Pages built inside the same repo. The series is intentionally self-referential, using the system to explain itself as it evolves.

Everything needed to build, publish, and host the site lives here. CI, content, templates, and deployment are all part of the same artifact, and the output should point back to this repository as the canonical source.

Each section should read as a standalone piece that can be published with minimal rewriting when the build story goes live.

## 2. Design Foundations

This section dives into the core principles that will shape the blog’s design and user experience. We’re focusing on four key pillars: semantic HTML, accessibility, minimal JavaScript, and a mobile-first approach.

**Semantic HTML** means structuring content with meaningful tags that clearly define the role of each part of the page. This not only makes the content easier for humans to understand but also helps search engines and assistive technologies interpret it accurately. We’re not just building pages; we’re creating a well-labeled, well-structured document that stands the test of time.

**Accessibility** is a non-negotiable priority. We’ll ensure that every page is fully navigable by keyboard, includes descriptive alt text for images, and leverages ARIA roles to improve screen reader support. We’ll also make sure our colour choices meet accessibility standards for contrast, so the site is readable by everyone.

**Minimal JavaScript** doesn’t mean no JavaScript; it means using it sparingly and thoughtfully. We’ll enhance user experience with subtle improvements, like smoother page transitions or simple interactive elements, but we’ll avoid heavy frameworks or complex dependencies. The goal is to keep the site lightweight, fast, and easy to maintain.

Finally, our **mobile-first approach** ensures that the site is designed to look great on smaller screens first and then gracefully adapts to larger screens. This means we’ll start with a clean, readable layout on mobile devices and then expand to take advantage of larger screens without adding unnecessary complexity.

A key UX goal is **Smooth Navigation Transitions**. Conventional blogs often suffer from "undisciplined navigation flashes" during page loads. We aim to mitigate this by using the History API and XHR/Fetch to create a seamless, SPA-like experience for internal navigation while remaining a strictly static site at its core. This mitigated "navigation flicker" brings the responsiveness users expect from modern apps back to the static document, proving that classic web values can deliver a premium experience without the overhead of heavy client-side state management.

This behaviour is strictly optional progressive enhancement. If JavaScript is disabled or the enhancement fails, standard link navigation should remain the default and should not feel broken or degraded.

In short, this section is all about the foundational principles that will guide the design and ensure the blog is not just functional and accessible, but also timeless and user-friendly.

Search visibility should be a first-order concern. Pages should include clear headings, descriptive titles, stable URLs, and metadata that enable search engines and other AI systems to interpret the content without guessing.

Accessibility should target WCAG 2.1 AA where applicable, with regular contrast checks and keyboard testing. Performance expectations should include a defined budget for total page weight and image sizes to keep initial loads fast on mobile connections.

The site should reflect the classic, server-rendered web. HTML should be legible without JavaScript, URLs should remain stable and human-readable, and CSS should improve readability rather than compete with the content.

This document is written to brief an AI while remaining readable as a narrative. Each section should stand on its own as a potential future blog post, with a linear flow from principles to implementation so the process can be published as a **series** without heavy rewriting.

## 3. Content Creation Workflow

This section breaks down how each blog post comes to life, from the initial conversation to the final published piece.

**Conversational Drafting** is at the heart of this workflow. Instead of starting with a blank page, you’ll have a dialogue with the AI. During this chat, the AI will help you figure out what the post is about, suggest a human-readable title, and identify relevant tags. It’ll also clarify the post’s status—whether it’s a draft, ready for review, or good to go live. Along the way, the AI will help you gather any necessary assets, like code snippets, images, or links, and figure out where they fit into the post.

Once you’ve got all that figured out, the AI will generate a **folder-based output**. Each post will live in its own date-based folder (like `/content/<contentDir>/YYYY/MM/DD/NN-slug/`, defaulting to `/content/example/` in this repo) and include a single markdown file plus an optional `assets/` subfolder for images, code, or media. The markdown file will have embedded frontmatter metadata for status, tags, title, optional summary, and optional thumbnail so index views are consistent while full article titles remain authored in the body and dates are rendered in the article metadata header.

**Linking and referencing** are also built into this workflow. You’ll be able to add internal links to other posts using relative paths or shortcodes and include external links that the AI can help curate. Eventually, we might wrap these links in semantic tags or add unobtrusive JavaScript enhancements like tooltips, but the core idea is to keep linking straightforward and reliable.

Finally, the **script evolution** part means that repetitive tasks—like creating a new post, adding images, or linking related articles—will gradually become reusable scripts. These scripts will live in a dedicated folder, and over time, the AI will get better at handling these tasks automatically. That way, you can focus on the creative side while the AI takes care of the routine work.

Each post should follow a consistent naming scheme with lowercase slugs and hyphens, and assets should be named to match their use (for example, diagram-architecture.png). Frontmatter is required for every post to make indexing deterministic and tooling reliable.

The workflow should support a simple instruction-driven path: specify a topic, supply references or asset paths, and let the AI draft a complete post that can be reviewed in one pass. Editing levels should range from a quick polish to a full revision, but the default experience should be fast enough to keep a daily cadence.

The system should also support capture-first writing, where a rough note or dictated outline is expanded into a structured post. This keeps the barrier to entry low while preserving the ability to refine tone and depth later.

Prompts should accept explicit parameters such as target length, required links, and optional image generation, so the AI can produce consistent output without repeated manual guidance.

Posts should support code snippets as first-class content. Snippets should live in fenced code blocks with language identifiers where possible, remain copyable without client-side tooling, and stay readable in plain HTML. If a snippet is large or likely to be reused, it should be stored as a separate file in the post folder and referenced explicitly from the markdown.

The drafting flow should accept asset paths and image requests up front. If the author provides images, the AI should place and caption them; if images are requested, the AI should either generate them or leave explicit placeholders with filenames so the author can fill them later. Thumbnails, when used, should be stored in the article’s `assets/` folder and referenced in frontmatter for indexing or feeds. If a thumbnail must appear inside the article body, it must be authored in Markdown like any other figure.

## 4. Draft Lifecycle

In this section, we’ll dive deeper into how each article moves through its lifecycle, from the initial draft to its final published state (and beyond if needed). We’re defining a clear, metadata-driven workflow so that the status of each post is always transparent and easy to manage.

We’ve got four main states: **draft, review, published, and archived**. When you start writing, the post is in the draft state. It’s still being developed, so it’s not visible in any public indexes or listings. Once you’ve got a complete draft that you’re ready to refine, you move it to the review state. This is your chance to do final checks—maybe polish the language, confirm all the links are correct, and make sure all the necessary assets are in place.

When you’re happy with the review, you change the status to published. Now the post goes live and appears in all the public indexes, tag listings, and search results. It’s out there for everyone to see. If at any point you decide you need to remove it from the public eye—maybe you’re updating it or it’s no longer relevant—you just change the status to archived. It’s still there in the repository, but it’s no longer in the public indexes. This way, you never have to delete anything; you just change its visibility by updating its metadata.

This metadata-driven approach makes it easy to see at a glance where each post stands in its lifecycle. It also means that “unpublishing” a post is as simple as flipping its status from published back to draft or archived, without having to delete or recreate anything.

This lifecycle gives clear, metadata-driven control over visibility from draft through publication and archival.

**Author-Only Versioning**: History belongs to the author, not the UI. We leverage Git for full historical traceability, but the public site presents only the final content. There are no reader-visible revision timelines or "last edited" badges unless explicitly authored.

Status changes are reversible and should be captured through version control rather than a separate audit system. A post returning from archived to draft should re-enter review before publication.

Not every entry needs to be public. Drafts can serve as private diary notes or raw material until they are ready for a wider audience, and the status system should preserve that intent without requiring duplicate content.

Scheduling can remain simple: publication should be triggered by status changes and commit history, not by separate scheduling tools. If a future scheduler is needed, it should be metadata-driven and compatible with static workflows.

## 5. Metadata & Tagging Rules

This section is all about the backbone of how we organise and categorize each piece of content—through metadata and tags. The metadata lives in the frontmatter of each markdown file and acts as the single source of truth for discovery and indexing. It includes fields like status, tags, title, optional summary, and optional thumbnail, while dates are derived from the filesystem and titles in the body remain free-form. The frontmatter title is for summary and index views and may differ from the body title. Title and summary support only minimal inline formatting (bold, italic, and links). Each of these fields helps determine where and how the post appears across the site.

When it comes to **tags**, we’re taking a controlled and normalized approach. Tags are case-insensitive, which means it doesn’t matter if you write “Z80” or “z80”—they’ll be treated the same. We also ignore minor variations like hyphens or underscores, so “Z-80” and “Z_80” also get folded into the same tag. This helps keep our tagging system clean and prevents tag sprawl, where you end up with a bunch of near-duplicate tags that all mean the same thing.

We’ll choose a canonical form for each tag—typically all lowercase and free of punctuation—and the system will automatically normalize any variations to that canonical form. For example, `Z80`, `z-80`, and `z_80` should all collapse to the canonical `z80`. Normalization happens during the indexing process, allowing the author to use natural variations during drafting.

In short, the metadata and tagging rules are here to keep everything organised and consistent. The metadata drives the visibility and categorization of each post, and the tagging rules ensure that your tags remain meaningful and easy to manage over time.

**Metadata Blocks**: Templates remain "dumb," but full article pages include fixed metadata blocks above and below the Markdown body. These blocks render the date, permalink, series, and tags without requiring those values inside the body text. The body stays focused on the title, byline, and prose while still keeping metadata visible in consistent places.

**Filesystem Authority**: The folder hierarchy (`/content/<contentDir>/YYYY/MM/DD/NN-slug/`, default `content/example/` in this repo) is the definitive source of truth for an article's creation date and its unique identity. Every post is contained in an **Article Unit** (see [article-spec.md](article-spec.md)) which ensures that even multiple posts on the same day are sorted correctly by the mandatory `NN-` ordinal prefix. If an article is updated, it keeps its chronological relationship with the folder hierarchy. Frontmatter `date` fields should be avoided to prevent drift; the system derives all temporal metadata from the path itself.

`contentDir` can be overridden by `site-config.json`, but the date and ordinal structure remains unchanged inside the instance directory.

Dates are derived from the filesystem; the article header metadata block exposes the canonical date and permalink for readers. Summaries should be short and factual to support index pages and previews.

Tags and metadata should be rich enough to support multiple thematic tracks, from AI workflow experimentation to retrocomputing projects, while staying normalized and searchable. Over time, this metadata should also support reuse in other formats, such as compiling a **series** into a talk outline or grouping posts into a longer narrative.

Series are author-declared narrative arcs, with a single `series` value in frontmatter. Tags remain topical, and multiple series can coexist without splitting the site into separate systems. This keeps story order explicit while leaving topical discovery to tags.

If separate blogs are eventually needed, the system should allow a clean split without rewriting content or breaking URLs. The default, however, is a single domain with multiple series and clear tag boundaries.

Tag vocabulary should be curated over time. When new tags are introduced, they should either map to existing canonical tags or be added deliberately, so that long-term archives remain coherent and searchable. During drafting, the AI Agent is responsible for normalizing tags in frontmatter so the visible metadata blocks remain consistent with the searchable index.

## 6. Internal Linking Conventions

In this section, we’ll outline how internal links are handled to ensure that your blog remains both navigable and resilient. Internal linking is all about connecting related posts and making it easy for readers to explore your content. We want to ensure that these links are stable and straightforward, and that they don’t break if you ever reorganize your content.

We’ll use **relative paths** for internal links, meaning that links will point to other posts based on their folder structure rather than hard-coded URLs. This makes the system more flexible. If you need to move or rename a post, you can update the link paths without breaking the overall structure.

We’ll also allow **forward references**, which means you can create links to posts that haven’t been written yet. This is especially useful when you’re planning a **series** of related posts and want to link them together in advance. If a forward reference doesn’t resolve right away, that’s okay—it will just be a warning rather than an error. The link will become active as soon as the target post is created. This supports exploratory writing without being constrained by what has already been published.

Overall, the goal is to keep internal linking intuitive and robust. By using a consistent linking convention and allowing for flexible references, we make it easy to maintain a well-connected and easy-to-navigate blog as it grows.

Internal links should be validated during CI; unresolved references are warnings in development and can be promoted to errors only when they would ship broken navigation. External links should include descriptive context to avoid empty or ambiguous anchor text.

Archives should be easy to browse by year and month, with tag pages and topic indexes that let the author trawl back through time without relying on full-text search. A simple search experience can be client-side and optional, but it should be fast, lightweight, and optional so the site remains usable without JavaScript.

Slugs and canonical URLs should be treated as durable identifiers. If a title changes, the slug should only change when there is a deliberate migration plan, and any redirects should be documented so the archive does not fragment.

## 7. Asset Management

In this section, we’ll dive into how we handle assets—like images, code snippets, PDFs, and other media—so that they’re easy to manage and reuse. Our approach is to keep assets close to the articles they belong to, ensuring that everything related to a post is self-contained.

**Co-located assets** mean that each article’s images and other media live in an `assets/` subfolder within the article directory. This keeps the article root clean and makes it easy to keep track of which files belong to which post, while keeping source references simple and stable. If you ever need to move or archive a post, you can move the entire folder and its assets together.

We also treat assets as **durable and reusable**. Once an asset is added to a post, it’s never automatically deleted or removed. If you want to reuse an image or a diagram in another article, you can simply reference it from the original folder or copy it into the new article’s folder. We’re avoiding any kind of automatic asset cleanup or deduplication so that you always have full control over your media.

In the future, if you find that certain assets are used frequently across multiple articles, you can choose to move them to a shared location. This remains a manual, intentional decision rather than an automatic process. We’re prioritising simplicity and clarity, ensuring that each article remains self-contained by default. This maintains **narrative locality** and prevents hidden coupling between articles where an update to a shared asset inadvertently breaks multiple historical posts.

The asset model prioritises organization, durability, and portability by co-locating assets with their articles and avoiding automatic deletion.

Assets should be optimised before commit (compressed images, trimmed PDFs), and every image should include accessible alt text in the markdown. Asset paths in source remain relative so posts stay portable. The build resolves them to absolute URLs in rendered HTML.

AI-generated images are allowed but should be explicitly named and stored in the article’s `assets/` folder with clear filenames. If generation metadata or prompts are kept, they should live alongside the article in a separate file, not mixed into the assets folder.

Thumbnails are optional but supported. If used, they should be small, lightweight images intended for index views or social sharing, and they should be generated or selected deliberately rather than inferred automatically. Thumbnails may be referenced in frontmatter for indexing or feeds, but any thumbnail that must be visible inside the article body must be authored in Markdown.

## 8. Review Gate

In this section, we’ll flesh out the idea of the review gate—the final checkpoint before a post goes from “review” to “published.” The review gate is not about creating bureaucratic hurdles; it’s about ensuring quality and consistency before a post goes live.

At this stage, you or the AI will do a final pass over the content to make sure everything is in order. You’ll confirm that the summary, when present, accurately reflects the article, that all internal and external links are valid, and that any images or other assets are properly included. This is also a good time to double-check the metadata—things like tags and statuses—to make sure everything is correct and complete.

The review gate is intended to be a lightweight, human-friendly process. It can be as simple as running through a quick checklist or having the AI provide a brief summary of what’s been verified. The key is to ensure that the post is polished and ready for public viewing without adding unnecessary complexity.

The review gate is a lightweight final check that protects quality before publication.

The review step should verify factual accuracy, link integrity, and metadata completeness, and confirm that the summary and title match the content. A short sign-off note in the commit message can document the review pass.

Review can be lightweight or deep depending on the post, but the default should be quick enough that publishing remains frictionless. When AI drafts are used, the review step is where tone, accuracy, and intent are confirmed.

## 9. AI Vocabulary

This section is all about the common language you and the AI will use to make content creation smooth and intuitive. We’ve defined a minimal set of verbs—like create, revise, tag, link, attach, and status—that let you communicate your intentions clearly and consistently.

The idea is that each of these verbs represents a simple, well-defined action that the AI can understand and eventually turn into reusable scripts. For example, when you say “create,” the AI knows to start a new article with a given title and initial metadata. When you say “revise,” it knows to update the content of an existing draft without changing its status.

Over time, these verbs will form the basis of a shared vocabulary that makes it easy to collaborate with the AI. The goal is to keep things simple and avoid the need for complicated commands or jargon. As you get more comfortable with these verbs, the AI can start to automate repetitive tasks and streamline the workflow even further.

In short, the AI vocabulary is the bridge between conversational authoring and automated scripting. It gives you a consistent, easy-to-use set of tools to direct the AI and ensures that the system remains flexible and user-friendly as it evolves.

Verbs should map to deterministic actions in prose and in tooling. Create generates a folder and stub, revise edits content without status changes, tag assigns or modifies normalized tags, link creates or adjusts internal or external links, attach copies or generates assets into the article’s `assets/` folder, status updates visibility metadata only, summarise refines the metadata summary field, find locates content by title, tag, date, or concept within the repo, and inspect provides read-only reporting on state such as metadata completeness or broken links.

The vocabulary should remain stable so scripts can depend on it.

These verbs should be usable from the command line or a minimal UI, so an instruction like "create a 500-word post with these links and images" can map cleanly to scripted behaviour without manual UI work.

## 10. CI and Publishing Process

In this final section, we’re going to expand on how the continuous integration (CI) pipeline and publishing process will work. The CI pipeline is like the behind-the-scenes engine that takes your markdown files and turns them into a fully functional website.

Here’s how it works: whenever you push a new commit or merge a pull request, the CI pipeline automatically kicks in. It grabs the latest markdown files, converts them into HTML using your templates, and assembles the entire site into a build directory. That build directory is then deployed to the `gh-pages` branch, which is the branch that GitHub Pages uses to serve your site to the public.

Along the way, the CI pipeline can also handle things like regenerating indexes, copying assets, and checking for any obvious issues (like missing metadata or unresolved links). These checks are mostly informational and won’t block the publishing process unless there’s a critical error. The idea is to automate as much of the workflow as possible so that publishing a new post is as simple as pushing a commit.

The CI pipeline automates markdown conversion, deployment, and basic validation to reduce manual publishing effort.

CI should run in a clean environment with pinned tool versions to keep output stable. Build artifacts should be reproducible and stored in the gh-pages branch without manual edits.

The canonical implementation is the static, query-driven pipeline defined in this PRD and the derived specs. WordPress may be used only as a short-term testbed or as a front-end generated from the same markdown source and honouring the same metadata and template separation; it must not become a parallel source of truth. If GitHub Pages is used, the pipeline should remain free and automated, with the option to bind a custom domain that the author owns.

Cost control matters. The default assumption is free or near-zero hosting and tooling, with paid services only if they bring clear, deliberate value. The existing WordPress blog can serve as a testbed while a static workflow is evaluated, and the existing resume site on GitHub Pages can be merged into the same repo or linked as a first-class section. Setup and publishing should be achievable from the command line using tools like `gh` and `wp-cli`, with UI workflows treated as optional rather than required.

Platform choice should be evaluated against concrete criteria: time to publish from a prompt, portability of content, ease of search and archives, and long-term cost of maintenance. If WordPress is used initially, the goal is still to keep content in markdown so migration to a static system remains straightforward.

The system must support archives by date, topic, and tag, and provide a simple search experience without requiring server-side infrastructure. If search is client-side, it should be lightweight and optional so the site remains usable without JavaScript.

Builds should be efficient, with incremental regeneration where possible so new posts do not require rebuilding the entire site. If a static generator is used, it should take advantage of caching or partial builds to keep iteration fast.

Differential publishing is a core expectation. The build should avoid reprocessing unchanged content wherever possible so the author can publish frequently without long build times.

## 11. CI and Publishing Implementation Details

This subsection makes the CI pipeline concrete by detailing markdown conversion, templates, and index generation.

### Toolchain Philosophy

We want to keep the toolchain lean and avoid unnecessary dependencies. That means relying on a few lightweight, third-party tools where they make sense, but having the AI generate custom scripts (in Python or JavaScript) for the specific tasks we need. The idea is to minimise the overhead and keep everything as simple and maintainable as possible.

### Markdown to HTML Conversion

The core of the process is taking each markdown file and converting it into an HTML page. We’ll use a set of HTML templates that define the overall structure of the site—things like the layout of an individual article page, the design of index pages that list articles by tag or date, and any other common elements like headers and footers.

Each markdown file will be processed to extract its content and metadata, and then merged with the appropriate template to generate a complete HTML page. We’ll also apply CSS to ensure that the final pages look polished and consistent. The result is a set of static HTML files that can be served directly by GitHub Pages.

### Index and Summary Pages

In addition to individual article pages, the CI process will also generate index pages that list articles by tag, date, or other criteria. For example, we’ll have tag-based indexes that group articles by topic and date-based indexes that organise posts chronologically. Each of these summary pages will be automatically updated whenever new content is added, ensuring that your site’s navigation is always up-to-date.

Summary and index pages should use a built-in summary renderer that draws from frontmatter and filesystem-derived fields, with a fixed HTML structure that remains stylable via CSS. Templates only select the view mode; they do not interpolate metadata directly.

### Minimal Toolchain, Maximum Flexibility

We’ll aim to write as many of these tools as possible in-house, with the AI generating the necessary scripts over time. This allows us to keep the process flexible and tailored to your needs, without being locked into a large, complex framework. The CI pipeline will orchestrate these tools, running the conversion process and deploying the final HTML to your GitHub Pages branch.

Template rendering should separate content from layout, and indexes should be generated from frontmatter plus filesystem-derived fields rather than ad hoc heuristics or filename inference.

This project should avoid heavy frameworks where simple scripts can suffice. If a static site generator is used, it should remain a thin layer, and if not, the AI can generate and maintain small Python or shell scripts for indexing, rendering, and deployment. The scripts should live in the repository so the workflow remains transparent and reproducible.

When tasks exceed simple shell scripts, Python is an acceptable default, but the scripts should remain small, readable, and focused on a single responsibility. The goal is to keep the toolchain approachable while still powerful enough for automation.

Each script should have a clearly documented entry point and an explicit input/output contract, even if that is only described in comments or a short README. Where possible, scripts should support a dry-run mode to keep automation safe and debuggable.

## 12. CSS and Styling

In this section, we’ll dive into the philosophy and practices that will shape the visual design of the blog. Our goal is to create a clean, responsive, and accessible design using a minimalist toolchain. We want to avoid heavyweight CSS frameworks and instead rely on native CSS features and best practices.

### Minimalist Toolchain

We’re going to keep the toolchain as simple as possible. That means no large frameworks like Tailwind; instead, we’ll use native CSS variables, flexbox, grid, and other modern CSS features. We can adopt a methodology like BEM (Block Element Modifier) to keep our styles organised and maintainable, ensuring that each component has a clear, consistent naming convention.

### Responsive and Mobile-First Design

Our design approach is mobile-first, meaning we’ll start by designing for smaller screens and then progressively enhance the layout for larger screens. We’ll use flexible grids and media queries to ensure that the site looks great on any device. The aesthetic will be clean and simple—think something along the lines of Medium’s minimalist approach, with a focus on readability. We’ll likely go for a classic, legible font on a white background, keeping the design timeless and user-friendly.

### User Preferences and Accessibility

We’ll also incorporate features that respect user preferences, such as offering both light and dark modes. Users will be able to switch between themes, and we’ll use CSS variables to manage colour schemes so that it’s easy to maintain and expand. We’ll ensure high contrast options for accessibility, making the site comfortable to read for everyone.

### Performance and Clean Design

Our CSS will be optimised for performance, keeping file sizes small and load times fast. By using a mobile-first design and a minimalist approach, we’ll ensure that the site is not only aesthetically pleasing but also quick and responsive. We’ll avoid clutter and unnecessary design elements, focusing on delivering a clean and elegant user experience.

Styling should define a typography scale, spacing rhythm, and a small set of tokens for colour and layout to keep the UI consistent. The system should degrade gracefully if JavaScript is disabled.

The visual design should reinforce the classic-web values in the content: fast loading, readable typography, durable layouts, and a sense that the site is authored rather than templated. The same system can support a resume section or other personal pages without breaking the editorial tone.

Branding should be minimal but intentional. A small set of type and colour tokens can carry the identity across the blog and resume without making the layout feel like a template, and print-friendly styling should keep the resume usable as a standalone document.

## 13. Explicit Non-Goals

To maintain focus and prevent dependency creep, the project explicitly avoids a CMS UI, live or direct database editing, reader-visible version history, strict link enforcement, and heavy build tooling. All authoring and management happens through conversation and CLI, the filesystem and Git remain the single source of truth, historical edits are for the author only, broken or forward links generate warnings rather than errors, and complex NPM-heavy frameworks such as Webpack or Tailwind are out of scope.

## 14. Execution Plan

The execution plan favors a fast proof of the end-to-end workflow, then deliberate refinement. Each phase should be complete enough to publish real posts and prove that the system works under daily use before expanding scope.

### Phase One: Content Model and Repository Foundations

Phase One locks the content model and repository structure. The frontmatter schema is finalized, slug and URL rules are fixed, status behaviour is proven, and the folder layout is chosen so posts and assets remain portable. Platform selection is decided using the criteria in this document, and domain ownership with canonical URLs is confirmed so future migrations do not break links.

### Phase Two: Minimum Viable Publishing Pipeline

Phase Two delivers a working pipeline that converts markdown to HTML, generates indexes, copies assets, and validates links. The build runs locally and in CI with pinned versions, and deploys deterministically to the chosen host. The goal is a repeatable build that can publish a post with minimal friction and no manual edits.

### Phase Three: Authoring and Review Automation

Once the machine of the publishing pipeline is proven in Phase Two, the focus shifts in Phase Three to the ergonomics of the author. Here, the AI vocabulary moves from concept to command, mapping our shared language to the CLI tools that will enable the rapid, narrative capture defined in our vision. The AI vocabulary maps to CLI commands that create posts, revise content, set status, and attach assets. Review checks for metadata completeness, link integrity, and summary accuracy become part of the pre-publish flow so quality remains consistent without slowing daily capture.

### Phase Four: Design, Accessibility, and Progressive Enhancement

Phase Four brings the visual system to its intended quality. Typography, spacing, and colour tokens are set; the resume section is integrated without breaking editorial tone; and accessibility and performance budgets are validated. Optional smooth navigation transitions are layered in only after baseline performance and HTML readability are solid.

### Phase Five: Content Rollout and Iteration

Phase Five scales real publishing. The initial build-log **series** is released, the daily diary cadence is tested, tags and series definitions are refined, and the system is tuned based on friction observed in actual use. This phase also defines how posts are repurposed into talks, videos, or longer-form writing so the workflow supports the broader content strategy.

## 15. Specifications Map

This PRD sets the intent; the implementation details are specified in the derived documents.

Frontmatter and status semantics are defined in [articles-frontmatter.md](articles-frontmatter.md). Tagging and series semantics are defined in [tagging.md](tagging.md). The Article Unit is defined in [article-spec.md](article-spec.md). Architectural invariants and the query-driven rendering model are defined in [queries.md](queries.md), with schema details in [queries-spec.md](queries-spec.md) and canonical query definitions in [queries-builtin.md](queries-builtin.md). Rendering and template rules are defined in [templating.md](templating.md) and [templating-conventions.md](templating-conventions.md), with the JavaScript boundary in [templating-javascript.md](templating-javascript.md). Styling rules and CSS constraints live in [styling.md](styling.md). Pipeline and CI rules live in [ci-pipeline.md](ci-pipeline.md). The execution guide and reference pseudocode are in [design-reference.md](design-reference.md).

## Conclusion

This setup provides a flexible platform for documenting technical work, supported by AI-assisted drafting, a streamlined publishing pipeline, and a lightweight, accessible design system.

This project isn’t just about building a blog; it’s about creating a testbed for new ideas and a showcase for a thoughtful, AI-assisted approach to content creation. With a focus on simplicity, maintainability, and user experience, we’re setting the stage for a blog that’s not only easy to manage but also a pleasure to read and explore.

In the end, this is about more than just blogging—it’s about capturing your unique perspective and sharing it with the world, all while leveraging the power of AI to make the process as seamless as possible.

A short roadmap can capture which pieces are immediate (content model, publishing pipeline) and which are iterative (automation scripts, design refinements). The concluding aim is a durable, maintainable system that remains readable and useful over time.

The first implementation should be intentionally simple so the publishing workflow can be proven quickly. From there, the system can evolve toward richer automation without losing the clarity of the content model.

Content from the blog should be easy to repurpose into talks, videos, and longer-form writing, which means structure and metadata are part of the creative output, not just technical overhead. The blog itself becomes the first case study in the process it documents.
