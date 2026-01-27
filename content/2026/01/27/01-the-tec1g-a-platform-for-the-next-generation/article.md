---
status: published
title: "The TEC-1G: A Platform for the Next Generation"
summary: "The TEC-1G is not just an upgraded TEC-1. It has a different memory map, a richer monitor ROM, and hardware features that require their own emulation logic. I added a dedicated platform target to Debug80 so these differences are handled correctly from the start."
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

The TEC-1 was always a teaching machine. It had 2K of ROM, 2K of RAM, and a hex keypad that taught you to think in machine code. The TEC-1G keeps that spirit but expands the hardware. It has 32K of RAM, a 16K monitor ROM, an LCD character display, and memory banking features that let programs grow beyond the original constraints. These are not incremental changes. They reshape how programs are written and how the debugger must behave.

I could have stretched the existing TEC-1 platform to cover the TEC-1G, but that would have buried the differences in conditionals and special cases. Instead I added a dedicated `tec1g` platform to Debug80. It has its own memory map, its own I/O port handlers, and its own panel UI. The two platforms share some low-level code, but they present themselves as distinct machines.

## A Different Memory Map

The TEC-1 has a simple layout: ROM at `0x0000–0x07FF`, RAM at `0x0800–0x0FFF`. The TEC-1G uses the full 64K address space with zones that serve different purposes:

| Range           | Type    | Notes                                      |
|-----------------|---------|-------------------------------------------|
| `0x0000–0x07FF` | RAM     | Shadow region (can mirror ROM)            |
| `0x0800–0x3FFF` | RAM     | Free RAM including monitor workspace      |
| `0x4000–0x7FFF` | RAM     | Protect-capable user RAM                  |
| `0x8000–0xBFFF` | Banked  | Expansion window (32K device, 16K visible)|
| `0xC000–0xFFFF` | ROM     | MON-3 monitor ROM                         |

The monitor ROM lives at the top of memory, not the bottom. This is the opposite of the TEC-1. Programs start at `0x4000` instead of `0x0800`. The first time I tried to load a TEC-1 program on the TEC-1G platform, it landed in the wrong place and the display showed garbage. The memory map was not a detail I could ignore.

The platform configuration reflects this layout:

```json
{
  "platform": "tec1g",
  "tec1g": {
    "regions": [
      { "start": 0, "end": 2047, "kind": "rom" },
      { "start": 2048, "end": 32767, "kind": "ram" },
      { "start": 49152, "end": 65535, "kind": "rom" }
    ],
    "appStart": 16384,
    "entry": 0,
    "romHex": "roms/tec1g/mon-3/mon-3.bin"
  }
}
```
@@Caption: TEC-1G platform configuration with MON-3 ROM.

The `appStart` of `16384` (`0x4000`) tells Debug80 where user programs begin. The `entry` of `0` means the CPU starts at address zero, but that address is shadowed ROM at boot time.

## Shadow, Protect, and Expand

The TEC-1G has three memory modes controlled by a system control port at `0xFF`:

**Shadow** mirrors the ROM at `0xC000` into the low 2K at `0x0000–0x07FF`. This is how the machine boots. The CPU fetches from address zero, but it sees the ROM contents. Shadow mode exists for compatibility with programs that expect to run from low memory.

**Protect** makes the user RAM region at `0x4000–0x7FFF` read-only. This is a safety rail. When you are typing in a program byte by byte, a stray store instruction can erase your work. Protect mode stops that from happening. It is not a security feature; it is a workflow feature.

**Expand** selects which half of the 32K expansion device appears in the `0x8000–0xBFFF` window. The TEC-1G expansion socket can hold 32K, but only 16K is visible at a time. Toggling the expand bit swaps the visible half.

The runtime tracks these modes in state variables and enforces them during memory access:

```typescript
export interface Tec1gState {
  // ...
  sysCtrl: number;
  shadowEnabled: boolean;
  protectEnabled: boolean;
  expandEnabled: boolean;
}
```
@@Caption: TEC-1G state includes mode flags.

