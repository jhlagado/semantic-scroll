---
status: published
title: "Unbundling the TEC-1 Toolchain"
summary: I removed the TEC-1 program loader from the core debug80 extension and moved machine content into its own repo. This entry explains why the split mattered and how the platform pack is laid out. It also shows what makes the setup runnable on day one.
tags:
  - debug80
  - tec1
  - architecture
  - tooling
  - unbundling
series: debug80diaries
---

# Unbundling the TEC-1 Toolchain

The TEC-1 work started inside the debug80 repo because I needed to move fast. That was the right choice for the first experiments, but it meant the core extension began to carry program bundles and ROM assets. It also had a loader UI that belonged to the platform, not the core debugger. The repo was beginning to feel like a platform pack instead of a core tool.

I removed the TEC-1 program loader and the `programs/tec1` tree from the extension. That cut out the `debug80/tec1LoadProgram` request in the adapter. It also removed the program picker from the TEC-1 panel. The bundled serial and matrix demos went with it. The core debugger now focuses on the adapter. It still provides the runtime and UI surfaces, but it no longer owns machine content or program curation.

That removal forced the line between tool and platform. The answer was a new repo named `debug80-tec1`. It holds the machine setups and their assets. The structure is intentionally small so each machine reads like a runnable workspace. It has a MON-1 folder and a MON-2 folder. A shared ROM directory sits beside them. Each machine folder has a `.vscode/debug80.json` with named targets and a default target so the setup can be run immediately.

Both ROMs run on the same TEC-1 hardware. The difference is the memory map, not the machine itself. MON-1 user programs start at `0x0800`. MON-2 user programs start at `0x0900` because MON-2 keeps variables and the stack in the `0x0800–0x08FF` region. Each target declares ROM and RAM regions. It also declares the application start address and the ROM hex file to preload. The serial and matrix demos live alongside those targets in `src/`, which makes each machine folder a runnable workspace.

I also started tracking ROM binaries in git. The `mon-1b.bin` and `mon-2.bin` files sit next to their hex and source representations. That keeps provenance visible and makes the repo self-contained. It matters when the goal is a platform pack that works on any machine without extra downloads.

The split is more than a cleanup. It makes debug80 easier to maintain because the core stays focused on the debugger. The TEC-1 platform can evolve on its own cadence. It also sets a pattern for future platforms so they can keep ROMs and targets together in one place. Test programs can live beside them without bloating the core extension.
