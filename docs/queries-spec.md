# Query JSON Schema Specification

This document defines the **authoritative schema** for named queries used by the blog system. It is derived from `docs/queries.md` and `docs/PRD.md`.

Queries are **data**, not code.
They are validated strictly at build time.
Anything outside this schema is invalid by definition.

---

## 1. Purpose

Queries select articles for rendering.

They may:

* filter articles
* order results
* limit result count

They must never:

* compute values
* express logic
* nest expressions
* inspect markdown bodies
* interact with templates

---

## 2. Storage Model

Queries are stored as **named objects** in a JSON file.

Example location:

```
content/<contentDir>/queries.json
```

Example structure:

```json
{
  "latest-posts": { ... },
  "z80-posts": { ... }
}
```

* Top-level keys are **query names**
* Values must conform to the schema below

---

## 3. Query Object Schema (Normative)

Each query object may contain **only** the following keys.

Unknown keys are **hard errors**.

---

## 4. Required Field

### 4.1 `source`

```json
"source": "blog"
```

Rules:

* required
* string
* currently must be `"blog"` (maps to the active content root; default `content/example/` in this repo, or `content/<contentDir>/` when `site-config.json` overrides it)
* future sources may be added explicitly

---

## 5. Equality Filter Fields

These fields perform **exact match filtering**.

| Field    | Type             | Notes                                      |
| -------- | ---------------- | ------------------------------------------ |
| `status` | string           | `draft`, `review`, `published`, `archived` |
| `tag`    | string           | matches if value ∈ tag set                 |
| `series` | string           | exact match                                |
| `year`   | number           | 4-digit year                               |
| `month`  | string or number | month 1-12; zero-padded strings allowed    |
| `day`    | string or number | day 1-31; zero-padded strings allowed      |

Rules:

* AND semantics only
* no OR
* no arrays
* no partial matches
* case-normalized

Month and day values are normalized to integers before comparison. Strings such as `"01"` and `"1"` are treated as the same value.

---

## 6. Range Filter Fields

Ranges are allowed **only** for approved numeric fields.

### 6.1 Range Object Shape

```json
{
  "from": <number>,
  "to": <number>
}
```

Rules:

* both `from` and `to` required
* inclusive range
* `from` ≤ `to`
* no open-ended ranges

Range endpoints are normalized to integers before comparison.

---

### 6.2 Fields Allowing Ranges

| Field     | Description                    |
| --------- | ------------------------------ |
| `year`    | year range                     |
| `month`   | month range                    |
| `day`     | day range                      |
| `ordinal` | per-day article ordinal (`NN`) |

Example:

```json
"day": { "from": 1, "to": 7 }
```

Ranges are **not allowed** for:

* `tag`
* `status`
* `series`
* `slug`

---

## 7. Sorting

### 7.1 `sort`

```json
"sort": "date-desc"
```

Allowed values:

* `date-asc`
* `date-desc`
* `ordinal-asc`
* `ordinal-desc`

Rules:

* optional
* only one sort key allowed
* no custom comparators
* no multi-key sorting

---

## 8. Limiting

### 8.1 `limit`

```json
"limit": 10
```

Rules:

* optional
* positive integer
* hard truncation
* no offset
* no pagination

---

## 9. Complete Example

```json
{
  "latest-posts": {
    "source": "blog",
    "status": "published",
    "sort": "date-desc",
    "limit": 10
  },

  "z80-posts": {
    "source": "blog",
    "status": "published",
    "tag": "z80",
    "sort": "date-desc"
  },

  "first-posts-of-day": {
    "source": "blog",
    "year": 2026,
    "month": 1,
    "day": 8,
    "ordinal": { "from": 1, "to": 3 },
    "sort": "ordinal-asc"
  }
}
```

---

## 10. Validation Rules (Hard Errors)

The build must fail if:

* `source` is missing
* an unknown key is present
* a range is applied to a non-range field
* a range object is malformed
* `sort` value is not one of the allowed enum values
* `limit` is non-positive or non-integer
* both equality and range are specified for the same field

---

## 11. Evaluation Order (Guaranteed)

Queries are evaluated in the following order:

1. filesystem discovery
2. derived field calculation
3. equality filtering
4. range filtering
5. sorting
6. limiting

Markdown bodies are read **only after** this process completes.

---

## 12. Design Invariants

This schema is intentionally restrictive.

It must never grow to include:

* boolean logic
* expressions
* functions
* computed values
* nested objects (other than ranges)

If a requirement cannot be expressed within this schema, it is out of scope by design.

---

## 13. Status

This schema is **locked**.

Any change to this document is an architectural change and must be deliberate.
