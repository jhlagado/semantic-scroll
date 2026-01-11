---
title: "Templates as Mechanical Stamps"
status: published
tags:
  - templating
  - publishing
  - process
  - tooling
series: genesis
summary: "Templates hold structure and nothing else, so queries select content and the build stamps it into place."
---

# Templates as Mechanical Stamps
*January 12, 2026* | Series: genesis | Tags: templating, publishing, process, tooling

I treat templates as mechanical stamps. They hold structure and nothing else. When I read a template I want to see plain HTML and a few slots where content will land.

A template marks those slots with a `<template>` tag and a `data-query` name. The build loads the query results and fills the slot with either full article bodies or summary blocks. The view stays explicit. If the slot says `data-view="article"`, it renders the full Markdown body. A slot marked `summary` or `summary-list` renders a short summary from frontmatter and path data.

This keeps selection and layout separate. Queries decide which records exist and set their order. Templates decide the shape of a page. The two sides never peek into each other, and the build just stamps one into the other.

I keep metadata out of templates on purpose. It forces every visible line to live in Markdown, and it keeps the HTML free of conditionals. When a list looks wrong, I read the query. A page that feels off sends me to the template. Debugging stays concrete.

This boundary gives me a stable tool. I can rework the look without touching selection, or change selection without opening the markup. The site stays legible to me and to the AI that helps me maintain it.
