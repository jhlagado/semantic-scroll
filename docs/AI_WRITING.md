# AI Writing and Prose Specification

This document defines the **voice and style** for all prose generated or edited by AI agents in this project. It is derived from `docs/PRD.md` and mandated by `AGENTS.md`. 

The goal is to preserve a **human-first, authored "soul"** across the technical diary, specifications, and eventual blog posts.

---

## 1. The Core Directive: Kill the Machine Voice

AI-generated text often defaults to a "corporate-optimistic" tone characterized by vague metaphors and repetitive vocabulary. This is strictly forbidden. 

We prioritize:
- **Directness** over generalization.
- **Concrete facts** over abstract summaries.
- **Human experience** over "AI expertise."
- **Active voice** and specific verbs.

---

## 2. Banned Clichés (The Blacklist)

If any of the following words or phrases appear in your output without an extremely narrow technical justification (e.g., "unlocking a mutex"), the prose is incorrect.

| Category | Forbidden AI-isms |
| :--- | :--- |
| **Pivotal/Transformative** | pivotal, game-changer, unlock, unleash, revolutionizing, landscape |
| **Exploring/Navigating** | delve, dive into, navigate the complexities, embark on a journey |
| **Optimization/Efficiency** | streamline, synergize, maximize, leverage (use "use"), tap into |
| **Vague Value** | comprehensive, robust, bespoke, seamless transition, vibrant |
| **Summary Crutches** | In today's fast-paced world, in conclusion (unless in a spec), looking ahead |

---

## 3. Structural Rules: Prose First

### 3.1 Narrative Flow
Prose should read linearly. Avoid jumping immediately to bullet points. Explain **why** a decision was made before listing **what** the decision was. 

### 3.2 The First-Person Anchor
The blog is a personal technical diary. When drafting blog posts or diary entries, use the first person ("I decided," "I observed") to ground the text in the author's narrative. 

### 3.3 Sentence Variety
Avoid the repetitive [Subject] [Verb] [Object] cadence common in LLM output. Vary sentence length and structure to create a natural human rhythm.

---

## 4. Technical Precision

### 4.1 No "Buffer" Adjectives
Do not call a system "powerful," "elegant," or "sophisticated." If the system is good, let the technical description prove it.

### 4.2 Honesty over Polish 
If a technical step was frustrating, messy, or a hack, document it as such. The "soul" of the diary is the truth of the process, not a sanitized version of it.

---

## 5. Self-Checklist for Agents

Before emitting prose, run this mental audit:
1. Did I use any words from the Blacklist?
2. Did I use "delve"? (Delete it.)
3. Are there more than three bulleted lists in a row without a paragraph between them?
4. Does this sound like a human narrating their day, or a robot explaining a concept?
5. Is the main point buried under "In conclusion..."? (Move it to the top.)

---

## Status

This specification is **normative**. Prose that violates these rules is considered a technical failure on par with a broken build.
