---
status: published
title: "Why ZAX Replaces Macros with Typed Ops"
summary: "ZAX uses typed inline `op` declarations instead of text macros so reusable instruction patterns stay readable, predictable, and grounded in real operand shapes."
tags:
  - zax
  - z80
  - compiler-design
  - ast
  - macros
series: zaxassembler
---

# Why ZAX Replaces Macros with Typed Ops

By John Hardy

One of the most distinctive parts of ZAX is `op`, a way to define new instruction-shaped building blocks with typed operands. I wanted this because reusable patterns appear constantly in assembly work, especially on the Z80, and traditional macro systems do a poor job of carrying those patterns once a project becomes large. ZAX keeps the convenience of reusable instruction families while grounding them in the actual operands that appear at the call site.

## Reuse at the instruction level

An `op` looks and reads like an instruction. It expands inline, so there is no call overhead, and it can be overloaded so a single name covers a family of related operand shapes. That makes it useful for the repetitive low-level work that assemblers have always needed macros for.

This is a small example:

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

At the call site, `add16 DE, BC` reads like a normal instruction. The compiler sees that the destination is `DE`, selects the matching form, substitutes the operands, and emits the correct inline sequence. The source stays compact and the machine behaviour stays visible.

## The operands are part of the contract

The important idea is that operands are matched by kind. A declaration can require `HL`, any `reg16`, an immediate, a condition code, or another specific operand class. That gives reusable patterns clear boundaries. If I pass the wrong shape, the compiler can reject the call in terms that make sense for the original source.

This is a practical improvement over text substitution. The tool understands that `DE` is a register pair and `Z` is a condition code. It is working with the parsed program rather than a stream of pasted tokens. That keeps reusable instruction forms connected to the machine concepts they represent.

## A better fit for long-lived assembler code

Typed ops matter because they let an assembler project grow without pushing more logic into fragile macro text. I can give a repeated pattern a name, define the valid operand forms once, and keep the final expansion inline and inspectable. That is exactly the kind of facility a structured assembler should offer.

ZAX uses typed ops because they are a better unit of reuse for assembly code. They keep the language close to the machine while giving repeated instruction patterns a clear and durable home.
