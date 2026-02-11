---
status: published
title: "What I Wanted From a Z80 Assembler (and Why I Started ZAX)"
date: 2026-02-09
summary: "ZAX is the assembler I started building so my Z80 code stays readable over time, without hiding registers or flags."
tags:
  - zax
  - z80
  - assembler
  - structured-programming
  - compilers
series: zaxassembler
---

# What I Wanted From a Z80 Assembler (and Why I Started ZAX)

by John Hardy

These are notes from the ZAX project. I have written a lot of Z80 assembly over the years, and I still enjoy the directness of it. I can look at a short routine and know exactly what it will do on the machine, which is a feeling I do not get as often in higher-level code.

The frustration arrives later, when I return to the same routine months afterward and find that the structure has dissolved into labels and conventions that only made sense when I wrote them. ZAX is my attempt to keep the low-level clarity while pushing some of that organisational work into the tool, so the source stays readable even after my memory fades.

Most of the bugs I am describing are not clever. A routine grows over time and I push one more register. I forget that the locals moved as well. Everything still assembles and the failure only shows up at runtime.

## What I mean by "structured assembler"

ZAX is not me trying to turn Z80 into a high-level language. It is still assembly in the practical sense. I choose registers and I manage flags directly. I also decide what lives in RAM versus ROM. The change is that I want the source to keep more of the program shape visible.

In practice, I want the file to read like a small module rather than a flat scroll of instructions. I want names for memory layout, so `sprites[C].x` is a real address and not a comment next to an offset. Functions need a single calling convention, and locals should not force me to dedicate `IX` or `IY` as a frame pointer.

Inside `asm`, I want structured control flow for the places where I would otherwise write a ladder of labels. For common instruction families, I want an `op` mechanism that matches operands after parsing instead of expanding text.

## A small file that looks like the way I think

This is a simplified example from the ZAX spec. It keeps declarations up front, above the executable block. It also keeps the executable code in a single `asm` block. When I read it later, I can see what is data. The layout makes storage boundaries obvious too. The `asm` block makes the code easy to spot.

```
const MsgLen = 5

data
  msg: byte[5] = "HELLO"

extern func bios_putc(ch: byte): void at $F003

export func main(): void
  var
    p: addr
  asm
    ld hl, msg
    ld (p), hl

    ld b, MsgLen
    repeat
      ld hl, (p)
      ld a, (hl)
      inc hl
      ld (p), hl
      push bc
      bios_putc A
      pop bc
      dec b
      until Z
    end
```

That snippet shows a few ZAX ideas that I kept reaching for in my own projects. `data` emits bytes while `var` reserves addresses, which makes it harder for me to blur "RAM storage" with "ROM bytes" by accident. Names like `msg` and `p` mean addresses rather than values, so parentheses only show up when I truly want a dereference.

The `repeat`/`until` loop also stays close to the machine model. The body sets flags in the normal Z80 way. The `until Z` check tests whatever flags are currently live, which keeps the code explicit about where the condition comes from.

## “Effective addresses” instead of offsets

One of the most common sources of bugs in my own assembly is layout drift. I add a field to a struct-like memory block and suddenly every hard-coded offset is wrong. ZAX tries to push that problem back toward the compiler by treating layouts as compile-time address calculations.

ZAX supports arrays and records, since those cover most of what I do on an 8-bit machine. It also supports unions for overlay-style layouts. Indexing yields an effective address, and parentheses are what turns an address into a read or write.

The record syntax looks like this:

```
type Sprite
  x: word
  y: word
  w: byte
  h: byte
  flags: byte
end
```

What I like about it is that `sprites[C].x` is an address I can use directly in Z80 instructions. I do not have to remember that `x` is "offset 0". I also do not have to update a pile of constants when I add a field later.

In plain assembly I might write something like this.

```
ld hl, sprites
add hl, bc
add hl, 7
ld a, (hl) ; "x"
```

In ZAX I would rather write the address expression and let the tool calculate it. That does not remove the need to understand the machine. It does stop me from losing meaning when a layout changes.

## Functions and stack frames without committing to IX/IY

I also wanted to write assembly in a more modular way, which almost always means functions. The minute I have functions, I need a calling convention and I need an answer for locals. ZAX's v0.1 calling convention stays deliberately plain, with arguments as 16-bit stack slots and return values in `HL` (or `L` for a byte result).

What interests me is that ZAX does not require a dedicated frame pointer. It addresses args and locals as `SP + constant offset`, and the compiler tracks SP deltas across the instructions it understands. That tradeoff is not free in practice. It forces the tool to care about stack depth at control-flow joins. It also forces a bit of rewriting for returns when locals exist. I still prefer that tradeoff, since it keeps `IX` and `IY` available for real indexed work.

## Structured control flow that follows the flags

I did not want `if` statements that hide comparisons. In ZAX structured control flow only exists inside `asm`. The conditions for `if` and `while` are Z80 condition codes. Most of the time I reach for `Z` and `NZ`. When the carry flag matters more, I use `C` and `NC`.

That design keeps the relationship with the CPU obvious. If a loop condition depends on the `Z` flag, then the loop body needs to establish the `Z` flag for the next test. Mistakes are still possible, but they are the same mistakes that exist in normal Z80 assembly.

The one structured form that does more work is `select`, which dispatches by equality on a selector value. The compiler may clobber `A` and flags during the dispatch sequence, and I like calling that out up front because it affects how I write the surrounding code.

## `op`: macro-instructions without the macro headaches

I still like macro-instructions for common patterns. The problem is that classic assembler macros are textual. The mess shows up in error spans. It also shows up when I try to nest macros. The worst failures are when tiny formatting changes produce different expansions.

ZAX’s `op` system is closer to overloading than to macro expansion. Ops have operand matchers and overload resolution, and substitution happens on parsed operands rather than raw text.

In ZAX an `op` definition reads like this.

```
op add16(dst: HL, src: reg16)
  add hl, src
end

op add16(dst: DE, src: reg16)
  ex de, hl
  add hl, src
  ex de, hl
end
```

This is not as flexible as a general macro language, and I prefer that. I want the compiler to be able to say, "this op matches these operands", then produce stable output with stable diagnostics.

## Where I am aiming

ZAX is not finished. It is still becoming the assembler I want to use on real programs. The roadmap for the project is deliberately assembler-first. It treats determinism and diagnostics as core work. It also treats ISA edge cases as the details that decide whether the tool is trustworthy.

The intent is already clear to me. I want to write Z80 in a way that I can still read later, and I want the tool to enforce enough structure that my future self has fewer surprises.
