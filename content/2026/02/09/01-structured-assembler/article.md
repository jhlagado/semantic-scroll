---
status: published
title: "Introducing ZAX"
date: 2026-02-09
summary: "ZAX is a structured assembler for the Z80 family that keeps registers, flags, and memory placement explicit while giving larger programs modules, typed layouts, real function calls, and readable control flow."
tags:
  - zax
  - z80
  - assembler
  - structured-programming
  - compilers
series: zaxassembler
---

# Introducing ZAX

by John Hardy

ZAX is a structured assembler for the Z80 family. I built it for the stage of assembly programming where a project stops being a few routines and starts becoming a codebase. Registers, flags, memory placement, and instruction choice still matter just as much as they do in ordinary assembly. ZAX keeps those decisions explicit and adds structure around them so the source stays readable as the program grows.

The goal is practical. I want the directness of assembly without letting larger programs dissolve into labels, calling conventions in comments, and hand-maintained offset arithmetic. ZAX gives that work a place in the language itself.

## Assembly remains explicit

ZAX still works in assembly terms. I choose registers. I set flags with ordinary Z80 instructions. I decide what lives in ROM and what lives in RAM. A call still lowers to a normal Z80 call sequence. A loop still depends on the machine state I established in the instructions above it.

That directness is important because the machine is the whole point. When I read a ZAX file, I still want to see how the code relates to hardware, registers, flags, and storage. ZAX keeps that view intact.

## The source gains structure

What ZAX adds is structure at the level where larger projects usually become fragile. Source files become modules with imports, named sections, and exported entry points. Memory layouts can be declared with arrays, records, unions, and enums. Functions have typed arguments, locals, and a stable calling convention. Control flow can be written with `if`, `while`, `repeat`, and `select`, while still using the Z80 condition codes directly.

This gives the source a stronger shape without changing what kind of program it is. It is still assembly. It simply carries more of the design in the file itself.

Here is a small example from the kind of code ZAX is meant to support:

```zax
const MsgLen = 5

section data vars at $4000
  msg: byte[5] = "HELLO"
end

extern func bios_putc(ch: byte): void at $F003

export func main(): void
  var
    p: addr
  end
  ld hl, msg
  ld p, hl

  ld b, MsgLen
  repeat
    ld hl, p
    ld a, (hl)
    inc hl
    ld p, hl
    push bc
    bios_putc A
    pop bc
    dec b
  until Z
end
```

The instructions are ordinary Z80 work. The file around them is the part that changes. Data has a named section. The external BIOS routine has a declaration. The program entry point is explicit. The loop reads as a loop.

## Why this matters

The value in ZAX is that assembly projects keep their shape for longer. Imports show where names come from. Layout declarations keep offsets attached to the data they describe. Function boundaries give calls a stable form. Structured control flow makes the execution path easier to recover after time away from the code.

That is the concept behind the project. ZAX is assembly with enough structure to stay coherent when the program becomes real.
