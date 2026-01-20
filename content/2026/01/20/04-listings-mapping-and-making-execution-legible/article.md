---
status: published
title: "Listings, Mapping, and Making Execution Legible"
summary: "Debug80 treats assembler listings as primary data and uses them to build explicit mappings between source code, addresses, and runtime execution."
tags:
  - debug80
  - asm80
  - mapping
  - debugging
  - z80
series: debug80diaries
thumbnail: assets/tec1-blue-prototype.jpg
---

# Listings, Mapping, and Making Execution Legible

Z80 programs execute at specific addresses while developers author code in source files. understanding is either preserved or lost in the space between these two views. In the Debug80 environment, the assembler listing occupies that critical gap.

The assembler used by Debug80, asm80, produces listing files that record how source text expands into bytes at specific addresses. These files remain simple and direct because they show the assembled output exactly as it will appear in memory. Debug80 treats these listings as primary input rather than secondary artefacts.

## Why listings matter

A listing captures a moment of agreement between developer intention and machine execution. It records which source line produced which bytes and where the assembler placed that code. This information remains precise even when the source language utilizes macros, conditionals, or repeated constructs.

Because of this precision, listings provide a reliable foundation for mapping. They allow Debug80 to reason about execution without guessing how the assembler interpreted the original source. The resulting mapping reflects what actually happened during assembly.

This approach aligns with traditional Z80 development practices. Historically, programmers worked directly from listings by reading addresses and opcodes alongside their source. Debug80 builds on that legacy while extending the concept into a live debugging context.

## Building the mapping

From the listing output, Debug80 constructs a set of explicit relationships that connect source files and line numbers while identifying assembled address ranges and instruction boundaries. These relationships form a mapping table that bridges the text editor and the execution engine.

The mapping process remains mechanical and deterministic because it follows the assembler’s output without relying on inference. When execution reaches a particular address, the debugger identifies the corresponding source location. When a user sets a breakpoint on a line of source, Debug80 resolves that location to one or more concrete machine addresses.

## Stepping with intent

Stepping through a Z80 program involves more than simply advancing the program counter. Instructions vary in length, and macros or pseudo-operations often expand into multiple machine instructions. Furthermore, some source lines correspond to no emitted machine code at all.

The mapping layer allows Debug80 to step through code in ways that respect the source structure. A single step can advance execution to the next relevant source line, even when the operation involves multiple instructions. At the same time, the underlying address-level execution remains visible and accessible to the user. This dual view supports two styles of reasoning: reading the program as written and inspecting the machine as it runs.

## Breakpoints and visibility

Breakpoints operate through this same mapping layer. When a developer sets a breakpoint in the editor, Debug80 resolves it to the appropriate machine addresses based on the listing data. When execution reaches one of those addresses, the debugger stops so that the developer can inspect the current machine state.

Because the mapping remains explicit, the debugger shows how the stopped location relates to both the source and the assembled output. The user can then inspect registers and memory along with the I/O state to gain a clear understanding of exactly how the program arrived at that point.

## Mapping as structure

Debug80 treats mapping as a structural foundation rather than a convenience feature. This layer influences how the system controls execution and presents state while also affecting how the user reasons about a running program.

The assembler listing provides the raw material while the mapping layer organises it into a form that connects human intent to machine behaviour. This connection makes debugging effective in low-level systems where abstraction layers remain thin and consequences are immediate. This focus on explicit mapping remains central to Debug80’s design, allowing classic development practices to persist in a modern environment without losing their original clarity.
