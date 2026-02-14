---
status: published
title: "Typed AST Ops in ZAX"
summary: "ZAX defines reusable instruction patterns as typed `op` blocks that match parsed operands and expand through AST transforms. This article explains why that model fits long-lived assembly projects and how it improves diagnostics during daily work. The design keeps code readable while preserving clear control over the emitted instructions."
tags:
  - zax
  - z80
  - compiler-design
  - ast
  - macros
series: zaxassembler
---

# Typed AST Ops in ZAX

By John Hardy

ZAX grew from a simple need that kept returning in project after project. I wanted reusable instruction patterns with clear names, and I wanted each expansion step to stay visible in compiler diagnostics. Macro systems gave me reuse, yet the debugging loop slowed down once nested expansions entered the file. Error spans drifted away from the line I wrote. Each correction required another pass through generated text.

Typed ops in ZAX carry a different contract. An `op` declaration defines operand matchers and overload signatures. The same declaration also holds a body that the compiler lowers after parsing. Parsed operands already have structure at that stage, so the compiler can evaluate matcher compatibility with direct type information. The implementation detail changes the full writing experience because each failure maps back to explicit source positions in the call site and in the selected overload.

Compiler design choices usually look abstract on paper, though this one changed my day-to-day workflow in a direct way. I spend less time inspecting expanded code and more time writing routines with clear names. Diagnostic messages now report the matching overload and explain each rejected candidate. That feedback loop keeps momentum during long sessions that move between parser work and lowering work while tests evolve in parallel.

This small example shows the style I use for typed overloads:

```zax
op add16(dst: HL, src: reg16)
  add hl, src
end

op add16(dst: DE, src: reg16)
  ex de, hl
  add hl, src
  ex de, hl
end
```

Each overload declares a precise operand contract, so the call site stays compact while lowering remains deterministic. Parser output drives matcher selection in a deterministic step. The selected matcher then drives substitution before emission begins. That sequence keeps every step inspectable during testing because no stage hides a textual expansion layer outside the AST.

Overloading also lets me treat instructions as families with explicit boundaries. A family name like `add16` can cover several valid register combinations while still rejecting accidental forms early. Rejections matter in assembler work because a silent expansion bug can survive into runtime before anyone notices. Typed matching catches those mismatches during compile time and points at the exact operand slot that broke the rule.

Current ZAX work adds matcher forms such as `idx16` and condition-code matchers for control-flow oriented ops. Those additions widen the design space without weakening type clarity. I can add another overload and keep the same reasoning model. Parsing always runs before matcher resolution begins. Lowering then applies explicit substitutions and emits deterministic machine code.

Readers who build tooling for mature assembly codebases care about maintenance cost across months and years. Typed ops address that cost through clear contracts and predictable diagnostics. Reusable patterns then stay tied to machine semantics throughout the codebase. ZAX keeps assembly direct while giving repeated instruction shapes a compiler-level home.
