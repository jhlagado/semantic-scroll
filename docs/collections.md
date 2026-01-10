# Collections Registry

This document defines how curated collections are declared outside of individual articles. Collections are editorial overlays on top of tags and paths, and they exist to shape reading and navigation without rewriting content.

## Streams as Promoted Tags

A stream is a narrative reading of a subset of posts over time. Articles never declare that they belong to a stream. They only declare tags. The system later nominates some tags as streams, which allows the archive to be reinterpreted without touching the articles themselves.

The build treats a stream as: “all posts with tag X, where X appears in the streams registry.” This makes streams computed, overlapping, and reversible. A stream can begin or end without changing any post.

## Collections File

Collections are defined in `config/collections.json`. The file is simple and intentionally manual. It is meant for editorial decisions, not automation.

Example:

```json
{
  "streams": [
    "genesis",
    "dbg80"
  ],
  "featured": [
    "content/blog/2026/01/10/01-the-blog-is-the-build-system"
  ]
}
```

The `streams` list names tags that should receive stream pages. Tags are normalized using the same rules as all other tags. If a stream tag has no posts yet, the stream still exists and the page should render with an empty state.

The `featured` list is a curated set of articles, expressed as relative directory paths. It exists to support special index views without inventing new metadata fields.

## Why Streams Stay Out of Frontmatter

Putting `stream: genesis` in frontmatter would force writers to decide narrative membership too early. It would also freeze interpretation into content and make future restructuring expensive. Promoted tags keep writing lightweight and keep the archive flexible.

Streams belong to the index and registry, not the file.
