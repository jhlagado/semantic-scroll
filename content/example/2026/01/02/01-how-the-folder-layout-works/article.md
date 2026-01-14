---
title: "How the Folder Layout Works"
status: published
summary: "Explains the dated folder layout and where templates, assets, and queries live in an instance."
tags:
  - structure
  - templates
---
# How the Folder Layout Works
By Example Author

Each article lives in a dated directory with a two-digit ordinal. The folder name becomes the public URL, so the path is part of the identity. This keeps ordering clear and the archive readable.

Templates, assets, and queries live beside your content under `content/<contentDir>/`. The build reads only from that instance directory, which lets you pull engine updates without touching your site design. When you make your own blog, copy the example folder and replace the posts.
