---
status: published
title: "The TEC-1G: A Platform for the Next Generation"
summary: "The TEC-1G is not just an upgraded TEC-1. It has a different memory map along with a richer monitor ROM along with hardware features that require their own emulation logic. I added a dedicated platform target to Debug80 so the debugger handles these differences correctly from the start."
tags:
  - debug80
  - tec1g
  - z80
  - emulation
  - platforms
  - mon-3
series: debug80diaries
---

# The TEC-1G: A Platform for the Next Generation

By John Hardy

The TEC-1 was always a teaching machine that shipped with 2K of ROM alongside 2K of RAM alongside a hex keypad that taught you to think in machine code. The TEC-1G keeps that spirit but expands the hardware significantly by offering 32K of RAM alongside a 16K monitor ROM alongside an LCD character display alongside memory banking features that let programs grow beyond the original constraints. These are not incremental changes because they reshape how programs are written alongside how the debugger must behave. I could have stretched the existing TEC-1 platform to cover the TEC-1G but that would have buried the differences in conditionals alongside special cases. Instead I added a dedicated `tec1g` platform to Debug80 with its own memory map alongside its own I/O port handlers alongside its own panel UI. The two platforms share some low-level code but they present themselves as distinct machines with their own identity so this separation makes it easier to maintain accurate emulation for both systems without one platform's quirks affecting the other.

## A Different Memory Map

The TEC-1 has a simple layout with ROM at `0x0000–0x07FF` alongside RAM at `0x0800–0x0FFF`. Most programs fit comfortably in a small region near the bottom of memory. The TEC-1G uses the full 64K address space with zones that serve different purposes. Understanding this layout is essential for proper platform configuration. The shadow region at `0x0000–0x07FF` is RAM that mirrors ROM when shadow mode is active. Free RAM including monitor workspace occupies `0x0800–0x3FFF` while protect-capable user RAM lives at `0x4000–0x7FFF`. The expansion window at `0x8000–0xBFFF` shows 16K of a 32K banked device. The MON-3 monitor ROM occupies `0xC000–0xFFFF` at the top of memory rather than the bottom which is the opposite of the TEC-1 placement.

Programs start at `0x4000` instead of `0x0800`. The first time I tried to load a TEC-1 program on the TEC-1G platform it landed in the wrong place. The display showed garbage because the memory map was not a detail I could ignore. The platform configuration reflects this layout precisely with regions defined for ROM zones alongside RAM zones. An `appStart` of `16384` (`0x4000`) tells Debug80 where user programs begin while an `entry` of `0` means the CPU starts at address zero while the shadow mechanism makes that address show ROM contents at boot time. This configuration leads to the three memory modes that make the TEC-1G distinctive. Getting them right was essential for accurate emulation.

## Shadow Protect Expand

The TEC-1G has three memory modes controlled by a system control port at `0xFF`. Each mode serves a distinct purpose in the machine's operation. Understanding these modes is essential for writing programs that work correctly on the hardware. Shadow mirrors the ROM at `0xC000` into the low 2K at `0x0000–0x07FF` which is how the machine boots because the CPU fetches from address zero but sees the ROM contents. Shadow mode also exists for compatibility with programs that expect to run from low memory allowing the same code to work on both machines without modification. Protect makes the user RAM region at `0x4000–0x7FFF` read-only which serves as a safety rail because when you are typing in a program byte by byte a stray store instruction can erase your work. Protect mode stops that from happening since it is a workflow feature rather than a security feature.

Expand selects which half of the 32K expansion device appears in the `0x8000–0xBFFF` window. The TEC-1G expansion socket can hold 32K but only 16K is visible at a time. Toggling the expand bit swaps the visible half to give programs access to more memory than the address space would otherwise allow. The runtime tracks these modes in state variables then enforces them during memory access. The adapter checks `shadowEnabled` alongside `protectEnabled` alongside `expandEnabled` flags on every read operation along with every write operation. When the adapter handles a memory write it checks both the protect flag alongside the address range. A write to `0x5000` succeeds when protect is off but silently fails when protect is on which matches the hardware behaviour exactly.

