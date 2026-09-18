---
title: "A minimum viable Scheme"
status: published
thumbnail: assets/skate-cpm.png
series: building-skate
summary: "I’ve decided to build Skate, a Scheme compiler for the Z80 running CP/M. This article sets out the search for a useful small Scheme, with native code, managed memory and examples from Structure and Interpretation of Computer Programs."
tags:
  - scheme
  - z80
  - compilers
  - cpm
  - triptych
---
# A minimum viable Scheme

By John Hardy

<figure>
  <picture>
    <source srcset="./assets/skate-cpm.svg" type="image/svg+xml">
    <img src="./assets/skate-cpm.png" alt="Skate’s planned compilation path: Scheme source passes through the compiler and links with runtime support to produce a native Z80 CP/M program. Triptych targets macOS, the browser and planned ESP32-S3 hardware." width="1200" height="630">
  </picture>
  <figcaption>Skate’s planned compilation path and Triptych targets. This illustration is public domain.</figcaption>
</figure>

I’ve decided to build a Scheme compiler for the Z80 as part of my Triptych computer project. I’m calling it Skate, a play on “Scheme” and “eight” (as in 8-bit systems). Triptych runs CP/M, and my software work for it already includes ATOM, a Z80 assembler, and a few recovered adventure games I originally wrote in the early ’80s. Working with these machines again has become an education in building software from first principles: with small amounts of memory and basic hardware, it’s possible to follow a program all the way down to its instructions and storage.

Skate extends that work into language design. The question is how much Scheme we can fit into this environment while keeping it useful for substantial programs. In other words, I’m searching for a minimum viable Scheme. Being able to run most of the example programs in the classic programming book _Structure and Interpretation of Computer Programs_ gives that goal a practical measure. Where an example needs rewriting, we can examine the limitations of the implementation and whether the result still expresses the algorithm clearly.

Scheme is a member of the Lisp family, with a small core from which we can build quite sophisticated programs. Procedures are values alongside numbers and other data: we can pass one as an argument, return it from another procedure or store it in a list. This is what it means for procedures to be “first-class”. Skate’s basic values will also include integers for counting and indexing, floating-point numbers for fractional calculations, booleans for true and false, symbols for named data, and characters and strings for text. Lists let us assemble these values into larger structures, giving us enough to work with for numerical calculations, searching and text processing.

The Z80 has a 64 KiB address space, part of which CP/M occupies. Skate will translate Scheme source into native Z80 machine code before the program runs. The generated code will link with a runtime that supports dynamically allocated objects and automatically reclaims unused memory. Compiling to machine code should give us efficient execution, but the program and its runtime must also leave enough room for useful amounts of data.

During compilation, the compiler and its working data must fit in the available memory. I’ve already developed techniques for processing a stream of source code in a small working area, which my assembler ATOM uses. Applying that approach to Scheme will be the starting point for keeping compilation within the available space.

Through this series, we’ll work from small programs down to their implementation. Adding two numbers gives us a place to begin with values and arithmetic; repeating a calculation over a list introduces structured data. We can build up the language in those steps, explaining each concept as we need it and documenting the compromises along the way.

I plan to release Skate’s source so readers can try the compiler and examine its implementation. Triptych’s CP/M environment already runs on macOS and in the browser, where it will be easiest to compile and run the examples. I’m also developing a hardware version based on ESP32-S3 microcontroller boards running the same environment through Z80 emulation.

---

Discuss this article on [Mastodon](https://jorts.horse/@jhlagado/117292024470334414), [Bluesky](https://bsky.app/profile/did:plc:ryqselzoaiie6vwxh5gkra7i/post/3mvs67hrtno2l) or [X](https://x.com/14682998/status/2100925006536392717).
