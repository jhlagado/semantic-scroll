---
title: "Templates as Mechanical Stamps"
status: published
tags:
  - templating
  - publishing
  - process
  - tooling
series: templating
summary: "Templates hold structure and nothing else, so queries select content and the build stamps it into place. A short caption line turns listings into semantic figures without raw HTML."
---
# Templates as Mechanical Stamps
_January 12, 2026_ | Series: templating

I keep templates from deciding what content exists so the build pipeline and the query layer take on that responsibility. If you missed the earlier pieces, start with [Why Websites Need Templates](/content/blog/2026/01/12/03-why-websites-need-templates/) and [When Templates Start Making Decisions](/content/blog/2026/01/12/04-when-templates-start-making-decisions/).

Before the build touches any template, it walks the filesystem and reads frontmatter to construct an index of all available articles. Queries apply to that index to produce explicit, ordered lists of article records. Each query has a name, and that name refers to a specific deterministic result set.

By the time a template enters the pipeline, the interesting work is already complete. It receives the result of a query with a list of article records that already sit in the correct order, whether the list is empty or not.

That is what lets templates stay simple. It keeps the scope small when I need to debug.

A template contains ordinary HTML and one or more `<template>` tags that act as render slots. Each slot names a query so the build knows what to stamp. At build time, the system takes the results of that query and stamps the corresponding content into the slot. If the query returned nothing, the system uses the fallback HTML inside the `<template>` tag instead. After stamping, the build removes the `<template>` tag itself, leaving only normal HTML behind.

Because of this, a template never needs conditionals or loops. It never needs to know how many articles exist or whether a tag is empty, and it does not decide ordering. The build resolves all of that earlier. The template defines where the stamped output should appear and what should show up when there is nothing to stamp.

This turns templating into a mechanical operation. Given the same set of article records and the same queries, the same templates will always produce the same HTML. There is no hidden state and no branching behaviour inside the template files themselves.

It also makes the templates readable in a way that is hard to achieve in more conventional systems. When I open one, I see the page structure as it will exist in the final output. I see the header and navigation, then the main content with its fallback messages for empty sections. There is no embedded logic to mentally execute. The only dynamic pieces are clearly marked as slots.

That is what I mean by calling the system boring. I want the boring sections to stay readable, not clever. The templates stay simple and ignore metadata or sorting rules, while avoiding visibility flags as they provide a fixed shape that content slots into.

Here is a concrete example that matches the home page most readers expect. It is a normal page with a header and navigation plus a list of recent posts. The only special tag is the slot where the build will stamp the query results:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Semantic Scroll</title>
  </head>
  <body>
    <header>
      <h1>Semantic Scroll</h1>
      <nav>
        <a href="/archive/">Archive</a>
        <a href="/tags/">Tags</a>
      </nav>
    </header>

    <main>
      <template data-query="latest-posts">
        <p>No posts have been published yet.</p>
      </template>
    </main>

    <footer>
      <p>© John Hardy</p>
    </footer>
  </body>
</html>
```

@@Caption: The latest entries as they land in the archive.

Everything in that file is real HTML. If I open it in a browser, it renders as a page with an empty state because the `<template>` tag is inert by design. When the build runs, the system replaces that one tag with the output of the `latest-posts` query. Three returned articles become three summaries in that space, and the build then removes the `<template>` tag itself. If the query returns nothing, the fallback paragraph remains and the rest of the page stays the same.

That simplicity keeps the system predictable and inspectable, and it stays durable over time. The complexity lives in the build process and the query definitions, where I can validate it and reason about it directly. The templates remain what they look like: static HTML documents with a few clearly defined places where content will appear.

Tags: templating, publishing, process, tooling
