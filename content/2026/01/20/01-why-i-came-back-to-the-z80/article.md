---
status: published
title: "Why I Came Back to the Z80"
summary: "My work with the Z80 began on paper in the late 1970s and became real hardware in the early 1980s. This series documents a return to that architecture through the construction of a modern debugging environment."
tags:
  - debug80
  - z80
  - tec1
  - retrocomputing
  - tooling
series: debug80-diaries
thumbnail: assets/tec1-blue-prototype.jpg
---

# Why I Came Back to the Z80

My involvement with the Z80 predates the TEC-1 by several years. In the late 1970s, I designing systems on paper while considering instruction sets and memory layouts. I also thought about the requirements for building a usable computer around an affordable processor. Like many people at the time, access to hardware lagged behind understanding. The ideas came first; the opportunity to realise them came later.

![The TEC-1 Blue Prototype](./assets/tec1-blue-prototype.jpg "The TEC-1 blue prototype: a bridge between 1983 and the modern debugger.")

By the early 1980s that opportunity arrived. I built a sequence of Z80-based prototypes while refining the hardware and my understanding of how people might interact with such a machine. Those prototypes eventually became the basis for a collaboration with Ken Stone that resulted in the TEC-1 computer kit. *Talking Electronics* magazine published this kit in 1983.

The TEC-1 was a product of its time. It reflected available components and the expectations of hobbyists who prepared to work close to the machine. It also reflected a long period of prior thinking about the minimal infrastructure required to make a computer programmable.

## Working close to the machine

Programming the TEC-1 meant engaging directly with the processor. Input was via a hexadecimal keypad and output appeared on a small numeric display. Programmers entered commands as machine code for immediate execution. Storage was minimal. The system encouraged careful and incremental work.

I wrote the original monitor software, MON1, to support that style of interaction. It provided controlled access to memory and execution while staying out of the way. Its role was to make the processor usable rather than to abstract it. Over time, users developed a working familiarity with registers, addresses, and instruction flow simply by using the machine.

The Z80 itself suited this mode of work. It was capable enough to do interesting tasks, yet sufficiently compact that developers could program and debug it without elaborate tooling. While an assembler proved helpful, it remained optional, and a symbolic debugger provided utility without being a strict requirement. The architecture was knowable and that mattered.

## Returning with modern tools

When I began working on Debug80, I was not attempting to invent a new category of software. Debuggers and assemblers have existed for decades. Integrated environments have existed since at least the 1980s. Tools like Turbo Pascal demonstrated how effective a tightly integrated system could be for people who wanted to get productive quickly.

What prompted this project was a set of practical limitations I encountered while using existing Z80 tools. They did not align with how I think about programs or how I read listings. Rather than work around those constraints indefinitely, I decided to build something aligned with my own workflow. At the same time, the available platform had changed dramatically.

VS Code provides a mature and cross-platform environment with a well-developed debugging infrastructure that runs on macOS, Windows, and Linux. It supports rich interaction models and extension points. Combined with my experience in JavaScript, it forms a practical foundation for building a debugger without reinventing the surrounding ecosystem.

Emulating the target hardware entirely in software is a natural consequence of that choice. I have explored TEC-1 emulation before, and extending that work into a debugger-capable environment follows directly from it.

## Scope and direction

Designing Debug80 first and foremost centres on creating a working environment for my own use. It reflects my personal background and habits along with my expectations of what a debugger should provide. From there, it naturally extends to other Z80-based systems beyond the TEC-1 and eventually to other classic platforms.

The emphasis throughout remains on coherence and immediacy: keeping the number of moving components low while providing enough visibility to reason effectively about a running system. Building ROMs for real hardware remains an important outcome, but it is not the primary driver at this stage. The focus here is on understanding, iteration and control.
