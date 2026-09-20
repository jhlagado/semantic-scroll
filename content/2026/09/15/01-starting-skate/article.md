---
title: "Starting Skate"
status: published
thumbnail: assets/skate-blueprint.png
series: building-skate
summary: "I’m building Skate, a Scheme compiler for Z80/CP/M. I’ll release the implementation in stages and explore how to make its expressive style of programming practical on a small machine."
tags:
  - scheme
  - z80
  - compilers
  - cpm
---
# Starting Skate

By John Hardy

<figure>
  <picture>
    <source srcset="./assets/skate-blueprint.svg" type="image/svg+xml">
    <img src="./assets/skate-blueprint.png" alt="Notebook-style roller-skate schematic with side and underside views. Below it, Scheme source passes through Skate to native Z80 code. A conceptual illustration rather than a fabrication plan." width="1200" height="900">
  </picture>
  <figcaption>A plan for Skate. This illustration is public domain.</figcaption>
</figure>

I’ve decided to build Skate, a Scheme compiler for the Z80 running CP/M, as part of my Triptych computer project. After developing [ATOM](https://semantic-scroll.com/content/2026/09/04/01-atom-my-z80-assembler/), my Z80 assembler, I’m interested in exploring a more dynamic way to program on the same small machine.

Scheme appeals to me because we can express with it powerful algorithms with relatively few language features. We can pass procedures around as values and create *closures* that retain access to their surrounding variables. Automatic memory management lets us use these capabilities without taking responsibility for releasing each piece of storage ourselves, as we generally would in C or assembly language. That freedom changes how we approach a program and makes Scheme an interesting next step beyond the lower-level work I’ve been doing.

The goal is a useful Scheme that compiles to native Z80 code within the limits of an eight-bit CP/M system. Examples from the classic programming book *Structure and Interpretation of Computer Programs* will give us something substantial to work towards. There will be compromises in a machine with so little memory, but enough of Scheme should remain to make its expressive style of programming practical.

I’ll release the implementation in stages as it becomes ready so readers can try it and examine the source. Alongside those releases I’ll write about the design decisions and explain how the language works on the machine. For me the appeal is understanding Scheme from first principles while building something I can use to write programs for this machine.

<figure>
  <picture>
    <source srcset="./assets/lisp-to-z80.svg" type="image/svg+xml">
    <img src="./assets/lisp-to-z80.png" alt="The Scheme expression (+ (* 2 3) 4) gives 10. Below it, Skate’s planned workflow connects Scheme source, a streaming compiler, a linker with runtime support, and a native CP/M program." width="1000" height="760">
  </picture>
  <figcaption>Expression nesting and Skate’s planned compilation path. This illustration is public domain.</figcaption>
</figure>