## Booting with Shadow Active

The original implementation started with shadow disabled but that was wrong because the real TEC-1G boots with shadow active so the CPU can fetch the ROM reset vector from address zero. The ROM then initialises the system then optionally disables shadow mode before jumping to user code. I fixed setting by setting `shadowEnabled: true` at power-on alongside on reset which ensures the emulator behaves the same way as the real hardware from the first instruction fetch. The reset handler also needed updating because when the user resets the machine the emulator must restore shadow mode so the boot sequence works correctly. Failing to do this would cause programs to crash unpredictably after a reset.

## MON-3 A Richer Monitor

The TEC-1G ships with MON-3 which is a 16K monitor ROM written by Brian Chiha that represents a significant upgrade from the original MON-1. MON-3 includes a menu system navigated by Plus/Minus plus GO alongside Intel HEX loading over serial alongside block copy alongside backup utilities alongside memory export in multiple formats alongside a built-in disassembler alongside Tiny BASIC alongside real-time clock support alongside graphical LCD library routines. The `debug80-tec1g` repository packages MON-3 with its source alongside listing files including the binary ROM image alongside the Intel HEX format alongside the assembler listing alongside the original source code alongside included modules for Tiny BASIC plus LCD routines plus disassembly plus the real-time clock plus sound. The `extraListings` configuration points at `mon-3.lst` so the debugger can step through monitor code with full source context. When execution enters a ROM routine the source view shows the original assembly instead of raw disassembly.

## Platform Repositories

Debug80 itself stays generic because the platform-specific details live in separate repositories that users clone alongside their projects which keeps the core debugger clean while allowing unlimited platform variations. The debug80-tec1 repository contains TEC-1 machine setups including `tec1-mon1/` for MON-1 configuration with RAM at `0x0800` plus `tec1-mon2/` for MON-2 configuration with RAM at `0x0900` plus sample programs demonstrating serial communication plus matrix keyboard scanning. The debug80-tec1g repository contains TEC-1G machine setups including `tec1g-mon1/` for MON-1B compatibility mode plus `tec1g-mon3/` for the full MON-3 configuration with RAM at `0x4000` plus sample programs demonstrating LCD control plus other TEC-1G-specific features.

Each machine folder has a `.vscode/debug80.json` that configures the platform alongside ROM paths alongside extra listings. A developer can open one of these folders in VS Code then immediately start debugging without writing configuration from scratch. The separation means that adding a new machine does not require changes to Debug80 itself. A new TEC-1 variant can live in its own repository with its own ROMs alongside configuration templates while a completely different Z80 system can do the same. The community can share platform configurations without needing to modify the core extension.

## The Panel UI

The TEC-1G panel extends the TEC-1 panel with LCD support. It shows the seven-segment display with address registers plus data registers alongside a character LCD that renders the HD44780 display buffer. The panel also displays the current mode indicators for Shadow plus Protect plus Expand so I can see at a glance which memory features are active. The LCD rendering uses the same device model I described in an earlier article. Writes to the LCD command port plus data port update an internal buffer. The panel paints the buffer as a grid of glyphs that update on each cycle. The TEC-1G panel queries buffer on each update cycle then refreshes the display to show exactly what a real LCD would show which makes it easy to develop plus debug LCD-based applications without needing the physical hardware.

## What This Enables

I can now debug TEC-1G programs with the same tools I use for TEC-1 programs but without pretending the machines are identical. The memory map resolves correctly so that ROM lives at the right address while protect mode works as expected while shadow mode boots the machine properly. When I step through a MON-3 menu handler the debugger shows the original source. When I set a breakpoint in a ROM routine the breakpoint fires even though the code runs in shadowed memory. The platform abstraction handles the address aliasing so I do not have to think about it. The TEC-1G is a more capable machine than the TEC-1 so the debugger now reflects that because it is not a compatibility hack but rather a first-class platform with its own identity plus configuration that respects the hardware's unique characteristics.
