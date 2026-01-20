---
status: published
title: "Debug80 as a System"
summary: "Debug80 integrates a JavaScript Z80 assembler with VS Code’s debugging infrastructure to create a coherent environment for building and observing Z80 programs."
tags:
  - debug80
  - vscode
  - asm80
  - debugging
  - architecture
series: debug80diaries
---

# Debug80 as a System

The Debug80 architecture functions as a small and tightly integrated system built around three primary components. It utilizes a JavaScript-based Z80 assembler along with a software execution model for the processor hardware and the standard VS Code debugging interface. Each component plays a specific functional role, and the ultimate value of the system depends on the precise alignment of these responsibilities. The development of Debug80 concentrates on integration rather than the invention of new core technologies. Because the underlying pieces already exist and remain well understood in the industry, the primary challenge involves connecting them in a way that respects the realities of Z80 programming. This integration ensures that execution remains observable and meaningful within a modern development environment.

## VS Code as the execution host

VS Code provides a mature debugging framework that defines how environment launches programs and how the user controls execution. Structural pieces such as registers and breakpoints, along with call stacks and variable views, form an essential feature set of a well-established interaction model. Debug80 adapts this framework directly to a Z80 execution context.

When a debug session starts, VS Code drives execution through its standard mechanisms while the actual processor and memory run inside the internal software model. From the user’s perspective, Z80 machine code participates naturally in the same debugging workflow used for contemporary high-level languages. This approach allows the project to concentrate on machine behaviour and hardware state rather than building a custom debugger interface from scratch.

## asm80 and the role of listings

The system utilizes **asm80**, a Z80 assembler implemented in JavaScript for Node. This tool produces machine code alongside listing files that record exactly how source lines correspond to assembled addresses and bytes. These listing files form the central input for Debug80 because they capture the assembler’s decisions directly without any reinterpretation. Debug80 uses these listings to establish a precise relationship between source text and generated machine code. This mirrors the traditional workflow of Z80 development, where the listing represents the bridge between the programmer's intention and the machine's reality. By treating the listing as a primary source of truth, the system ensures that the debugger always accurately reflects the assembled output.

## Mapping source to execution

While the VS Code debugger operates in terms of source locations, the Z80 processor operates entirely in terms of memory addresses. Debug80 connects these two disparate views by generating explicit mappings from the assembler listings. These mappings relate source files and line numbers to assembled addresses and runtime instruction execution.

Breakpoints and stepping, alongside state inspection, all pass through this critical mapping layer. When execution stops, the system shows exactly where the processor resides and how that location corresponds to both the original source and the assembled binary output. Mapping remains a structural foundation of the system rather than a secondary convenience, and much of the debugger's core behaviour depends on its accuracy.

## Initialisation and workflow

The design of Debug80 prioritises minimal friction during setup and daily use. Since the assembler, emulator, and debugger extension all use JavaScript, the project simplifies distribution. This architecture allows the same environment to run seamlessly across macOS, Windows, and Linux. The extension coordinates assembler invocation, program loading, and debugger initialisation into a single, unified workflow.

This integration means that editing source code and observing execution happen within one environment using familiar controls. While the underlying complexity of the machine remains visible to the developer, the system organises the information into a coherent structure. By consolidating these disparate tools, Debug80 allows the programmer to focus on the logic of their program rather than the mechanics of the toolchain.

## Execution under debugger control

During a debug session, the Z80 processor and all attached devices execute within the software model. Machine execution advances under the direct control of the VS Code interface. Actions like stepping and continuing, or breaking at defined points, allow the user to inspect the machine state consistently across different platforms.

The debugger actively drives the execution process rather than simply observing it from the outside. Registers and memory remain available for thorough examination at every step, as does the I/O state. This deep integration ensures that the tool behaves like a first-class debugger for an 8-bit architecture, providing the same level of control one expects from modern software development tools.

## System coherence

Taken together, Debug80 forms a coherent environment rather than a loose collection of disparate tools. The assembler establishes the ground truth of the machine code while the platform model defines the hardware behaviour. Furthermore, the debugger interface provides the necessary control and visibility. Every component reinforces the others to maintain a consistent user experience. The emphasis throughout the project remains on architectural alignment and keeping the number of moving components small. This strategy allows low-level programming to remain approachable for a wider audience. By providing a clear window into the machine's internal state, Debug80 recovers the clarity of early computing within a modern context.
