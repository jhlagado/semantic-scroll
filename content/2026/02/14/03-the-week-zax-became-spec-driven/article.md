---
status: published
title: "The Week ZAX Became Spec-Driven"
summary: "Between February 7 and February 14, 2026, ZAX moved from rapid feature expansion toward tighter language contracts and stronger behavioural tests. This article records that transition through concrete work in docs, parser rules, lowering logic, and fixture growth. The result is a clearer spec surface that guides future implementation decisions."
tags:
  - zax
  - z80
  - engineering-diary
  - language-specification
  - testing
series: zaxassembler
---

# The Week ZAX Became Spec-Driven

By John Hardy

A clear week in February marked a turning point for ZAX development. Commit activity stayed high from Friday, February 7, 2026 through Saturday, February 14, 2026. That span included sustained documentation work across the repo. Parser code changed in parallel with lowering code and tests. Raw volume alone never proves maturity, yet the direction of edits during that window shows a stronger contract between language specification and compiler behaviour.

Early commits in that week pushed feature coverage and parser breadth. Midweek commits focused on semantic precision with scalar value semantics and qualified enum member access. Tighter indexing rules also landed in that phase. The same window introduced `offsetof` behaviour with dedicated tests. Late-week changes added diagnostics and lint behaviour that reinforced consistency across source files and tooling output.

Test growth provided the strongest signal for this transition. Fixture updates expanded quickly, and targeted suites landed for recent semantics such as nested runtime indexing and value-oriented scalar loads. Each semantic change received concrete checks in parser suites. Lowering suites and CLI-facing behaviour suites also gained matching cases. That rhythm built confidence because every new rule arrived with executable proof.

Documentation changed at the same time, which made the week feel different from earlier feature bursts. `docs/zax-spec.md` gained authority as the canonical language reference. Transition notes captured migration decisions for v0.2 semantics. Roadmap entries tracked explicit scope boundaries so active work stayed assembler-first with clear deferrals for later integration stages.

Parser and lowering edits followed that documentation direction closely. Operand matcher support expanded for `idx16` and condition-code oriented forms. Lowering paths for typed calls and indexed addressing gained sharper invariants. Source-level features moved together with emitted code paths and test assertions, which reduced ambiguity during review.

Daily maintenance pressure also shaped those decisions. I spent less time debating intent in review comments because spec text and tests already expressed expected behaviour. Complicated refactors still required care, though merge discussions became shorter because disputed points now referenced concrete spec clauses and fixture output.

This phase changed my own implementation posture for ZAX. New ideas now pass through a spec checkpoint before parser or emitter changes begin. Each semantic update lands with fresh test evidence in the same branch. That discipline keeps momentum while preserving trust in the compiler surface as the project grows.
