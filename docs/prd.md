This document begins with a captured outline of the spec to preserve the original scope and sequencing before the expanded narrative.

---

```markdown
# AI-Driven Blogging Setup: Initial Spec Outline

## 1. Introduction
A brief vision of the project: a blog that’s both a documentation tool and a testbed for technical processes. It will be AI-first, accessibility-focused, and built with a classic web philosophy (semantic HTML, minimal JavaScript) in mind.

## 2. Design Foundations
- **Semantic HTML**: Emphasis on a clean, human- and machine-readable structure.
- **Accessibility**: Ensuring keyboard navigation, alt text, ARIA roles, and high contrast.
- **Minimal JavaScript**: Enhancements only where necessary, using native JS and no heavy frameworks.
- **Performance and SEO**: Fast-loading pages, optimized images, and search-friendly design.
- **Mobile-First Approach**: Starting design with mobile in mind and gracefully scaling up.

## 3. Content Creation Workflow
- **Conversational Drafting**: Posts start as a dialogue with the AI, determining title, tags, and status.
- **Folder-Based Output**: Each post results in a structured folder (date-based) with a markdown file, assets, and metadata.
- **Linking & Referencing**: Supports both internal and external links, with eventual enrichment via unobtrusive JavaScript.
- **Script Evolution**: Repetitive tasks evolve into reusable scripts stored in a `/scripts/` folder.
- **Pre-Publish Workflow**: Finalized posts are committed and pushed, triggering a CI pipeline that publishes to the `gh-pages` branch.

## 4. Draft Lifecycle
- Defined states: draft, review, published, archived.
- Unpublishing changes status only; no deletion.
- Metadata-driven visibility in indexes.

## 5. Metadata & Tagging Rules
- Frontmatter includes title, date, status, summary, and tags.
- Tags are case-insensitive and normalized.
- Tags are canonicalized to avoid duplicates.

## 6. Internal Linking Conventions
- Internal links use stable, relative paths.
- Forward references allowed; unresolved links are warnings, not errors.

## 7. Asset Management
- Assets live in the same folder as the article.
- Assets are durable and not auto-deleted.
- Reuse is manual; no automatic promotion to shared assets.

## 8. Review Gate
- A lightweight check before publishing to ensure accuracy and completeness.
- Human-driven with possible AI assistance (link checks, metadata completeness).

## 9. AI Vocabulary
- A small set of verbs (create, revise, tag, link, attach, status) to keep authoring consistent and eventually scriptable.

## 10. CI and Publishing Process
- Automated CI pipeline converts markdown to HTML and deploys to `gh-pages`.
- Publish trigger is a commit push (or PR merge) that updates the live site.

---

The outline above captures the baseline structure and themes that the expanded sections refine.
```

---

## 1. Introduction (Expanded)

In this section, we’re setting the stage for the entire project. The vision is to create a blog that serves two major purposes: first, it’s a comprehensive documentation tool for capturing technical processes, ideas, and experiences. Second, it acts as a testbed where we experiment with AI-driven content creation and classic web design principles.

The core philosophy of this blog is to embrace the original spirit of the web: clean, semantic HTML that’s easy for both humans and machines to read, minimal and unobtrusive JavaScript that enhances rather than overwhelms, and a strong focus on accessibility. We want the blog to be readable and navigable by everyone, including those using assistive technologies.

We’re also leaning into a mobile-first approach, ensuring the blog looks and works great on smaller screens before scaling up gracefully to larger ones. This sets the tone for the entire project: a timeless, user-friendly, and AI-assisted platform that showcases both your technical journey and the enduring values of the web.

Scope and audience are explicit: the primary reader is the author and technically curious peers who need a durable record of decisions. AI support is advisory; final edits, publication timing, and accountability remain with the human author.

## 2. Design Foundations (Expanded)

This section dives into the core principles that will shape the blog’s design and user experience. We’re focusing on four key pillars: semantic HTML, accessibility, minimal JavaScript, and a mobile-first approach.

