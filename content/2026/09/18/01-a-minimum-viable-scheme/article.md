---
title: "A minimum viable Scheme"
status: published
thumbnail: assets/skate-cpm.png
series: building-skate
summary: "I’m building Skate, a Scheme compiler for the Z80 running CP/M. Examples from Structure and Interpretation of Computer Programs provide a test of how much we can retain while leaving enough memory to run useful programs."
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

I’m building Skate, a Scheme compiler for the Z80 running CP/M, as part of my Triptych computer project. In [Starting Skate](https://semantic-scroll.com/content/2026/09/15/01-starting-skate/) I explained the appeal of bringing a more dynamic style of programming to this small machine. The question now is how much Scheme we can fit into this environment while keeping it useful for substantial programs.

I’m searching for a minimum viable Scheme. Skate should be able to run most of the example programs in the classic programming book _Structure and Interpretation of Computer Programs_. Where an example needs rewriting, we can examine the limitations of the implementation and whether the result still expresses the algorithm clearly.

Scheme is a member of the Lisp family with a small core from which we can build quite sophisticated programs. Procedures are values alongside numbers and other data: we can pass one as an argument, return it from another procedure or store it in a list. This is what it means for procedures to be “first-class”. Alongside these procedures, Skate’s basic values will cover arithmetic, logical decisions and text. Lists let us assemble values into larger structures for programs such as searches and symbolic calculations.

The Z80 has a 64 KiB address space, part of which the CP/M operating system occupies. Skate will translate Scheme source into native Z80 machine code before the program runs. The generated code will link with a runtime that supports dynamically allocated objects and automatically reclaims memory the program can no longer reach. Compiling to machine code should give us efficient execution, but the program and its runtime must also leave enough room for useful amounts of data.

During compilation the compiler and its working data must fit in the available memory. For Skate I’m adapting the source-streaming techniques developed for my assembler ATOM, which processes source in a small working area. The compiler finishes before the resulting program runs, so we can consider their memory requirements separately.

Through this series we’ll work from small Scheme programs down to their implementation and document the compromises along the way. Readers will be able to try the examples in Triptych’s browser-based CP/M environment. The test is whether we can still express substantial algorithms clearly and leave enough space to run them. That’s the useful minimum I’m working towards.

---

Discuss this article on [Mastodon](https://jorts.horse/@jhlagado/117292024470334414), [Bluesky](https://bsky.app/profile/did:plc:ryqselzoaiie6vwxh5gkra7i/post/3mvs67hrtno2l) or [X](https://x.com/14682998/status/2100925006536392717).
