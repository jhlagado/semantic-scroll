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

Most calling conventions dedicate a register as the frame pointer. On x86, EBP points to the base of the current stack frame. On ARM, the frame pointer register (R11 or FP) serves the same purpose. Code accesses local variables and function arguments as fixed offsets from this pointer. This approach provides a stable reference for stack-based data, making it easier to generate and debug code across different architectures.

The Z80 has candidates for this role: the index registers IX and IY support displacement addressing, where `(IX+d)` accesses memory at IX plus a signed 8-bit offset. Many Z80 compilers use IX as a frame pointer, loading it at function entry and using it to access locals and arguments throughout the function body. This method leverages the Z80's unique register set, but it comes with trade-offs that affect register availability and code flexibility.

ZAX does not use a frame pointer. Instead, the compiler tracks the stack pointer's offset as code executes and computes SP-relative addresses at compile time. The generated code accesses locals and arguments by loading their addresses into HL, then using HL for indirection. This approach avoids tying up IX or IY, leaving them available for other uses. The compiler must be precise about stack changes, tracking every push and pop. The payoff is flexibility and efficiency, especially in code that needs every register.

## The cost of a frame pointer

Dedicating IX (or IY) to stack frame access has costs because the Z80 has limited registers, and losing an index register hurts. IX and IY are the only registers that support displacement addressing. If IX holds the frame pointer, you cannot use `(IX+d)` for other purposes without saving and restoring it. Many Z80 programs use IX along with IY for data structure access or game sprite tables or other pointer operations. Reserving one for the stack frame eliminates this option.

Frame pointer setup also adds overhead. The standard prologue must push the old frame pointer and copy SP to IX. The epilogue reverses this sequence, meaning every function pays this cost whether it needs locals or not. This overhead accumulates, especially in code with many small functions. Over time, these small costs add up, making the program less efficient than it could be.

## SP-relative addressing

ZAX takes a different approach based on precise stack tracking at every point in the function. Pushing a value makes the compiler note that SP decreased by 2, while popping increases SP by 2. Calls along with returns adjust SP accordingly by two bytes each.

Given this tracking, the compiler can compute the offset from SP to any local variable or argument. A local at offset 8 from the function's base frame is at SP+8 if no pushes have occurred. After one push, that local moves to SP+10. Each additional push increases the offset by two.

When you reference a local in an instruction, the compiler generates code to compute its current address. First, it loads the offset into HL. Then, it adds HL to SP. This two-step process is straightforward and easy to follow. It ensures that local variable access remains efficient, even without a dedicated frame pointer.

```
ld hl, local_offset
add hl, sp
```

Now HL points to the local variable. You can load from it with `(HL)` or store to it. The two-instruction sequence replaces the single `(IX+d)` instruction a frame pointer convention would use, but it frees IX entirely. This tradeoff is worth it for most Z80 programs. Register flexibility is valuable, and ZAX’s approach preserves it.

## The trampoline mechanism

One complication arises from the `RET` instruction. A function can return from multiple points: early returns, returns inside conditionals, returns at the end. Each return must clean up the stack frame before transferring control to the caller. Without a frame pointer, this cleanup requires careful handling. The compiler inserts code to ensure the stack is always restored, no matter where the return occurs.

With a frame pointer, cleanup is straightforward: restore SP from the frame pointer and return. Without a frame pointer, the compiler needs another approach. The absence of a fixed reference point means the compiler must track stack changes precisely to ensure correct cleanup at every return.

ZAX uses a hidden return trampoline to solve this problem. When a function has local variables, the prologue does not just reserve space. It also pushes the original SP value and the address of an epilogue routine. The stack layout at the start of the user's code looks like:

```
SP+0: trampoline address (points to epilogue)
SP+2: saved original SP
SP+4: local variables start here
...
```

When user code executes `RET`, it pops the trampoline address into PC. Control transfers to the epilogue, which pops the saved SP then restores it then executes the real return to the caller. This trampoline mechanism ensures that every return, no matter where it occurs in the function, results in proper stack cleanup and a safe transfer of control.

