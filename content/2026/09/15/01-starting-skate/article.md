---
title: "Starting Skate"
status: published
thumbnail: assets/lisp-to-z80.svg
series: building-skate
summary: "I’m building Skate, a Scheme compiler for the Z80, targeting CP/M. It will compile Scheme programs on the machine and run them as native Z80 code."
tags:
  - scheme
  - z80
  - compilers
  - cpm
---
# Starting Skate

By John Hardy

Today I’m starting Skate, a Scheme compiler for the Z80, initially targeting CP/M. The idea is to make a Lisp system that can compile reasonably substantial programs on the machine itself and run them as native Z80 code. Doing the translation ahead of time should give those programs a speed advantage over interpretation. Compiling on the Z80 also means working within its 64 KiB address space.

My work on CP/M software, particularly [ATOM](https://semantic-scroll.com/content/2026/09/04/01-atom-my-z80-assembler/), my Z80 assembler, provides a starting point. ATOM and Nucleus already use the streaming approach I intend to use in Skate: process the source in one pass, emit code along the way, and record fixups for references resolved later. Generated code and pending fixups can go to disk, leaving memory for active scopes and compiler tables. That should allow reasonably large source programs to pass through a compiler with a small working area, without holding a complete intermediate representation in memory.

<figure>
  <img src="./assets/lisp-to-z80.svg" alt="The Scheme expression (+ (* 2 3) 4) gives 10. Below it, Skate’s planned workflow connects Scheme source, a streaming compiler, a linker with runtime support, and a native CP/M program." width="1000" height="760">
  <figcaption>Expression nesting and Skate’s planned compilation path. This illustration is public domain.</figcaption>
</figure>

Selected examples from *Structure and Interpretation of Computer Programs* will guide the choice of Scheme features and provide programs to test the design against. I also want to document the implementation closely enough that someone reading the assembly can follow how a Scheme operation becomes Z80 instructions. The runtime and source reader are already in place; the work ahead is code generation and linking, leading to a Scheme program I can compile and run at the CP/M prompt.
