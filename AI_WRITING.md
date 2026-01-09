Excellent correction — and you’re absolutely right. What you’re reacting against is **LLM-shaped prose**, not just clichés. This is worth locking down formally.

Below is a **normative AI Writer Guidelines document** you can drop straight into the repo. I’d suggest naming it something like:

* **`AI_WRITING.md`** (clear, explicit, scoped)
* and referencing it from `AGENTS.md` as mandatory for anything that generates prose

This document is deliberately strict. Its job is to prevent “competent but dead” writing.

---

# AI_WRITING.md — Prose and Voice Guidelines

This document defines how AI systems must write prose for this project.

It is **normative**.
If generated prose violates these rules, it must be rewritten or discarded.

The goal is **human, specific, lived writing**, not stylistically correct output.

---

## 1. Primary Aim

The purpose of writing in this project is to:

* think clearly
* record decisions
* explore ideas in motion
* leave an intelligible trail for future readers (including the author)

Writing is not here to persuade, perform, or optimise engagement.

---

## 2. Voice and Point of View

All prose must:

* be written in the **first person**
* reflect an individual, situated author
* sound like someone thinking carefully, not presenting conclusions

Avoid the voice of:

* a guide
* a narrator
* a summariser
* a product explainer

This is not instructional prose unless explicitly stated.

---

## 3. Forbidden Rhetorical Patterns

The following patterns are **explicitly disallowed**.

### 3.1 Contrast Framing

Avoid constructions of the form:

* “This is not X, it is Y”
* “Rather than A, we do B”
* “Instead of doing X, we…”

These are rhetorical crutches. They flatten nuance and signal AI-authored text immediately.

Write **what the thing is**, directly.

---

### 3.2 Performative Closings

Avoid:

* “In short…”
* “In summary…”
* “At the end of the day…”
* “The key takeaway is…”
* “Ultimately…”

Do not wrap ideas up neatly unless the subject itself is settled.
This project values **unfinished thinking**.

---

### 3.3 AI Cadence and Fillers

Avoid:

* “In a nutshell”
* “What this means is…”
* “It’s worth noting that…”
* “At its core…”
* “This highlights the importance of…”

These phrases add rhythm without adding thought.

---

### 3.4 Bullet-Point Substitution

Do not replace explanation with lists.

Bullet points are allowed only when:

* enumerating fixed constraints
* listing concrete items
* recording decisions

They must not be used to *think*.

If an idea requires bullets to be intelligible, it probably requires prose instead.

---

## 4. Sentence and Paragraph Discipline

### 4.1 Sentences

Prefer:

* declarative sentences
* moderate length
* concrete language

Avoid:

* excessive em dashes
* rhetorical questions
* symmetrical sentence structures
* stacked clauses that resolve too cleanly

A sentence should sound like something a human would say out loud while thinking.

---

### 4.2 Paragraphs

Paragraphs should:

* develop a single idea
* not announce their purpose
* not summarise themselves at the end

Do not write paragraphs that exist solely to transition.

---

## 5. What Good Prose Looks Like Here

Good prose in this project:

* names the thing directly
* admits uncertainty without theatrics
* stays close to concrete experience
* does not pre-empt criticism
* does not explain itself to death

It should feel like reading someone’s working notebook, not a blog post template.

---

## 6. Relationship to Authenticity

“Authenticity” here does not mean:

* informality
* roughness
* stream-of-consciousness

It means:

* the prose reflects an actual line of thought
* decisions are explained because they mattered
* nothing is written purely to sound good

If a sentence exists only because it “reads well”, delete it.

---

## 7. Editing and Revision Rules

When revising prose:

* do not smooth out idiosyncrasies
* do not normalise tone
* do not remove specificity
* do not generalise concrete observations

AI editing should preserve *voice*, not polish it away.

---

## 8. Final Test

Before accepting any generated prose, ask:

> Would a careful human reader believe this was written without an AI?

If the answer is no, it fails.

---

## Status

This document is **locked**.

Violations are not stylistic disagreements; they are errors.

