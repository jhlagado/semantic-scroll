---
title: "When Templates Start Making Decisions"
status: published
tags:
  - templating
  - publishing
  - process
  - tooling
series: templating
summary: "I describe how templates take on selection work and why that shifts them from structure into control. I show how loops and conditionals blur layout with selection and make pages harder to predict."
---
# When Templates Start Making Decisions

_January 12, 2026_ | Series: templating

If you missed the first piece, start with [Why Websites Need Templates](/content/blog/2026/01/12/03-why-websites-need-templates/). It lays out the baseline that this piece builds on.

Once I accept a template as a shared frame for many pages, it becomes natural to push more work into it. The template already knows about layout, so I start to let it decide which pieces of content appear where.

That is how most templating systems evolve. The shift often feels gradual, even inevitable.

At that point the template no longer just inserts a finished piece of content into a slot. It gets access to a collection of articles and tags plus their metadata. It loops over those items and filters or sorts them, then decides whether certain blocks of HTML should appear. That shift makes it responsible for structure along with selection and ordering.

At a small scale this feels convenient. If I want a list of recent posts in a sidebar it seems reasonable to write a loop in the template that iterates over the latest five articles, then add a conditional to hide a heading when there are no results. Over time, more of these small decisions accumulate.

Here is the template logic I am talking about:

```
{% if featured_posts.length > 0 %}
<h2>Featured</h2>
<ul>
  {% for post in featured_posts %}
    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
{% endif %}
```

@@Caption: Short posts I want to surface on the home page.

The result is that the final HTML page is no longer a simple combination of a frame and a piece of content. The output is a program embedded inside the template. To understand what the page will look like, I have to consider the template file plus the data it receives and the logic that operates on that data.

This has a few practical consequences, and I notice them most when I try to read a page without running the build.

One is that the template stops being a reliable description of the document. I can open it in an editor and see a mix of HTML and logic, but I cannot easily tell which sections will appear in the output for a given build. I might wrap a block in a conditional and find the list empty, or see a heading appear only when a certain field exists. The structure of the page is no longer fixed.

Another is that it becomes harder to reason about changes. A small edit to a template can have wide effects, because it might alter the logic that decides which content it includes. A change to metadata or content can also change the layout of a page, because the template logic reacts to it and structure and data become tightly coupled.

None of this is inherently wrong because many systems are built this way and people learn to work within those constraints. The template is no longer just a piece of HTML with placeholders. This makes it a layer in the site's control plane because it contains behaviour, not just shape.

By then I find it difficult to talk about a template as a document. It reads more like a small program that produces a document. That distinction matters if I care about inspecting and understanding the output over time, and about preserving it.

The next article describes an alternative approach: keeping selection and ordering out of templates entirely, and using them only as fixed stamps that receive already-prepared content. It is the simplest way I have found to keep layout and selection separate. Continue to [Templates as Mechanical Stamps](/content/blog/2026/01/12/05-templates-as-mechanical-stamps/).

Tags: templating, publishing, process, tooling
