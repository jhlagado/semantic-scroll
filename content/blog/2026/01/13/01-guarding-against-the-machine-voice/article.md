---
title: "Guarding Against the Machine Voice"
status: draft
series: genesis
summary: "Documents the prose-lint script and its role in catching AI writing habits. It explains the scoring system, the rules it enforces, and how threshold-based gates prevent formulaic prose from entering published content."
tags:
  - writing
  - automation
  - tooling
---
# Guarding Against the Machine Voice
_January 13, 2026_ | Series: genesis

I built a linting script to flag the patterns I fall into when I write quickly with AI assistance. The script catches formulaic phrasing, contrast framing, hedge words, and other habits that flatten voice. It runs against drafts by default and stops the build if too many issues pile up in a single file.

Speed matters to this project, but speed without attention produces prose I want to avoid. I need a mirror that shows me when the prose drifts into explanation mode or when sentences start sounding like they came from a corporate blog. The linter is that mirror.

## Rules and Weights

Each rule carries a numeric weight that contributes to a file's total score. High-weight rules target forbidden AI-isms: words like "delve", "leverage", "unlock", "seamless". These words almost never appear in careful writing, so the script treats them as immediate red flags.

Medium-weight rules catch patterns like passive voice, weak paragraph openers, and scene-setting lines that stall narrative progression. Lower-weight rules flag hedge words ("kind of", "sort of") and empty intensifiers ("very", "really") that dilute specificity.

The script also enforces UK spelling and watches for first-person plural pronouns. This blog is a personal diary and should stay in first person singular.

## Contrast Framing

One of the heavier checks targets contrast framing: the habit of defining an idea by negation followed by correction. Patterns like "This isn't about X. It's about Y" or "The goal isn't A. It's B" show up constantly in AI-generated text. They create a sense of structure without requiring deeper thought.

The script scores each contrast pattern and caps the total penalty per paragraph so a single piece of writing can't blow out the score through repetition alone. When it catches these patterns, it samples the matches and shows exactly where the framing appeared.

## Sentence and Paragraph Metrics

The script measures sentence-length variance, discourse-marker density, and paragraph uniformity. Low variance in sentence length produces a rhythmic monotony that makes prose feel generated rather than authored. High use of discourse markers like "however", "therefore", and "moreover" signals over-structured thinking.

Paragraphs that stay uniformly short or uniformly long create a flattened reading experience, so the script flags both extremes. It also counts list blocks. Bullet points are a crutch that can replace explanation when used too often.

## Thresholds and Gates

The script supports three severity levels: high, medium, and low. Issues are assigned a severity based on their weight, and files are evaluated against per-file thresholds. The default thresholds allow one high-severity issue, three medium, and six low before a file fails the gate.

The build fails if any file exceeds its thresholds. During local development, the script prints warnings without blocking so I can keep moving forward while still seeing where the prose needs attention.

Strict mode rejects any file with issues, which is useful for final review passes. Gate mode balances friction with velocity by allowing some imperfection while still catching the worst patterns before they ship.
