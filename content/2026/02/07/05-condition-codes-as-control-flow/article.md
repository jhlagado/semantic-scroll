---
title: "Condition Codes as Control Flow: How ZAX Turns CPU Flags into If Statements"
summary: "Most structured languages evaluate boolean expressions to drive control flow. ZAX takes a different path: it uses the Z80's native condition codes directly. You set flags with normal instructions, then branch on them with if, while, and repeat. The CPU already knows how to test conditions. ZAX just gives that mechanism readable syntax."
tags:
  - zax
  - z80
  - control-flow
  - condition-codes
  - compiler-design
series: zaxassembler
status: published
---

# Condition Codes as Control Flow: How ZAX Turns CPU Flags into If Statements

By John Hardy, ZAX design notes and compiler diary. When I designed ZAX's control flow, I faced a choice. I could invent a boolean expression syntax that generates comparison code. Alternatively, I could use what the Z80 already provides: condition codes that test CPU flags. I chose the second path for ZAX.

The Z80 exposes four testable flag bits. The CPU sets these flags as side effects of arithmetic and logical operations, and conditional jump instructions test them directly. For example, `JP Z` jumps if Zero is set, while `JP NC` jumps if Carry is clear. The four bits are Zero (Z) and Carry (C). The other two are Sign (S) and Parity/Overflow (P/V).

ZAX's structured control flow uses these same condition codes. Instead of writing `JP Z, label`, you write `if Z`. Then you write the body and close with `end`. The syntax changes, but the underlying mechanism remains identical. This approach keeps the connection between source code and CPU behaviour transparent.

## The eight condition codes

ZAX supports eight condition codes matching the Z80's conditional branch instructions. Each condition tests a single flag bit. Zero uses `Z` or `NZ`, and Carry uses `C` or `NC`. Sign uses `M` or `P`, and parity uses `PE` or `PO`. Each code maps directly to a Z80 branch instruction, making the correspondence explicit.

Before using a control flow statement, programmers must establish the flag state. This is typically done with a comparison, but arithmetic operations and bit tests can also set the relevant flags. By making flag-setting explicit, ZAX gives the programmer direct control over branching logic. That clarity is in the design contract.

## Setting flags before testing them

Consider a simple bounds check. Suppose you want to execute code if register A is less than 10. In ZAX, you write:

```
cp 10
if C
  ; A < 10
end
```

The `CP 10` instruction subtracts 10 from A without storing the result. If A is less than 10, the subtraction borrows, so the Carry flag is set. The `if C` statement tests this flag and executes the body if Carry is set.

This pattern might feel backwards if you come from C or Pascal, where you write `if (a < 10)` and the compiler figures out the comparison. In ZAX, you write the comparison explicitly and then test the result. The explicit approach has advantages beyond familiarity. It lets you choose exactly which instruction sets the flags, and it allows any flag-setting operation to drive the branch. This flexibility is a core strength of ZAX, especially on an 8-bit CPU.

You can also use bitwise operations to set flags in the same way:

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

Each example uses a different instruction to set flags. The structured test that follows makes the intent clear and keeps the code readable. The CPU's native mechanisms determine control flow, and this approach keeps that link visible.

## Loops and condition evaluation

ZAX provides three loop forms, each testing conditions at different points. The `while` loop tests the condition at entry before executing the body, so the loop may not execute if the condition fails. It is a familiar pattern for most programmers. In ZAX, the condition is always a CPU flag, not a boolean expression.

```
while NZ
  ; body executes while Z flag is not set
  dec a
  or a
end
```

The compiler evaluates the condition at the `while` keyword. If the condition passes, the body executes. At the end of the body, control returns to the `while` for another test. The body must set flags for the next iteration. In the example above, `or a` sets the Zero flag if A has reached zero.

The `repeat-until` loop tests the condition at exit after executing the body. It mirrors a do-while loop in a high-level language. The loop must set flags before the `until` check.

```
repeat
  ; body always executes at least once
  dec a
  or a
until Z
```

The body executes first, then the compiler evaluates the condition at `until`. If the condition is false, the loop repeats, guaranteeing at least one iteration. You control which instruction sets the flags for that final test.

Both loop forms require the programmer to establish flags within the loop body. The compiler does not insert any flag-setting code. You choose how to set up the condition for each iteration.

## The case against boolean expressions

I considered adding boolean expression syntax, perhaps `if A < 10` that would compile to a comparison followed by a conditional branch. This would feel more familiar to programmers coming from high-level languages.

I rejected this approach for several reasons. It would require the compiler to generate comparison code, which removes control over the exact instructions that execute. The Z80's condition codes do not map cleanly to boolean algebra. Many flag-setting operations are not comparisons, so a boolean syntax would fail to cover core use cases. Bit tests and logical operations set flags, and decrements and rotates do as well.

By using condition codes directly, ZAX stays close to the machine. You can see exactly which flags the control flow tests, and you can use any instruction that sets flags. The deliberate thin abstraction keeps the programmer in control. This design choice makes ZAX both powerful and predictable for those who understand the Z80's flag system.

## The select statement

ZAX also has `select-case-end` for multi-way branching. Unlike `if`, `select` does not use condition codes. It dispatches by comparing a selector value against case constants. The compiler generates comparison and branch sequences (or a jump table for dense cases). The programmer provides the selector value; the compiler handles the dispatch logic.

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

This is the one place where ZAX generates comparison code. I made this exception because multi-way dispatch on a value is common and error-prone to write by hand. The potential for off-by-one errors in jump tables justifies the abstraction.

## Lowering to jumps

The compiler lowers structured control flow to labels and jumps. An if-else-end block becomes: 

```
jp nz, else_label
; if body
jp end_label
else_label:
; else body
end_label:
```

A while-end block compiles to a similar pattern. The loop label comes first, then a branch to the end label. This layout keeps the test at the top of the loop.

```
while_label:
jp z, end_label
; loop body
jp while_label
end_label:
```

The generated labels remain hidden from the programmer and do not appear in the symbol table or conflict with user-defined labels. The compiler handles forward references and displacement calculations automatically. That keeps the symbol table clean for user-defined names.

For relative branches (`JR` instead of `JP`), the compiler checks displacement limits. If a structured block is too large for a relative branch, the compiler uses absolute jumps instead. This preserves correctness without forcing manual sizing.

## Living with condition codes

Using condition codes directly takes adjustment if you come from high-level languages. It means learning which instruction sets which flags. You learn common patterns, such as `or a` to test whether A is zero. Another is `bit n, reg` to test a bit. Use `cp value` when you need a direct compare.

The payoff is precise control and readable structure. You know exactly what code executes because you wrote it, and you know exactly which flags the control flow tests because you chose them. The structure makes the intent visible without hiding the mechanism.
