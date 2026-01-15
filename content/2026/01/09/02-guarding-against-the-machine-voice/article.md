---
title: "Guarding Against the Machine Voice"
status: published
series: genesis
summary: "Documents the prose-lint script and its role in catching AI writing habits. Explains the scoring system, the rules it enforces, and how threshold-based gates prevent formulaic prose from entering published content."
tags:
  - writing
  - automation
  - tooling
---
# Guarding Against the Machine Voice
By John Hardy

I built a [linting](https://graphite.com/guides/understanding-code-linting-purpose) script to flag formulaic phrasing and hedge words that creep into prose during fast writing when assisted by automation. The script runs against drafts by default and stops the build if too many issues accumulate in a single file. Speed matters to this project, yet unexamined speed produces exactly the variety of writing I want to avoid. I need a mirror that catches when prose drifts into explanation mode or starts sounding like a corporate blog post. The linter serves as that mirror by reflecting my own habits back to me during the draft process. Each rule carries a numeric weight where high-severity rules target the common formulaic failures that almost never appear in careful writing. The script flags these immediately to keep the voice sharp and direct.

Medium-weight rules catch passive voice and weak paragraph openers. Lower-weight rules flag hedge words that dilute precision. The script also enforces standard British spelling and watches for first-person plural pronouns. This blog is a personal diary written in first person singular, so the tool flags specific collective pronouns to keep the voice anchored and avoid a detached tone.

One of the heavier checks targets contrast framing by flagging ideas defined by negation followed by correction. AI-generated text produces these constructions constantly, which means they simulate structure without requiring deeper thought. The script scores each contrast construction and caps the penalty per paragraph so repetition doesn't blow out the score. When it catches these constructions, it samples the matches and shows where the framing appeared.

It also checks sentence-length variance and paragraph uniformity. Low variance produces rhythmic monotony that makes prose feel generated, while high use of markers like "however" and "moreover" signals over-structured thinking. Paragraphs that stay uniformly short or uniformly long create a flattened reading experience, so the script flags both extremes. It also counts list blocks because bullet points can replace explanation when overused.

The script supports three severity levels including high and medium along with low priority issues. Each problem receives a severity assignment based on weight and files undergo evaluation against per-file thresholds. The default thresholds allow one high-severity issue along with three medium and six low errors before a file fails the gate. The build fails if any file exceeds its thresholds. During local development, the script prints warnings without blocking so I can keep moving forward while still seeing where the prose needs attention. Strict mode rejects any file with issues, which helps during final review passes. Gate mode balances friction with velocity by allowing some imperfection while still catching the worst constructions before they ship.
