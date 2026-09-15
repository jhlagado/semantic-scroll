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

Today I’m starting Skate, a Scheme compiler for the Z80, initially targeting CP/M. I’ve spent years developing software for these machines and designed ATOM, my Z80 assembler. Now I’m testing another idea: a compiler that reads its source once, emits code as it goes, and patches references it couldn’t resolve earlier. That single-pass approach is meant to keep the compiler’s working memory small.

A Scheme compiler for CP/M brings these interests together in a project with a clear technical question: can a useful high-level language be compiled this way for a Z80? Scheme lets me test more than arithmetic: programs can pass procedures around and build compound data. CP/M gives the compiler a tight memory limit. My goal is native Z80 programs, with the compiler itself eventually running on the machine it targets.

<figure>
  <img src="./assets/lisp-to-z80.svg" alt="The Scheme expression (+ (* 2 3) 4) gives 10. Below it, Skate’s planned workflow connects Scheme source, a streaming compiler, a linker with runtime support, and a native CP/M program." width="1000" height="760">
  <figcaption>Expression nesting and Skate’s planned compilation path. This illustration is public domain.</figcaption>
</figure>

Scheme is part of the Lisp family. The upper diagram shows how one expression can contain another; the lower shows my intended route from source through the streaming compiler and linker to a CP/M program. The tree explains the expression. Skate’s compiler will emit code as it reads, with fixups for references resolved later.

I’m aiming for a useful subset that can run selected examples from *Structure and Interpretation of Computer Programs*. The numeric runtime, allocator and garbage collector are implemented and tested; the source reader and compiler are still ahead. I’ll use the examples to test the design and explain how the Z80 code carries out the Scheme operations.

The first full test will be to compile a Scheme source file, link it with the runtime, and run the `.COM` file under CP/M.