This mechanism lets the programmer write `RET` anywhere in the function. The compiler ensures that every return path goes through the epilogue, which properly cleans up the stack frame. This design makes writing and maintaining functions easier, since you do not have to worry about stack cleanup in every return branch.

## Functions without locals

When a function has no local variables, the frame size is zero. The compiler skips the trampoline setup entirely. The stack contains only the return address at SP+0, followed by any arguments.

In this case, `RET` transfers control directly to the caller without any epilogue overhead because functions that do not need locals pay no cost for the trampoline mechanism.

This optimisation matters for leaf functions and small utility routines. Most functions in a typical program have few or no locals. Only functions with local variables incur the trampoline overhead. For these small routines, the absence of extra stack management code keeps them fast and compact.

## Tracking stack depth

The compiler must track stack depth precisely for SP-relative addressing to work. Every instruction that modifies SP updates the compiler's internal offset:

- `PUSH` decreases SP by 2. The stack grows downward, so every push moves SP to a lower address.
- `POP` increases SP by 2. When you pop, SP returns toward its original value.
- `CALL` decreases SP by 2. Each call pushes the return address onto the stack. The function will use this address when it finishes.
- `RET` increases SP by 2. This pops the return address from the stack.
- `INC SP` and `DEC SP` adjust by 1. These instructions increment or decrement the stack pointer by one.

At control flow joins (the end of an `if`/`else`, loop back-edges, and `select` arm exits), the stack depth must match across all paths. If one path pushes a value that another path does not, the join point would have inconsistent SP offsets. The compiler rejects such programs at compile time.

This constraint requires discipline. You cannot conditionally push a value and expect to access locals correctly afterward. The structured control flow forms enforce matched stack depths at their boundaries. This rule helps prevent subtle bugs and keeps stack management predictable.

## Argument access

The caller passes arguments on the stack, pushing them right-to-left so that the first argument ends up closest to the return address. The caller cleans up arguments after the call returns. This convention ensures that arguments are always in a known location relative to the stack frame.

The compiler computes argument offsets based on the frame size and the number of arguments. For a function with locals:

```
argument i is at SP + frameSize + 6 + (2 * i)
```

The 6 accounts for the trampoline address plus the saved SP plus the return address. Without locals:

```
argument i is at SP + 2 + (2 * i)
```

The 2 accounts for the return address only.

When you reference an argument in your code, the compiler generates the same `LD HL, offset / ADD HL, SP` sequence it uses for locals. Arguments and locals are both SP-relative; they differ only in their offsets.

## Trade-offs

SP-relative addressing has trade-offs since each local or argument access costs two instructions instead of one. Functions that access locals frequently may generate more code than a frame pointer approach would.

The benefit is architectural freedom because IX and IY remain available for whatever the programmer needs. On a register-starved processor like the Z80, this flexibility matters. Many programs need index registers for data structure access more than they need slightly faster local variable access. The trade-off is usually worth it for most real-world Z80 projects.

The trampoline mechanism adds overhead for functions with locals, but only for those functions. The common case of small functions without locals incurs no penalty. This selective overhead keeps the majority of functions lean and efficient.

## Implementation notes

The prologue for a function with locals looks approximately like this:

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

The epilogue routine handles the cleanup:

```
__zax_epilogue:
pop hl        ; discard trampoline address
pop hl        ; get saved old SP
ld sp, hl     ; restore SP
ret           ; return to caller
```

The exact instruction sequences vary based on optimisation opportunities, but the structure remains: save the original SP, reserve space, push the return path, and let user code run. At any `RET`, control flows through the epilogue, which restores SP and returns. This mechanism covers all valid return paths, ensuring stack cleanup is always handled correctly, regardless of how the function exits. By centralising cleanup, the design reduces the risk of subtle stack errors and makes the calling convention easier to reason about.

This mechanism emerged from the constraint that ZAX must support `RET` anywhere in the function body without requiring the programmer to think about cleanup. The trampoline makes early returns just work, at the cost of a few bytes of stack space and a few extra instructions in the prologue and epilogue.
