---
status: published
title: "How ZAX Makes Larger Z80 Programs Manageable"
summary: "ZAX gives larger Z80 programs a stronger shape through modules, named sections, typed layouts, stable call boundaries, and structured control flow that still follows the machine."
tags:
  - zax
  - z80
  - structured-programming
  - assembler
  - language-design
series: zaxassembler
---

# How ZAX Makes Larger Z80 Programs Manageable

By John Hardy

ZAX matters most when a Z80 program stops being a single routine and starts becoming a codebase. At that point the problem is not instruction syntax. The problem is keeping modules, memory layouts, call boundaries, and control flow understandable as the program grows. ZAX gives those parts a clear place in the language so the source continues to read like a program instead of a pile of local assembler conventions.

## Files read like modules

ZAX starts by treating the source file as a module. Imports live at module scope. Code and data live in named sections. Public entry points are marked with `export`. External routines at fixed addresses can be declared once and then called through a normal function-like surface. This gives a project a stable shape from the first screenful of source onward.

That structure is useful because it reduces hidden knowledge. I do not need to remember which label is intended as an entry point or which block of bytes belongs to which subsystem. The file tells me.

## Memory layout lives in the source

The next improvement comes from typed layout declarations. ZAX supports arrays, records, unions, and enums so the source can describe memory the same way the program uses it. The compiler then handles the offset arithmetic that would otherwise live in comments or hard-coded constants.

That changes the way addressing reads. A form like `sprites[C].x` expresses the same intent that exists in my head when I write the code. The addressing model still lowers to ordinary Z80 work, but the layout calculation moves into the compiler where it belongs. The result is less drift between the program design and the addresses in the source.

## Calls have a stable shape

ZAX also gives functions a real boundary. A function declaration names the arguments, return type, and locals. An external ROM or BIOS routine can be declared with the same surface, including its fixed address. Call sites then stay compact and readable while the compiler handles the push, call, and cleanup sequence consistently.

That consistency matters in assembly. A large program collects many tiny calling conventions if the tool does not provide one. ZAX gives the project a single calling model that I can rely on across modules.

## Control flow stays readable

Structured control flow completes the picture. ZAX provides `if`, `while`, `repeat`, and `select`, and each one still depends on the flags that the instructions have already set. The source gains the shape of a loop or branch without losing the underlying machine logic.

This kind of loop is typical:

```zax
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
```

The machine story is still there. `dec b` sets the zero flag and `until Z` uses it. ZAX simply carries the branch bookkeeping so the source keeps its shape.

## A better environment for real assembly work

ZAX does not try to hide the hard parts of assembly programming. It gives those hard parts a better environment. Source files gain a module structure. Layouts stay attached to the code that uses them. Calls follow a single convention. Control flow reads cleanly. That is enough to make a large difference in a long-lived Z80 project.

That is the practical promise of ZAX. It keeps assembly direct and makes bigger programs easier to hold in my head.