**Semantic HTML** means structuring content with meaningful tags that clearly define the role of each part of the page. This not only makes the content easier for humans to understand but also helps search engines and assistive technologies interpret it accurately. We’re not just building pages; we’re creating a well-labeled, well-structured document that stands the test of time.

**Accessibility** is a non-negotiable priority. We’ll ensure that every page is fully navigable by keyboard, includes descriptive alt text for images, and leverages ARIA roles to improve screen reader support. We’ll also make sure our color choices meet accessibility standards for contrast, so the site is readable by everyone.

**Minimal JavaScript** doesn’t mean no JavaScript; it means using it sparingly and thoughtfully. We’ll enhance user experience with subtle improvements, like smoother page transitions or simple interactive elements, but we’ll avoid heavy frameworks or complex dependencies. The goal is to keep the site lightweight, fast, and easy to maintain.

Finally, our **mobile-first approach** ensures that the site is designed to look great on smaller screens first and then gracefully adapts to larger screens. This means we’ll start with a clean, readable layout on mobile devices and then expand to take advantage of larger screens without adding unnecessary complexity.

In short, this section is all about the foundational principles that will guide the design and ensure the blog is not just functional and accessible, but also timeless and user-friendly.

Accessibility should target WCAG 2.1 AA where applicable, with regular contrast checks and keyboard testing. Performance expectations should include a defined budget for total page weight and image sizes to keep initial loads fast on mobile connections.

## 3. Content Creation Workflow (Expanded)

This section breaks down how each blog post comes to life, from the initial conversation to the final published piece.

**Conversational Drafting** is at the heart of this workflow. Instead of starting with a blank page, you’ll have a dialogue with the AI. During this chat, the AI will help you figure out what the post is about, suggest a human-readable title, and identify relevant tags. It’ll also clarify the post’s status—whether it’s a draft, ready for review, or good to go live. Along the way, the AI will help you gather any necessary assets, like code snippets, images, or links, and figure out where they fit into the post.

Once you’ve got all that figured out, the AI will generate a **folder-based output**. Each post will live in its own date-based folder (like `/blog/YYYY/MM/DD/slug/`) and include a single markdown file along with any co-located assets like images or code. The markdown file will have embedded frontmatter metadata—things like the title, date, tags, summary, and status—so everything stays neatly organized and portable.

**Linking and referencing** are also built into this workflow. You’ll be able to add internal links to other posts using relative paths or shortcodes and include external links that the AI can help curate. Eventually, we might wrap these links in semantic tags or add unobtrusive JavaScript enhancements like tooltips, but the core idea is to keep linking straightforward and reliable.

Finally, the **script evolution** part means that repetitive tasks—like creating a new post, adding images, or linking related articles—will gradually become reusable scripts. These scripts will live in a dedicated folder, and over time, the AI will get better at handling these tasks automatically. That way, you can focus on the creative side while the AI takes care of the routine work.

Each post should follow a consistent naming scheme with lowercase slugs and hyphens, and assets should be named to match their use (for example, diagram-architecture.png). Frontmatter is required for every post to make indexing deterministic and tooling reliable.

## 4. Draft Lifecycle (Expanded)

In this section, we’ll dive deeper into how each article moves through its lifecycle, from the initial draft to its final published state (and beyond if needed). We’re defining a clear, metadata-driven workflow so that the status of each post is always transparent and easy to manage.

We’ve got four main states: **draft, review, published, and archived**. When you start writing, the post is in the draft state. It’s still being developed, so it’s not visible in any public indexes or listings. Once you’ve got a complete draft that you’re ready to refine, you move it to the review state. This is your chance to do final checks—maybe polish the language, confirm all the links are correct, and make sure all the necessary assets are in place.

When you’re happy with the review, you change the status to published. Now the post goes live and appears in all the public indexes, tag listings, and search results. It’s out there for everyone to see. But if at any point you decide you need to remove it from the public eye—maybe you’re updating it or it’s no longer relevant—you just change the status to archived. It’s still there in the repository, but it’s no longer in the public indexes. This way, you never have to delete anything; you just change its visibility by updating its metadata.

