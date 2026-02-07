---
status: published
title: "Condition Codes as Control Flow: How ZAX Turns CPU Flags into If Statements"
summary: "Most structured languages evaluate boolean expressions to drive control flow. ZAX takes a different path: it uses the Z80's native condition codes directly. You set flags with normal instructions, then branch on them with if, while, and repeat. The CPU already knows how to test conditions. ZAX just gives that mechanism readable syntax."
tags:
  - zax
  - z80
  - control-flow
  - condition-codes
  - compiler-design
series: zaxassembler
---

# Condition Codes as Control Flow: How ZAX Turns CPU Flags into If Statements

By John Hardy

When I designed ZAX's control flow, I faced a choice. I could invent a boolean expression syntax and generate comparison code, or I could use what the Z80 already provides: condition codes that test CPU flags. I chose the second path.

The Z80 has a flags register with four testable bits: Zero (Z), Carry (C), Sign (S), and Parity/Overflow (P/V). The CPU sets these flags as side effects of arithmetic and logical operations. Conditional jump instructions test these flags: `JP Z` jumps if Zero is set, `JP NC` jumps if Carry is clear, and so on.

ZAX's structured control flow uses these same condition codes. Instead of writing `JP Z, label`, you write `if Z ... end`. The syntax changes, but the mechanism stays the same.

## The eight condition codes

ZAX supports eight condition codes, matching the Z80's conditional branch instructions:

- `Z` and `NZ`: Zero flag set or not set
- `C` and `NC`: Carry flag set or not set
- `M` and `P`: Sign flag set (minus) or not set (plus)
- `PE` and `PO`: Parity even or parity odd

Each condition tests a single flag bit. The programmer establishes the flag state before the control flow statement, typically with a comparison, arithmetic operation, or bit test.

## Setting flags before testing them

Consider a simple bounds check. You want to execute code if register A is less than 10:

```
cp 10
if C
  ; A < 10
end
```

The `CP 10` instruction subtracts 10 from A without storing the result. If A is less than 10, the subtraction would borrow, so the Carry flag is set. The `if C` tests this flag and executes the body if Carry is set.

This pattern might feel backwards if you are used to C or Pascal, where you write `if (a < 10)` and the compiler figures out the comparison. In ZAX, you write the comparison explicitly and then test the result.

The explicit approach has advantages. You control exactly which instruction sets the flags. You can use any flag-setting operation, not just comparisons:

```
and $0F
if Z
  ; low nibble was zero
end

bit 7, a
if NZ
  ; bit 7 was set
end

dec b
if NZ
  ; B has not reached zero
end
```

Each example uses a different instruction to set flags, followed by a structured test of the result.

## Loops and condition evaluation

ZAX provides three loop forms, each testing conditions at different points.

The `while` loop tests at entry:

```
while NZ
  ; body executes while Z flag is not set
  dec a
  or a
end
```

The condition is evaluated at the `while` keyword. If it passes, the body executes. At the end of the body, control returns to the `while` for another test. The body must set flags for the next iteration; here, `or a` sets the Zero flag if A has reached zero.

The `repeat...until` loop tests at exit:

```
repeat
  ; body always executes at least once
  dec a
  or a
until Z
```

The body executes first, then the condition is evaluated at `until`. If the condition is false, the loop repeats. This form guarantees at least one iteration.

Both loop forms require the programmer to establish flags within the loop body. The compiler does not insert any flag-setting code. You choose how to set up the condition for each iteration.

## Why not boolean expressions?

I considered adding boolean expression syntax. Something like `if A < 10` that would compile to a comparison followed by a conditional branch. This would feel more familiar to programmers coming from high-level languages.

I rejected this approach for several reasons.

First, it would require the compiler to generate comparison code. The programmer would lose control over exactly which instructions execute. For performance-critical code on an 8-bit processor, this matters.

Second, the Z80's condition codes do not map cleanly to boolean algebra. The Parity flag doubles as an overflow indicator for signed arithmetic. The Sign flag has subtleties in edge cases. A boolean abstraction would need to hide these details or expose them awkwardly.

Third, many flag-setting operations are not comparisons. Bit tests, logical operations, decrements, and rotates all set flags. A boolean expression syntax would not cover these cases elegantly.

By using condition codes directly, ZAX stays close to the machine. You can see exactly which flags are tested. You can use any instruction that sets flags. The abstraction is thin by design.

## The select statement

ZAX also has `select...case...end` for multi-way branching. Unlike `if`, `select` does not use condition codes. It dispatches by comparing a selector value against case constants:

```
ld a, (mode)
select A
  case 0
    ; handle mode 0
  case 1
    ; handle mode 1
  else
    ; handle other modes
end
```

The compiler generates comparison and branch sequences (or a jump table for dense cases). The programmer provides the selector value; the compiler handles the dispatch logic.

This is the one place where ZAX generates comparison code. I made this exception because multi-way dispatch on a value is common and error-prone to write by hand. The potential for off-by-one errors in jump tables justifies the abstraction.

## Lowering to jumps

The compiler lowers structured control flow to labels and jumps. An `if Z ... else ... end` becomes:

```
jp nz, else_label
; if body
jp end_label
else_label:
; else body
end_label:
```

A `while NZ ... end` becomes:

```
while_label:
jp z, end_label
; loop body
jp while_label
end_label:
```

The generated labels are hidden. They do not appear in the symbol table or conflict with user-defined labels. The compiler handles forward references and displacement calculations automatically.

For relative branches (`JR` instead of `JP`), the compiler checks displacement limits. If a structured block is too large for a relative branch, the compiler uses absolute jumps instead.

## Living with condition codes

Using condition codes directly takes adjustment if you come from high-level languages. You learn to think about which instruction sets which flags. You learn the patterns: `or a` to test if A is zero, `bit n, reg` to test a bit, `cp value` to compare.

The payoff is precise control and readable structure. You know exactly what code executes because you wrote it. You know exactly which flags are tested because you chose them. The structure makes the intent visible without hiding the mechanism.

