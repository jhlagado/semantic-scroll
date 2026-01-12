---


title: "Why Websites Need Templates"
status: published
series: templating
summary: "I lay out why templates exist and why separating content from layout keeps a site coherent. Repeated headers and footers make the case for composition without duplication."
tags:
  - templating
---
# Why Websites Need Templates
_January 12, 2026_ | Series: templating

When I load a web page in a browser, what arrives is a single document. It might be long and include navigation plus footers and sidebars around a main column of text, but to the browser it is just one block of HTML.

When I run a site with more than a handful of pages, however, I am not authoring one document. I am authoring many pages, not just one. Each page has its own content, but the structure repeats. The header and navigation repeat, and the footer and typography repeat along with the layout.

If I were to copy that shared structure into every file, the site would be hard to maintain. A small change to the navigation or layout would require touching every page. Over time those copies drift, and the site becomes inconsistent. This is the practical problem templates exist to solve for me.

A template lets me write the shared structure once and reuse it. I define a common outer document with `<html>` and `<head>`, plus a shared header and navigation. The footer sits in the same frame, and I leave one or more places for page-specific content. Each article or page then supplies its own content, and the build places it into those slots.

In its simplest form, templating is just composition. A page is the result of taking some content and placing it inside a larger HTML frame. The content and the frame are separate files, but the output is a single document.

This separation matters because it lets me work on content and structure independently. I can write or revise an article without touching the site chrome. A change to the site chrome does not require me to rewrite the archive. The template system is what connects those two strands.

Once a site grows beyond a few pages, this quickly becomes essential. Without templates, I either duplicate markup everywhere or invent ad-hoc scripts to assemble pages. Templates are the conventional way to express that assembly.

Where templates get more complicated is in how much responsibility I give them. Many systems ask templates to do more than place content into a frame. They ask templates to decide which pieces of content should appear and in what order, sometimes with conditions. That turns the template into a control layer with decisions baked in.

Whether that is a good idea depends on what I want from my publishing system. I use the next piece to make that trade-off explicit.

In the next article I look at how that additional responsibility changes what templates are, and why it affects the clarity and predictability of the final HTML. If you want to continue, head to [When Templates Start Making Decisions](/content/blog/2026/01/12/04-when-templates-start-making-decisions/).

Tags: templating