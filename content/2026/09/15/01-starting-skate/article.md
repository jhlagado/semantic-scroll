---
title: "Starting Skate"
status: published
thumbnail: assets/lisp-to-z80.svg
series: building-skate
summary: "I’m starting Skate, a streaming Scheme compiler for the Z80, initially targeting CP/M. The goal is to run a useful subset of Scheme on a small machine and explain the implementation from language expressions down to assembly."
tags:
  - scheme
  - z80
  - compilers
  - cpm
---
# Starting Skate

By John Hardy

Today I’m starting Skate, a small Scheme compiler for the Z80, initially targeting CP/M. The aim is to compile Scheme programs into native Z80 code, and eventually run the compiler on the Z80 itself. I’m calling it SK8 for short, with `.sk8` as the source-file extension.

Scheme belongs to the Lisp family. If you haven’t used one of these languages, a small expression gives you a way into the notation. In `(+ (* 2 3) 4)`, each procedure call starts with the procedure, followed by its arguments. The inner expression multiplies two by three; its result becomes an argument to the outer addition, giving ten. Parentheses group the expressions, so the structure stays explicit as you combine operations. Procedures can also be values: you can pass one as an argument, return one from another procedure, or store one for later use.

<figure>
  <img src="./assets/lisp-to-z80.svg" alt="The Scheme expression (+ (* 2 3) 4) gives 10. Below it, Skate’s planned workflow connects Scheme source, a streaming compiler, a linker with runtime support, and a native CP/M program." width="1000" height="760">
  <figcaption>Expression nesting and Skate’s planned compilation path. This illustration is public domain.</figcaption>
</figure>

The Z80 has a 64 KiB address space, with some of that already occupied by CP/M. A running Scheme program needs room for its generated code, runtime routines, stacks and dynamically allocated objects. Running the compiler on the same kind of machine adds another constraint: the compiler’s own working storage. I’m designing Skate to read source and emit code incrementally, keeping track of active scopes and recording references to resolve later. The tree in the diagram explains the expression’s structure; streaming compilation lets me process that structure without retaining a tree for the whole program.

The language I’m aiming for includes numbers, symbols, lists and pairs, along with lexical scope and closures. A closure lets a procedure retain access to variables from the context in which it was created, even after the surrounding procedure has returned. I also want proper tail calls, so a procedure can finish by calling another without accumulating a stack of return addresses. Skate’s runtime will reclaim heap objects that the program can no longer reach, including storage for lists and captured variables.

I’m choosing the initial language scope with an educational goal in mind: running selected examples from *Structure and Interpretation of Computer Programs*, usually abbreviated to SICP. Those examples exercise arithmetic, procedures passed as arguments, and compound data built from pairs. I’m commenting the assembly in enough detail to explain what the instructions do and why they’re arranged that way, so someone reading the source can follow the connection between a Scheme operation and its implementation.

There’s already some groundwork in place. The numeric runtime supports exact signed sixteen-bit integers and limited-precision floating-point numbers; the allocator and mark-and-sweep garbage collector are implemented and tested. The reader and compiler are still ahead. I’m using [ATOM](https://semantic-scroll.com/content/2026/09/04/01-atom-my-z80-assembler/) to assemble the runtime, and the plan includes a shared object format and linker for Skate, ATOM and Nucleus. That will let the linker combine generated code with the runtime routines it calls.

The first complete workflow I’m working towards is to write a small Scheme source file, compile it, link it with the runtime, and run the resulting `.COM` program at the CP/M prompt. I’ll write about the decisions and results here as the project develops.
