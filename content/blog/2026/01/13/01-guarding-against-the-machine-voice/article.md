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

I built a linting script to flag the patterns I keep falling into when I write quickly with AI assistance. The script catches formulaic phrasing, contrast framing, hedge words, and other habits that flatten voice. It runs against drafts by default and stops the build if too many issues pile up in a single file.

The script exists because speed matters to this project, but speed without attention produces the exact kind of writing I am trying to avoid. I need a mirror that shows me when the prose drifts into explanation mode or when sentences start sounding like they came from a corporate blog. The linter is that mirror.

## Rules and Weights

Each rule carries a numeric weight that contributes to a file's total score. High-weight rules target forbidden AI-isms like "delve", "leverage", "unlock", and "seamless transition". These words almost never appear in careful writing, so the script treats them as immediate red flags.

Medium-weight rules catch patterns like passive voice, weak paragraph openers, and scene-setting lines that stall instead of advancing the narrative. Lower-weight rules flag hedge words ("kind of", "sort of") and empty intensifiers ("very", "really") that dilute specificity.

The script also enforces UK spelling because that's the voice I want, and it watches for first-person plural pronouns since this blog is a personal diary and should stay in the first person singular.

## Contrast Framing

One of the heavier checks targets contrast framing, which is the habit of defining an idea by negation followed by correction. Patterns like "This is not about X. It is about Y" or "The goal isn't A. It's B" show up constantly in AI-generated text because they create a sense of structure without requiring deeper thought.

The script scores each contrast pattern and caps the total penalty per paragraph so a single piece of writing cannot blow out the score through repetition alone. When it catches these patterns, it samples the matches and shows exactly where the framing appeared.

## Sentence and Paragraph Metrics

Beyond line-by-line rules, the script measures sentence-length variance, discourse-marker density, and paragraph uniformity. Low variance in sentence length produces a rhythmic monotony that makes prose feel generated rather than authored. High use of discourse markers like "however", "therefore", and "moreover" signals over-structured thinking.

Paragraphs that stay uniformly short or uniformly long create a flattened reading experience, so the script flags both extremes. It also counts list blocks because bullet points are a crutch that can replace explanation when used too often.

## Thresholds and Gates

The script supports three severity levels: high, medium, and low. Issues are assigned a severity based on their weight, and files are evaluated against per-file thresholds. The default thresholds allow one high-severity issue, three medium, and six low before a file fails the gate.

In CI, the build fails if any file exceeds its thresholds. In local development, the script prints warnings without blocking so I can keep moving forward while still seeing where the prose needs attention.

The strict mode rejects any file with issues, which is useful for final review passes. The gate mode balances friction with velocity by allowing some imperfection while still catching the worst patterns before they ship.

## Why This Works

I do not believe there is a reliable way to judge good writing algorithmically, and I am not trying to invent one. What the script does is detect habits that correlate with formulaic output. It catches the phrases that arrive fully formed, the sentence structures that repeat across unrelated paragraphs, and the meta-commentary that climbs out of the narrative.

The script is friction, not correction. It does not rewrite. It does not enforce a house style. It shows me where the writing drifted and leaves the decision to fix it in my hands. That keeps the process fast enough to matter while still preserving the ability to catch mistakes before they become permanent.

Automation helps here because the patterns are consistent enough to detect but subtle enough that I miss them when I am moving quickly. Running the linter after every draft gives me a second pass without requiring a full manual review, and the score tells me at a glance whether the file needs another look.

## Implementation

The script lives in `scripts/prose-lint.js` and scans `content/blog/**/article.md` by default. It parses frontmatter to check status, skips published posts unless told otherwise, and walks the body line by line while tracking code blocks to avoid false positives.

Frontmatter fields like `title` and `summary` are linted separately because they appear in indexes and need to stay clean. The body linter splits paragraphs, counts list blocks, and evaluates contrast patterns after assembling full paragraph text.

The output shows the file path, the total score, and a list of flagged issues with line numbers and severity tags. At the end, it prints aggregate stats and a pass/fail result based on the chosen mode.

Tags: writing, automation, tooling