When the adapter handles a memory write, it checks both the protect flag and the address range. A write to `0x5000` succeeds when protect is off but silently fails when protect is on. This matches the hardware behavior.

## Booting with Shadow Active

The original implementation started with shadow disabled. That was wrong. The real TEC-1G boots with shadow active so the CPU can fetch the ROM reset vector from address zero. The ROM then initializes the system and optionally disables shadow mode before jumping to user code.

I fixed this by setting `shadowEnabled: true` at power-on and on reset:

```typescript
const state: Tec1gState = {
  // ...
  sysCtrl: 0x00,
  shadowEnabled: true,
  protectEnabled: false,
  expandEnabled: false,
};
```
@@Caption: TEC-1G boots with shadow enabled.

This change also affected the reset handler. When the user resets the machine, the emulator must restore shadow mode so the boot sequence works correctly.

## MON-3: A Richer Monitor

The TEC-1G ships with MON-3, a 16K monitor ROM written by Brian Chiha. It is a significant upgrade from the original MON-1. It includes:

- A menu system navigated with Plus/Minus and GO
- Intel HEX loading over serial
- Block copy and backup utilities
- Memory export in multiple formats
- A built-in disassembler
- Tiny BASIC
- Real-time clock support
- Graphical LCD library routines

The `debug80-tec1g` repository packages MON-3 with its source and listing files:

```
roms/tec1g/mon-3/
  mon-3.bin           # 16K ROM binary
  mon-3.hex           # Intel HEX format
  mon-3.lst           # Assembler listing
  mon-3.source.asm    # Original source
  tiny_basic.z80      # Included module
  glcd_library.z80    # LCD routines
  disassembler.z80    # Disassembly module
  rtc.z80             # Real-time clock
  sound.z80           # Sound routines
```
@@Caption: MON-3 ROM package in debug80-tec1g.

The `extraListings` configuration points at `mon-3.lst` so the debugger can step through monitor code with full source context. When execution enters a ROM routine, the source view shows the original assembly instead of raw disassembly.

## Platform Repositories

Debug80 itself stays generic. The platform-specific details live in separate repositories that users clone alongside their projects:

**debug80-tec1** contains TEC-1 machine setups:
- `tec1-mon1/`: MON-1 configuration (RAM at `0x0800`)
- `tec1-mon2/`: MON-2 configuration (RAM at `0x0900`)
- Sample programs: `serial.asm`, `matrix.asm`

**debug80-tec1g** contains TEC-1G machine setups:
- `tec1g-mon1/`: MON-1B compatibility mode
- `tec1g-mon3/`: Full MON-3 configuration (RAM at `0x4000`)
- Sample programs: `main.asm`, `lcd-test.asm`

Each machine folder has a `.vscode/debug80.json` that configures the platform, ROM paths, and extra listings. A developer can open one of these folders in VS Code and immediately start debugging without writing configuration from scratch.

The separation means that adding a new machine does not require changes to Debug80 itself. A new TEC-1 variant or a completely different Z80 system can live in its own repository with its own ROMs and configuration templates.

## The Panel UI

The TEC-1G panel extends the TEC-1 panel with LCD support. The seven-segment display still shows the address and data registers, but below it sits a character LCD that renders the HD44780 display buffer. The panel also shows the current mode (Shadow, Protect, Expand) so I can see at a glance which memory features are active.

The LCD rendering uses the same device model I described in an earlier article. Writes to the LCD command and data ports update an internal buffer, and the panel paints the buffer as a grid of glyphs. The TEC-1G panel queries this buffer on each update cycle and refreshes the display.

## What This Enables

I can now debug TEC-1G programs with the same tools I use for TEC-1 programs, but without pretending the machines are identical. The memory map is correct. The ROM lives at the right address. Protect mode works. Shadow mode boots the machine properly.

When I step through a MON-3 menu handler, the debugger shows the original source. When I set a breakpoint in a ROM routine, the breakpoint fires even though the code runs in shadowed memory. The platform abstraction handles the address aliasing so I do not have to think about it.

The TEC-1G is a more capable machine than the TEC-1, and the debugger now reflects that. It is not a compatibility hack. It is a first-class platform.
