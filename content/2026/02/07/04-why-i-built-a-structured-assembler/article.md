---
status: published
title: "Why I Built a Structured Assembler for the Z80"
summary: "Traditional Z80 assemblers give you mnemonics and macros, but the control flow remains a tangle of labels and jumps. ZAX adds structured programming constructs while keeping explicit register control. The result is assembly code that reads like Pascal but compiles like raw machine code."
tags:
  - zax
  - z80
  - assembler
  - structured-programming
  - compilers
series: zaxassembler
---

# Why I Built a Structured Assembler for the Z80

By John Hardy

I have written a lot of Z80 assembly over the years. The code works but maintaining it requires careful attention to every jump target. A simple loop with an early exit becomes a maze of forward references. An if-else chain becomes a ladder of conditional jumps with labels like `skip1` or `skip2` or `done`. The logic is correct, but reading it requires mentally reconstructing the control flow from scattered branch instructions.

High-level languages solved this problem decades ago when Pascal and C introduced statements that express intent directly. Their `if` and `while` constructs let the compiler handle jumps so programmers think about what code does rather than where it goes. Macro assemblers tried to bring this convenience to assembly language, but macros operate on text. They expand before the assembler sees the code. Error messages point to expanded lines, not the original source. Nested macros interact in surprising ways, and the abstraction leaks.

ZAX takes a different approach by using a proper compiler that parses structured control flow into an AST. The compiler emits Z80 machine code with correct jump fixups. The structure is real rather than textual because the compiler knows about `if` and `while` at the same level it knows about `LD` and `ADD`.

## Assembly semantics, structured syntax

ZAX is still assembly language where you choose registers and manage flags yourself. The language does not hide memory decisions or make them for you. Writing `LD A, (buffer)` produces exactly one Z80 instruction that loads the accumulator from memory. What ZAX adds is structure for control flow. Instead of writing:

```
    or a
    jp z, skip
    ; body
skip:
```

With ZAX the same logic becomes clearer because the structure is explicit in the source:

```
    or a
    if NZ
      ; body
    end
```

The compiler emits the same conditional jump instruction that the handwritten version uses. The difference is that intent is now visible at a glance. Nesting works naturally so that an `if` inside a `while` inside another `if` remains readable.

## Condition codes, not boolean expressions

A key design decision: ZAX uses the CPU's own condition codes rather than inventing boolean expressions. The Z80 already has four testable flags plus eight condition codes that test them. Every conditional jump instruction uses these codes. ZAX's structured control flow uses them too. You set flags with normal Z80 instructions then use the result.

```
    cp 10
    if C
      ; value < 10
    else
      ; value >= 10
    end
```

The `cp 10` instruction sets flags, and the `if C` tests the carry flag. ZAX does not evaluate an expression or generate comparison code because the programmer controls exactly which instruction sets the flags and which flags the control flow statement tests. This design keeps ZAX close to the metal. Any flag-setting instruction can precede a control flow statement: bit tests work just as well as arithmetic or logical operations.

## Types for layout, not for safety

ZAX has a type system that serves layout rather than safety. The purpose is to let the compiler calculate field offsets automatically. You define records and arrays so the compiler knows your memory layout:

```
type Sprite
  x: word
  y: word
  flags: byte
end

var
  sprites: Sprite[4]
```

Now `sprites[C].x` is a valid effective address, and the compiler computes the offset from the array base to the field within the indexed record. Loading and storing remain explicit operations, with the programmer choosing which register holds the index. The type system tells the compiler how you have laid out memory so it can generate correct addresses.

This differs from high-level languages where types prevent you from treating a Sprite as raw bytes. ZAX has no such restrictions, and types describe layout without preventing direct memory access when you know what you are doing.

## Whole-program compilation

ZAX compiles everything at once into a single namespace where forward references resolve at compile time. The output is a flat binary with optional Intel HEX files for programming ROMs.

The approach eliminates linkers because object files disappear when the compiler avoids separate compilation units that might disagree about calling conventions. Seeing the whole program lets the compiler produce deterministic output suited for ROM development where every address is known at compile time. Debug symbols go into a separate JSON file that debuggers can load alongside the binary.

## The gap ZAX fills

Existing Z80 tools fall into two camps. Traditional assemblers give you mnemonics with macros but nothing more. High-level compilers like SDCC generate code from C but hide the machine entirely. ZAX sits between these camps by letting you write instructions while managing registers just like traditional assembly. Yet you also get structured control flow with typed layouts alongside a proper calling convention that uses stack-based arguments. The code remains low-level and predictable while becoming easier to read and maintain.

I built ZAX because I wanted to write Z80 programs the way I think about them: as structured code that happens to target a specific processor. The result is a language that feels like assembly when you need precision and like Pascal when you need structure.