This metadata-driven approach makes it easy to see at a glance where each post stands in its lifecycle. It also means that “unpublishing” a post is as simple as flipping its status from published back to draft or archived, without having to delete or recreate anything.

This lifecycle gives clear, metadata-driven control over visibility from draft through publication and archival.

Status changes are reversible and should be captured through version control rather than a separate audit system. A post returning from archived to draft should re-enter review before publication.

## 5. Metadata & Tagging Rules (Expanded)

This section is all about the backbone of how we organize and categorize each piece of content—through metadata and tags. The metadata lives in the frontmatter of each markdown file and acts as the single source of truth for the blog’s organization. It includes fields like the title, date, status, summary, and tags. Each of these fields helps determine where and how the post appears across the site.

When it comes to **tags**, we’re taking a controlled and normalized approach. Tags are case-insensitive, which means it doesn’t matter if you write “Z80” or “z80”—they’ll be treated the same. We also ignore minor variations like hyphens or underscores, so “Z-80” and “Z_80” also get folded into the same tag. This helps keep our tagging system clean and prevents tag sprawl, where you end up with a bunch of near-duplicate tags that all mean the same thing.

We’ll choose a canonical form for each tag—typically all lowercase and free of punctuation—and the system will automatically normalize any variations to that canonical form. That way, you don’t have to worry about remembering the exact format of each tag; you can just write naturally, and the system will handle the rest.

In short, the metadata and tagging rules are here to keep everything organized and consistent. The metadata drives the visibility and categorization of each post, and the tagging rules ensure that your tags remain meaningful and easy to manage over time.

Define whether `date` reflects creation or publication; if both are needed, add `created` and `published` fields rather than overloading a single value. Summaries should be short and factual to support index pages and previews.

## 6. Internal Linking Conventions (Expanded)

In this section, we’ll outline how internal links are handled to ensure that your blog remains both navigable and resilient. Internal linking is all about connecting related posts and making it easy for readers to explore your content. We want to ensure that these links are stable and straightforward, and that they don’t break if you ever reorganize your content.

We’ll use **relative paths** for internal links, meaning that links will point to other posts based on their folder structure rather than hard-coded URLs. This makes the system more flexible. If you need to move or rename a post, you can update the link paths without breaking the overall structure.

We’ll also allow **forward references**, which means you can create links to posts that haven’t been written yet. This is especially useful when you’re planning a series of related posts and want to link them together in advance. If a forward reference doesn’t resolve right away, that’s okay—it will just be a warning rather than an error. The link will become active as soon as the target post is created.

Overall, the goal is to keep internal linking intuitive and robust. By using a consistent linking convention and allowing for flexible references, we make it easy to maintain a well-connected and easy-to-navigate blog as it grows.

Internal links should be validated during CI; unresolved references are warnings in development and can be promoted to errors only when they would ship broken navigation. External links should include descriptive context to avoid empty or ambiguous anchor text.

## 7. Asset Management (Expanded)

In this section, we’ll dive into how we handle assets—like images, code snippets, PDFs, and other media—so that they’re easy to manage and reuse. Our approach is to keep assets close to the articles they belong to, ensuring that everything related to a post is self-contained.

**Co-located assets** mean that each article’s images and other media live right alongside its markdown file in the same folder. This makes it easy to keep track of which assets belong to which post, and it ensures that all the references in the markdown file are relative and easy to maintain. If you ever need to move or archive a post, you can just move the entire folder, and all its assets will come along for the ride.

We also treat assets as **durable and reusable**. Once an asset is added to a post, it’s never automatically deleted or removed. If you want to reuse an image or a diagram in another article, you can simply reference it from the original folder or copy it into the new article’s folder. We’re avoiding any kind of automatic asset cleanup or deduplication so that you always have full control over your media.

