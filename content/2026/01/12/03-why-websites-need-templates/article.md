---


title: "Why Websites Need Templates"
status: published
series: templating
summary: "Shows how templates solve duplication and keep structure consistent across pages. It sets up the stamp model as the reason this series exists."
tags:
  - templating
---
# Why Websites Need Templates
By John Hardy

When I load a web page in a browser, what arrives is a single document. It might be long and include navigation plus footers and sidebars around a main column of text, but to the browser it is just one block of HTML.

When a site grows beyond a handful of pages, I am no longer writing one document but a whole set. Each page carries its own content, yet the structure repeats. The header and navigation stay consistent across the set. The footer and typography stay consistent, as does the layout.

If I were to copy that shared structure into every file, the site would be hard to maintain. A small change to the navigation or layout would require touching every page. Over time those copies drift, and the site becomes inconsistent. This is the practical problem templates exist to solve for me.

A template lets me write the shared structure once and reuse it. I define a common outer document with `<html>` and `<head>`, plus a shared header and navigation. The footer sits in the same frame, and I leave one or more places for page-specific content. Each article or page then supplies its own content, and the build places it into those slots.

In its simplest form, templating is just composition. A page is the result of taking some content and placing it inside a larger HTML frame. The content and the frame are separate files, but the output is a single document.

This separation matters because it lets me work on content and structure independently. I can write or revise an article without touching the site chrome. A change to the site chrome does not require me to rewrite the archive. The template system is what connects those two strands.

Once a site grows beyond a few pages, this quickly becomes essential. Without templates, I either duplicate markup everywhere or invent ad-hoc scripts to assemble pages. Templates are the conventional way to express that assembly.

This baseline matters because the rest of the series argues for a stricter, stamp-like approach to templates.

Where templates get more complicated is in how much responsibility I give them. Many systems ask templates to do more than place content into a frame. They ask templates to decide which pieces of content should appear and in what order, sometimes with conditions. That turns the template into a control layer with decisions baked in.

Whether that is a good idea depends on what I want from my publishing system. That is why I want templates to act as mechanical stamps that receive prepared content. I use the next piece to make that trade-off explicit.

In the next article I look at how that additional responsibility changes what templates are, and why it affects the clarity and predictability of the final HTML. If you want to continue, head to [Templates as Pure HTML](/content/2026/01/12/05-templates-as-pure-html/).
