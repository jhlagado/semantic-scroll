---
title: "Guarding Against the Machine Voice"
status: draft
series: genesis
summary: "Documents the prose-lint script and its role in catching AI writing habits. Explains the scoring system, the rules it enforces, and how threshold-based gates prevent formulaic prose from entering published content."
tags:
  - writing
  - automation
  - tooling
---
# Guarding Against the Machine Voice
_January 13, 2026_ | Series: genesis

I built a linting script to flag formulaic phrasing, contrast framing, and hedge words that creep into prose when I write quickly with AI assistance. The script runs against drafts by default and stops the build if too many issues accumulate in a single file.

Speed matters to this project, yet unexamined speed produces exactly the kind of writing I want to avoid. I need a mirror that catches when prose drifts into explanation mode or starts sounding like a corporate blog post. The linter serves as that mirror.

## Rules and Weights

Each rule carries a numeric weight that contributes to a file's total score. High-weight rules target forbidden AI-isms: words like "delve", "unlock", and "seamless". These words almost never appear in careful writing, so the script flags them immediately.

Medium-weight rules catch passive voice, weak paragraph openers, and scene-setting lines that stall the narrative. Lower-weight rules flag hedge words and empty intensifiers that dilute specificity.

The script enforces UK spelling and watches for first-person plural pronouns, since this blog is a personal diary written in first person singular.

## Contrast Framing

One of the heavier checks targets contrast framing: defining an idea by negation followed by correction. AI-generated text produces these constructions constantly because they simulate structure without requiring deeper thought.

The script scores each contrast construction and caps the total penalty per paragraph so repetition doesn't blow out the score. When it catches these constructions, it samples the matches and shows exactly where the framing appeared.

## Sentence and Paragraph Metrics

The script checks sentence-length variance, discourse-marker density, and paragraph uniformity. Low variance in sentence length produces rhythmic monotony that makes prose feel generated. High use of discourse markers like "however" and "moreover" signals over-structured thinking.

Paragraphs that stay uniformly short or uniformly long create a flattened reading experience, so the script flags both extremes. It counts list blocks because bullet points can replace explanation when overused.

## Thresholds and Gates

The script supports three severity levels: high, medium, and low. Issues get assigned a severity based on their weight. Files get evaluated against per-file thresholds. The default thresholds allow one high-severity issue, three medium, and six low before a file fails the gate.

The build fails if any file exceeds its thresholds. During local development, the script prints warnings without blocking so I can keep moving forward while still seeing where the prose needs attention.

Strict mode rejects any file with issues, which helps during final review passes. Gate mode balances friction with velocity by allowing some imperfection while still catching the worst constructions before they ship.
