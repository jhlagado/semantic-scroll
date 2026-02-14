---
status: published
title: "Structured Assembly With ZAX"
summary: "ZAX brings structured programming shape to assembly source while keeping register and flag control explicit. This article explains the programming model that connects familiar module-level structure with direct Z80 instruction work. The goal is code that remains readable months later and still compiles into predictable machine output."
tags:
  - zax
  - z80
  - structured-programming
  - assembler
  - language-design
series: zaxassembler
---

# Structured Assembly With ZAX

By John Hardy

Long-lived assembly projects succeed when source files preserve intent after the original sprint ends. My early Z80 projects solved the immediate task and ran on hardware. Maintenance sessions then became slow because control flow and layout intent had scattered through labels and comments plus informal naming conventions. ZAX exists to keep intent in the source through explicit structure that survives refactoring and late-stage feature work.

Structured form in ZAX starts with file organisation. Declarations for constants and layouts sit in predictable sections. Globals and callable routines follow the same ordering rule. Data shape and executable logic therefore appear in a stable order. That organisation helps during code review because each file reads like a designed module with clear boundaries. New contributors can scan memory layout first and follow executable flow with fewer jumps through the file.

Control flow follows CPU flags directly inside `asm` blocks. Instructions set flags, then structured keywords consume those conditions through explicit condition codes. I rely on codes such as `Z` and `NZ` during most routines, then switch to carry codes when needed. This model keeps branch intent visible and keeps branch mechanics attached to the same flag rules that the processor already enforces.

A small loop demonstrates the style:

```zax
ld b, MsgLen
repeat
  ld hl, (p)
  ld a, (hl)
  inc hl
  ld (p), hl
  call bios_putc
  dec b
until Z
```

Source layout and machine semantics stay aligned in this pattern. The body states memory movement and call boundaries in plain instruction form. The terminating condition points to the `Z` flag produced by `dec b`. I can read that block after a long break and recover the execution story quickly.

Typed layout support extends the same clarity to memory addressing. Arrays and records plus `offsetof` let the compiler calculate offsets from declared structure. Explicit load and store instructions remain in source. Address expressions stay meaningful in source, and emitted code keeps the exact register-level behaviour that assembly programmers expect.

Function calls follow stable conventions with compile-time checking for typed arguments and return placement. Preservation rules stay explicit in call boundaries. Stack discipline remains visible in the generated code and in lowering diagnostics. That discipline matters on Z80 because register pressure appears quickly in routines that mix loops with table lookups and device access.

Readers coming from C or Pascal can recognise familiar structural rhythm in ZAX files and drop into direct instruction work without switching languages. Developers with classic assembler backgrounds can keep full control of machine state while gaining stronger source structure. ZAX treats structure as a practical tool for maintainability in real assembly codebases.
