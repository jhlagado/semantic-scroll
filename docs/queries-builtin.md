# Canonical Built-in Queries

This document defines the **minimum, first-class set of named queries** that the blog system must support. It is derived from `docs/queries.md` and `docs/queries-spec.md`.

These queries form the backbone of navigation, indexing, and page generation.
All other queries are considered **derived or custom** and must conform to the same schema.

---

## 1. Purpose

Canonical queries exist to:

* define the default browsing paths through the content
* stabilize URLs and page structure
* prevent ad-hoc or duplicated query definitions
* provide predictable inputs for templates

Every canonical query has:

* a clear semantic meaning
* a stable name
* a deterministic result set

---

## 2. Design Principles

Canonical queries must be:

* **simple** — explainable in one sentence
* **general** — reusable across templates
* **stable** — rarely changed once introduced
* **orthogonal** — no overlapping responsibilities

They must not:

* encode layout decisions
* assume presentation details
* rely on metadata not guaranteed by spec

---

## 3. Required Canonical Queries

The system must define **at least** the following queries.

---

## 3.1 `latest-posts`

### Purpose

Select the most recent published articles across the entire blog.

### Definition

```json
{
  "source": "blog",
  "status": "published",
  "sort": "date-desc",
  "limit": 10
}
```

### Usage

* homepage
* “recent posts” sections
* syndication feeds

---

## 3.2 `all-published-posts`

### Purpose

Select all published articles in chronological order.

### Definition

```json
{
  "source": "blog",
  "status": "published",
  "sort": "date-asc"
}
```

### Usage

* full archive pages
* bulk export
* search indexing

---

## 3.3 `posts-by-day`

### Purpose

Select all published posts for a specific day.

### Definition (parameterized)

```json
{
  "source": "blog",
  "status": "published",
  "year": "<YYYY>",
  "month": "<MM>",
  "day": "<DD>",
  "sort": "ordinal-asc"
}
```

### Notes

* Parameters are substituted at build time
* Ordering is strictly by per-day ordinal (`NN`)

### Usage

* daily archive pages
* chronological navigation

---

## 3.4 `posts-by-tag`

### Purpose

Select all published posts with a given tag.

### Definition (parameterized)

```json
{
  "source": "blog",
  "status": "published",
  "tag": "<tag>",
  "sort": "date-desc"
}
```

### Notes

* Tag normalization rules apply
* One tag per query instance

### Usage

* tag index pages
* topical navigation

---

## 3.5 `posts-by-stream`

### Purpose

Select all published posts in a named stream.

### Definition (parameterized)

```json
{
  "source": "blog",
  "status": "published",
  "stream": "<stream>",
  "sort": "date-asc"
}
```

### Notes

* Ordering is chronological by design
* Stream semantics are author-defined

### Usage

* long-running project logs
* build diaries
* narrative sequences

---

## 4. Optional (Recommended) Canonical Queries

These are not strictly required but are strongly recommended.

---

## 4.1 `posts-by-month`

### Purpose

Select all published posts in a given month.

### Definition (parameterized)

```json
{
  "source": "blog",
  "status": "published",
  "year": "<YYYY>",
  "month": "<MM>",
  "sort": "date-asc"
}
```

### Usage

* monthly archives
* calendar navigation

---

## 4.2 `posts-by-year`

### Purpose

Select all published posts in a given year.

### Definition (parameterized)

```json
{
  "source": "blog",
  "status": "published",
  "year": "<YYYY>",
  "sort": "date-asc"
}
```

### Usage

* yearly archive pages
* long-term retrospectives

---

## 5. Parameterization Rules

* Canonical queries may be **parameterized** by:

  * `year`
  * `month`
  * `day`
  * `tag`
  * `stream`
* Parameter substitution occurs at build time.
* Parameters must resolve to concrete values before execution.
* Templates reference the **query name**, not the parameters directly.

---

## 6. Non-Canonical Queries

Any query not listed in this document is considered **non-canonical**.

Non-canonical queries:

* must still conform to the query schema
* must not duplicate canonical semantics
* should be documented locally if reused

Canonical queries should always be preferred where applicable.

---

## 7. Stability Guarantees

Once introduced:

* canonical query names must not change
* semantics must not drift
* removal requires explicit migration of templates and URLs

This ensures:

* durable links
* predictable rendering
* long-term maintainability

---

## 8. Relationship to Templates

Templates:

* reference canonical queries by name
* never embed query logic
* rely on queries for selection and ordering only

Queries:

* do not know or care how results are rendered

---

## 9. Design Intent

Canonical queries define the **navigational grammar** of the blog.

They are not implementation details.
They are part of the public architecture.