In the future, if you find that certain assets are used frequently across multiple articles, you can choose to move them to a shared location. But this is always a manual, intentional decision rather than an automatic process. We’re prioritizing simplicity and clarity, ensuring that each article remains self-contained by default.

The asset model prioritizes organization, durability, and portability by co-locating assets with their articles and avoiding automatic deletion.

Assets should be optimized before commit (compressed images, trimmed PDFs), and every image should include accessible alt text in the markdown. Asset paths should remain relative so posts stay portable across environments.

## 8. Review Gate (Expanded)

In this section, we’ll flesh out the idea of the review gate—the final checkpoint before a post goes from “review” to “published.” The review gate is not about creating bureaucratic hurdles; it’s about ensuring quality and consistency before a post goes live.

At this stage, you or the AI will do a final pass over the content to make sure everything is in order. You’ll confirm that the summary accurately reflects the article, that all internal and external links are valid, and that any images or other assets are properly included. This is also a good time to double-check the metadata—things like tags and statuses—to make sure everything is correct and complete.

The review gate is intended to be a lightweight, human-friendly process. It can be as simple as running through a quick checklist or having the AI provide a brief summary of what’s been verified. The key is to ensure that the post is polished and ready for public viewing without adding unnecessary complexity.

The review gate is a lightweight final check that protects quality before publication.

The review step should verify factual accuracy, link integrity, and metadata completeness, and confirm that the summary and title match the content. A short sign-off note in the commit message can document the review pass.

## 9. AI Vocabulary (Expanded)

This section is all about the common language you and the AI will use to make content creation smooth and intuitive. We’ve defined a minimal set of verbs—like create, revise, tag, link, attach, and status—that let you communicate your intentions clearly and consistently.

The idea is that each of these verbs represents a simple, well-defined action that the AI can understand and eventually turn into reusable scripts. For example, when you say “create,” the AI knows to start a new article with a given title and initial metadata. When you say “revise,” it knows to update the content of an existing draft without changing its status.

Over time, these verbs will form the basis of a shared vocabulary that makes it easy to collaborate with the AI. The goal is to keep things simple and avoid the need for complicated commands or jargon. As you get more comfortable with these verbs, the AI can start to automate repetitive tasks and streamline the workflow even further.

In short, the AI vocabulary is the bridge between conversational authoring and automated scripting. It gives you a consistent, easy-to-use set of tools to direct the AI and ensures that the system remains flexible and user-friendly as it evolves.

Verbs should map to deterministic actions: create generates a folder and stub, revise edits content without status changes, and status updates only metadata. The vocabulary should remain stable so scripts can depend on it.

## 10. CI and Publishing Process (Expanded)

In this final section, we’re going to expand on how the continuous integration (CI) pipeline and publishing process will work. The CI pipeline is like the behind-the-scenes engine that takes your markdown files and turns them into a fully functional website.

Here’s how it works: whenever you push a new commit or merge a pull request, the CI pipeline automatically kicks in. It grabs the latest markdown files, converts them into HTML using your templates, and assembles the entire site into a build directory. That build directory is then deployed to the `gh-pages` branch, which is the branch that GitHub Pages uses to serve your site to the public.

Along the way, the CI pipeline can also handle things like regenerating indexes, copying assets, and checking for any obvious issues (like missing metadata or unresolved links). These checks are mostly informational and won’t block the publishing process unless there’s a critical error. The idea is to automate as much of the workflow as possible so that publishing a new post is as simple as pushing a commit.

The CI pipeline automates markdown conversion, deployment, and basic validation to reduce manual publishing effort.

CI should run in a clean environment with pinned tool versions to keep output stable. Build artifacts should be reproducible and stored in the gh-pages branch without manual edits.

## 10. CI and Publishing Process (Revisited and Expanded)

This subsection makes the CI pipeline concrete by detailing markdown conversion, templates, and index generation.

### Toolchain Philosophy

We want to keep the toolchain lean and avoid unnecessary dependencies. That means relying on a few lightweight, third-party tools where they make sense, but having the AI generate custom scripts (in Python or JavaScript) for the specific tasks we need. The idea is to minimize the overhead and keep everything as simple and maintainable as possible.

