---


title: "When Templates Start Making Decisions"
status: published
series: templating
summary: "I describe how templates take on selection work and how loops and conditionals push them from structure into control. This is where predictable layout starts to blur."
tags:
  - templating
---
# When Templates Start Making Decisions

_January 12, 2026_ | Series: templating

If you missed the first piece, start with [Why Websites Need Templates](/content/blog/2026/01/12/03-why-websites-need-templates/). It lays out the baseline that this piece builds on, and it frames why templates exist in the first place.

Once I accept a template as a shared frame for many pages, it becomes tempting to push more work into it. The template already knows about layout, so it starts to feel natural to let it decide which pieces of content appear where. That is how most templating systems evolve, and the shift tends to feel gradual and understated.

At that point the template stops being a simple frame that inserts finished content into a slot. It gets access to a collection of articles and tags plus their metadata. It loops over those items and filters or sorts them, then decides whether certain blocks of HTML should appear. The template now carries structure along with selection and ordering.

At a small scale this feels convenient. If I want a list of recent posts in a sidebar, it seems reasonable to write a loop in the template that iterates over the latest five articles and add a conditional to hide a heading when there are no results. Over time these small decisions accumulate and the behaviour spreads across the layout.

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

The result is that the final HTML page is no longer a simple combination of a frame and a piece of content. The output becomes a program embedded inside the template. To understand what the page will look like, I have to consider the template file. I also have to consider the data it receives and the logic that operates on that data. Reading the page becomes dependent on the build.

One consequence is that the template stops being a reliable description of the document. I can open it in an editor and see a mix of HTML and logic, yet I cannot tell which sections will appear in the output for a given build. Another consequence is that it becomes harder to reason about changes, because a small edit in the template or a change in metadata can reshape the output. This is where I start losing trust in the page before I even render it.

Many systems are built this way and people learn to work within those constraints. The template becomes a layer in the site's control plane because it now contains behaviour as well as structure. The file reads like a small program that emits a document.

At that point I find it difficult to talk about a template as a document. The distinction matters if I care about inspecting and understanding the output over time, and about preserving it as a stable artefact.

The next article describes an alternative approach: keeping selection and ordering out of templates entirely, and using them only as fixed stamps that receive already-prepared content. It is the simplest way I have found to keep layout and selection separate. Continue to [Templates as Mechanical Stamps](/content/blog/2026/01/12/05-templates-as-mechanical-stamps/).

Tags: templating
