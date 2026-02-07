---
status: published
title: "Stack Frames Without a Frame Pointer"
summary: "Traditional calling conventions dedicate a register as a frame pointer to access local variables and arguments. ZAX takes a different approach for the Z80: it uses SP-relative addressing with compiler-tracked offsets. The result frees IX and IY for other uses while still supporting functions with locals, arguments, and nested returns."
tags:
  - zax
  - z80
  - calling-convention
  - stack-frames
  - compiler-design
series: zaxassembler
---

# Stack Frames Without a Frame Pointer

By John Hardy

Most calling conventions dedicate a register as the frame pointer. On x86, EBP points to the base of the current stack frame. On ARM, the frame pointer register (R11 or FP) serves the same purpose. Local variables and function arguments are accessed as fixed offsets from this pointer.

The Z80 has candidates for this role: the index registers IX and IY support displacement addressing, where `(IX+d)` accesses memory at IX plus a signed 8-bit offset. Many Z80 compilers use IX as a frame pointer, loading it at function entry and using it to access locals and arguments throughout the function body.

ZAX does not use a frame pointer. Instead, the compiler tracks the stack pointer's offset as code executes and computes SP-relative addresses at compile time. Locals and arguments are accessed by loading their addresses into HL, then using HL for indirection.

## The cost of a frame pointer

Dedicating IX (or IY) to stack frame access has costs. The Z80 has limited registers, and losing one of the index registers hurts.

IX and IY are the only registers that support displacement addressing. If IX holds the frame pointer, you cannot use `(IX+d)` for other purposes without saving and restoring it. Many Z80 programs use IX and IY for data structure access, game sprite tables, or other pointer operations. Reserving one for the stack frame eliminates this option.

Frame pointer setup also adds overhead. The standard prologue pushes the old frame pointer and copies SP to IX. The epilogue reverses this. Every function pays this cost whether it needs locals or not.

## SP-relative addressing

ZAX takes a different approach. The compiler knows the exact state of the stack at every point in the function. When you push a value, the compiler notes that SP decreased by 2. When you pop, SP increased by 2. Calls and returns adjust SP accordingly.

Given this tracking, the compiler can compute the offset from SP to any local variable or argument. A local at offset 8 from the function's base frame is at SP+8 if no pushes have occurred, at SP+10 after one push, and so on.

When you reference a local in an instruction, the compiler generates code to compute its current address:

```
ld hl, local_offset
add hl, sp
```

Now HL points to the local variable. You can load from it with `(HL)` or store to it. The two-instruction sequence replaces the single `(IX+d)` instruction a frame pointer convention would use, but it frees IX entirely.

## The trampoline mechanism

One complication: the `RET` instruction. A function can return from multiple points: early returns, returns inside conditionals, returns at the end. Each return must clean up the stack frame before transferring control to the caller.

With a frame pointer, cleanup is straightforward: restore SP from the frame pointer and return. Without a frame pointer, the compiler needs another approach.

ZAX uses a hidden return trampoline. When a function has local variables, the prologue does not just reserve space. It also pushes the original SP value and the address of an epilogue routine. The stack layout at the start of the user's code looks like:

```
SP+0: trampoline address (points to epilogue)
SP+2: saved original SP
SP+4: local variables start here
...
```

When user code executes `RET`, it pops the trampoline address into PC. Control transfers to the epilogue, which pops the saved SP, restores it, and executes the real return to the caller.

This mechanism lets the programmer write `RET` anywhere in the function. The compiler ensures that every return path goes through the epilogue, which properly cleans up the stack frame.

## Functions without locals

When a function has no local variables, the frame size is zero. The compiler skips the trampoline setup entirely. The stack contains only the return address at SP+0, followed by any arguments.

In this case, `RET` transfers control directly to the caller. No epilogue, no saved SP, no overhead. Functions that do not need locals pay no cost for the trampoline mechanism.

This optimisation matters for leaf functions and small utility routines. Most functions in a typical program have few or no locals. Only functions with local variables incur the trampoline overhead.

## Tracking stack depth

The compiler must track stack depth precisely for SP-relative addressing to work. Every instruction that modifies SP updates the compiler's internal offset:

- `PUSH` decreases SP by 2
- `POP` increases SP by 2
- `CALL` decreases SP by 2 (pushing the return address)
- `RET` increases SP by 2 (popping the return address)
- `INC SP` and `DEC SP` adjust by 1

At control flow joins (the end of an `if`/`else`, loop back-edges, and `select` arm exits), the stack depth must match across all paths. If one path pushes a value that another path does not, the join point would have inconsistent SP offsets. The compiler rejects such programs.

This constraint requires discipline. You cannot conditionally push a value and expect to access locals correctly afterward. The structured control flow forms enforce matched stack depths at their boundaries.

## Argument access

Arguments are passed on the stack, pushed right-to-left by the caller. The first argument is closest to the return address. The caller cleans up arguments after the call returns.

The compiler computes argument offsets based on the frame size and the number of arguments. For a function with locals:

```
argument i is at SP + frameSize + 6 + (2 * i)
```

The 6 accounts for the trampoline address, saved SP, and return address. Without locals:

```
argument i is at SP + 2 + (2 * i)
```

The 2 accounts for the return address only.

When you reference an argument in your code, the compiler generates the same `LD HL, offset / ADD HL, SP` sequence it uses for locals. Arguments and locals are both SP-relative; they differ only in their offsets.

## Trade-offs

SP-relative addressing has trade-offs. Each local or argument access costs two instructions instead of one. Functions that access locals frequently may generate more code than a frame pointer approach would.

The benefit is architectural freedom. IX and IY remain available for whatever the programmer needs. On a register-starved processor like the Z80, this flexibility matters. Many programs need index registers for data structure access more than they need slightly faster local variable access.

The trampoline mechanism adds overhead for functions with locals, but only for those functions. The common case of small functions without locals incurs no penalty.

## Implementation notes

The prologue for a function with locals looks approximately like:

```
; capture old SP
ld hl, 0
add hl, sp
; reserve locals
ld sp, -(frameSize)
add hl, sp
; push saved old SP
push hl
; push trampoline address
ld hl, __zax_epilogue
push hl
```

The epilogue:

```
__zax_epilogue:
pop hl        ; discard trampoline address
pop hl        ; get saved old SP
ld sp, hl     ; restore SP
ret           ; return to caller
```

The exact instruction sequences vary based on optimisation opportunities, but the structure remains: save the original SP, reserve space, push the return path, and let user code run. At any `RET`, control flows through the epilogue, which restores SP and returns.

This mechanism emerged from the constraint that ZAX must support `RET` anywhere in the function body without requiring the programmer to think about cleanup. The trampoline makes early returns just work, at the cost of a few bytes of stack space and a few extra instructions in the prologue and epilogue.

