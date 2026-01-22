---
status: published
title: "Mature Project: The Great Unbundling"
summary: "Scaling a developer tool requires identifying the boundary between the 'core' and the 'periphery.' This final article in the series discusses the transition of Debug80 to a modular, decoupled ecosystem."
tags:
  - debug80
  - z80
  - architecture
  - modularity
  - ecosystem
series: debug80diaries
---

# Mature Project: The Great Unbundling

As Debug80 reached maturity, it faced a classic architectural crossroads. We started with a simple debugger, but quickly added support for the TEC-1 platform, specific ROM loaders, and example games like *Caverns*. The repository was becoming a "mono-blob" that cluttered the codebase with machine-specific binary data and logic. To ensure the long-term stability of the core debugger, I initiated what I called "The Great Unbundling."

## Identifying the Core

The core of Debug80 is the VS Code Debug Adapter Protocol (DAP) implementation and the Z80 emulator. Everything else is peripheral. This includes components like the TEC-1 monitor ROM and RAM initialization hex files. Scalability meant that a developer should be able to use Debug80 for *any* Z80 project without the core repository needing to know about that project's specifics.

## The Role of debug80.json

The bridge between the generic core and the specific platform is the `debug80.json` configuration file. Instead of hardcoding memory regions and ROM paths in the TypeScript source, I moved them into a declarative per-project configuration. This simple shift had a profound impact, allowing the `debug80` repository to delete several hundred kilobytes of binary ROM data and machine-specific code.

## Decoupling the Ecosystem

With the core now generic, specific platforms can live in their own repositories. For example, `debug80-tec1` contains the TEC-1 specific monitor code and configuration templates, while `caverns80` owns its own game logic and assembly organization. When a developer wants to debug a new machine, they don't need to submit a PR to the main Debug80 repo. They simply create a new repository and include `debug80` as a tool. Then, they provide their own `debug80.json`.

## Conclusion: The Path Forward

The Debug80 Diaries series has traced the evolution of this project from a simple hex-loader to a sophisticated, cycle-accurate, and modular debugging environment. We've covered everything from the foundational DAP integration and terminal I/O to the D8 source map specification and hardware simulation. Building Debug80 has been a journey through both 1980s constraints and 2020s tooling. It is a tribute to the fact that even a 50-year-old processor can benefit from a modern, high-fidelity development environment. Thank you for following along with the Debug80 Diaries.