### Markdown to HTML Conversion

The core of the process is taking each markdown file and converting it into an HTML page. We’ll use a set of HTML templates that define the overall structure of the site—things like the layout of an individual article page, the design of index pages that list articles by tag or date, and any other common elements like headers and footers.

Each markdown file will be processed to extract its content and metadata, and then merged with the appropriate template to generate a complete HTML page. We’ll also apply CSS to ensure that the final pages look polished and consistent. The result is a set of static HTML files that can be served directly by GitHub Pages.

### Index and Summary Pages

In addition to individual article pages, the CI process will also generate index pages that list articles by tag, date, or other criteria. For example, we’ll have tag-based indexes that group articles by topic and date-based indexes that organize posts chronologically. Each of these summary pages will be automatically updated whenever new content is added, ensuring that your site’s navigation is always up-to-date.

### Minimal Toolchain, Maximum Flexibility

We’ll aim to write as many of these tools as possible in-house, with the AI generating the necessary scripts over time. This allows us to keep the process flexible and tailored to your needs, without being locked into a large, complex framework. The CI pipeline will orchestrate these tools, running the conversion process and deploying the final HTML to your GitHub Pages branch.

Template rendering should separate content from layout, and indexes should be generated from frontmatter rather than file system heuristics to avoid drift.

## 11. CSS and Styling (Expanded)

In this section, we’ll dive into the philosophy and practices that will shape the visual design of the blog. Our goal is to create a clean, responsive, and accessible design using a minimalist toolchain. We want to avoid heavyweight CSS frameworks and instead rely on native CSS features and best practices.

### Minimalist Toolchain

We’re going to keep the toolchain as simple as possible. That means no large frameworks like Tailwind; instead, we’ll use native CSS variables, flexbox, grid, and other modern CSS features. We can adopt a methodology like BEM (Block Element Modifier) to keep our styles organized and maintainable, ensuring that each component has a clear, consistent naming convention.

### Responsive and Mobile-First Design

Our design approach is mobile-first, meaning we’ll start by designing for smaller screens and then progressively enhance the layout for larger screens. We’ll use flexible grids and media queries to ensure that the site looks great on any device. The aesthetic will be clean and simple—think something along the lines of Medium’s minimalist approach, with a focus on readability. We’ll likely go for a classic, legible font on a white background, keeping the design timeless and user-friendly.

### User Preferences and Accessibility

We’ll also incorporate features that respect user preferences, such as offering both light and dark modes. Users will be able to switch between themes, and we’ll use CSS variables to manage color schemes so that it’s easy to maintain and expand. We’ll ensure high contrast options for accessibility, making the site comfortable to read for everyone.

### Performance and Clean Design

Our CSS will be optimized for performance, keeping file sizes small and load times fast. By using a mobile-first design and a minimalist approach, we’ll ensure that the site is not only aesthetically pleasing but also quick and responsive. We’ll avoid clutter and unnecessary design elements, focusing on delivering a clean and elegant user experience.

Styling should define a typography scale, spacing rhythm, and a small set of tokens for color and layout to keep the UI consistent. The system should degrade gracefully if JavaScript is disabled.


## Conclusion

This setup provides a flexible platform for documenting technical work, supported by AI-assisted drafting, a streamlined publishing pipeline, and a lightweight, accessible design system.

This project isn’t just about building a blog; it’s about creating a testbed for new ideas and a showcase for a thoughtful, AI-assisted approach to content creation. With a focus on simplicity, maintainability, and user experience, we’re setting the stage for a blog that’s not only easy to manage but also a pleasure to read and explore.

In the end, this is about more than just blogging—it’s about capturing your unique perspective and sharing it with the world, all while leveraging the power of AI to make the process as seamless as possible.

A short roadmap can capture which pieces are immediate (content model, publishing pipeline) and which are iterative (automation scripts, design refinements). The concluding aim is a durable, maintainable system that remains readable and useful over time.

