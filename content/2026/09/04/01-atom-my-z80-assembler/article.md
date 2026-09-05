---
title: "Atom: my Z80 assembler"
status: published
summary: "I’m putting the finishing touches to Atom, a single-pass Z80 assembler written in Z80 assembly. It runs on macOS, Windows, Linux and CP/M, so I can use it on my laptop and on a small Z80 system."
tags:
  - atom
  - z80
  - retrocomputing
  - tooling
---
# Atom: my Z80 assembler

By John Hardy

In other news, I’m putting the finishing touches to my Z80 assembler, which I call Atom.

Atom is unusual in a few ways. It reads source as a stream and assembles it in a single pass. If an instruction refers to a label further down the program, Atom records the reference and produces a patch when the label’s address becomes available. There’s no need for a second assembly pass through the source.

It also runs on macOS, Windows, Linux … and CP/M.

The assembler core is written in Z80 assembly. On a modern computer, that code runs in a Z80 emulator; under CP/M, it runs directly on the Z80. The core fits within 16 KiB and can assemble its own source.

I wanted an assembler I could use on my laptop and on a small Z80 system. Atom supports the complete Z80 instruction set, and both the desktop and CP/M commands can produce BIN, COM and Intel HEX files.

The [Atom books at Debug80](https://debug80.com/atom/) include the assembler reference and a guide to Z80 programming. [Atom’s standalone source repository is on GitHub](https://github.com/jhlagado/atom), under the GPL v3 licence.
