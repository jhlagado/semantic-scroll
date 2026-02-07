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

I have written a lot of Z80 assembly over the years. The code works, but maintaining it requires careful attention to every jump target and label. A simple loop with an early exit becomes a maze of forward references. An if-else chain becomes a ladder of conditional jumps with labels like `skip1`, `skip2`, and `done`. The logic is correct, but reading it requires mentally reconstructing the control flow from scattered branch instructions.

High-level languages solved this problem decades ago. Pascal, C, and their descendants give you `if`, `while`, and `case` statements that express intent directly. The compiler handles the jumps. You think about what the code does, not where it goes.

Macro assemblers tried to bring this to assembly language, but macros operate on text. They expand before the assembler sees the code. Error messages point to expanded lines, not the original source. Nested macros interact in surprising ways. The abstraction leaks.

ZAX takes a different approach. Instead of text macros, it uses a proper compiler that parses structured control flow into an AST and emits Z80 machine code with correct jump fixups. The structure is real, not textual. The compiler knows about `if` and `while` at the same level it knows about `LD` and `ADD`.

## Assembly semantics, structured syntax

ZAX is still assembly language. You choose registers. You manage flags. You decide what lives in ROM and what lives in RAM. The language does not hide these decisions or make them for you. When you write `LD A, (buffer)`, you get exactly one Z80 instruction that loads the accumulator from memory.

What ZAX adds is structure for control flow. Instead of writing:

```
    or a
    jp z, skip
    ; body
skip:
```

You write:

```
    or a
    if NZ
      ; body
    end
```

The compiler emits the same conditional jump, but the intent is visible in the source. Nesting works naturally. An `if` inside a `while` inside another `if` remains readable because the structure is explicit.

## Condition codes, not boolean expressions

A key design decision: ZAX uses the CPU's own condition codes rather than inventing boolean expressions. The Z80 already has flags (Zero, Carry, Sign, Parity) and condition codes that test them (Z, NZ, C, NC, M, P, PE, PO). Every conditional jump instruction uses these codes. ZAX's structured control flow uses them too.

You set flags with normal Z80 instructions, then use the result:

```
    cp 10
    if C
      ; value < 10
    else
      ; value >= 10
    end
```

The `cp 10` instruction sets flags. The `if C` tests the carry flag. ZAX does not evaluate an expression or generate comparison code. The programmer controls exactly which instruction sets the flags and which flags are tested.

This design keeps ZAX close to the metal. You can use any flag-setting instruction before a control flow statement. Bit tests, arithmetic, logical operations: whatever sets the flags you need.

## Types for layout, not for safety

ZAX has a type system, but its purpose is layout rather than safety. You define records and arrays so the compiler can calculate addresses:

```
type Sprite
  x: word
  y: word
  flags: byte
end

var
  sprites: Sprite[4]
```

Now `sprites[C].x` is a valid effective address. The compiler computes the offset from the array base to the field within the indexed element. You still load and store explicitly. You still choose which register holds the index. The type system tells the compiler how memory is organised so it can generate correct addresses.

This differs from high-level languages where types prevent you from treating a Sprite as raw bytes. ZAX has no such restrictions. Types describe layout. You can always access memory directly if you know what you are doing.

## Whole-program compilation

ZAX compiles everything at once. Imports bring modules into a single namespace. Forward references resolve at compile time. The output is a flat binary with optional Intel HEX and debug map files.

No linker. No object files. No separate compilation units that might disagree about calling conventions or symbol sizes. The compiler sees the whole program and produces deterministic output.

This model suits ROM development. You want a single binary image where every address is known at compile time. Debug symbols go into a separate JSON file that debuggers can load alongside the binary.

## The gap ZAX fills

Existing Z80 tools fall into two camps. Traditional assemblers give you mnemonics and macros, nothing more. High-level compilers (like SDCC or z88dk) generate code from C, hiding the machine entirely.

ZAX sits between these camps. It is still assembly: you write instructions, you manage registers, you control flags. But you also get structured control flow, typed layouts, and a proper calling convention with stack-based arguments. The code remains low-level and predictable while becoming easier to read and maintain.

I built ZAX because I wanted to write Z80 programs the way I think about them: as structured code that happens to target a specific processor. The result is a language that feels like assembly when you need precision and like Pascal when you need structure.

