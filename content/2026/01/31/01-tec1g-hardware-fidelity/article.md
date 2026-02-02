---
status: published
title: "TEC-1G Hardware Fidelity"
summary: "The TEC-1G's I/O ports use full 8-bit address decoding while the original Debug80 simulation only checked the low three bits. I fixed the port decoding then added the expansion banking registers bringing the simulation closer to the real hardware behaviour."
tags:
  - debug80
  - tec1g
  - z80
  - io
  - hardware
  - emulation
series: debug80diaries
---

# TEC-1G Hardware Fidelity

By John Hardy

The TEC-1G breaks from the TEC-1 tradition of partial address decoding. The original TEC-1 decoded only the low three bits of the port address so that port `0x00` plus port `0x08` addressed the same hardware. The TEC-1G uses full eight-bit decoding with each port having a unique address that does not mirror anywhere else in the I/O space. The Debug80 simulation inherited the TEC-1's partial decoding because I started the TEC-1G runtime by copying the TEC-1 code then modifying it. Ports were mirroring incorrectly so programs that relied on the full decoding would see wrong behaviour when they accessed ports at addresses the simulation did not recognise.

## Full Port Address Decoding

The fix required reviewing every port access in the simulation then changing the address comparisons from masked checks to exact matches. Where the code previously tested `(port & 0x07) === 0x01` to detect the seven-segment display port it now tests `port === 0x01` for the TEC-1G. It keeps the masked check only for the TEC-1 runtime. The change cascaded through the I/O handlers because each handler needed to know which runtime it belonged to. I extracted the port constants into platform-specific configuration objects so the handlers could reference `config.SEGMENT_PORT` rather than hardcoding the number. The configuration approach also made it easier to add new ports later since I just add an entry to the configuration object then write a handler rather than scattering magic numbers through the code.

## The SYS_CTRL Register

The TEC-1G adds a system control register at port `0xFD` that programs use to configure the memory mode alongside the serial port speed alongside other system-wide settings. Writing to this register changes the hardware behaviour immediately so the simulation needed to intercept writes then update its internal state. The memory mode bits control the shadow plus protect plus expand features I described in the first article. Writing a value with the shadow bit set enables shadowing. The simulation checks that bit when resolving memory reads plus writes. The register is write-only on the real hardware. Reading it returns undefined values so the simulation returns zero for compatibility with programs that accidentally read the port.

## The SYS_INPUT Register

The system input register at port `0xFE` provides read-only status information including the speaker feedback line plus the serial input state plus the memory configuration switches. The simulation exposes these values so programs can query the hardware state. The memory configuration switches determine the power-on memory mode. The simulation reads them from the platform configuration so I can test programs that expect different switch settings without modifying the runtime code. The speaker feedback line reflects the last value written to the speaker output which programs use for software timing loops. The serial input comes from the terminal emulation so when I type in the terminal panel the bits appear in this register.

## Expansion Port Banking

The TEC-1G's expansion port includes a banking register that selects which region of a large external memory appears in the expansion window at addresses `0x8000` to `0xBFFF`. Programs write a bank number to this register to page in different sections of an attached memory board. The simulation models this with a bank index that multiplies by the window size when translating addresses. Reading from `0x8000` with bank three selected actually reads from offset `0xC000` in the expansion memory array. The bank switches instantly when the register is written without any delay or interleaving. The expansion memory itself is a configurable array that defaults to sixteen kilobytes. I can override the size in the platform configuration to simulate larger or smaller expansion boards. If a program accesses an address outside the configured memory the simulation returns `0xFF` which matches the behaviour of an empty bus.

## What This Enables

The corrected port decoding means programs run correctly on the simulation even when they assume full eight-bit addressing. This includes most TEC-1G software since authors know the hardware has exact decoding. The SYS_CTRL plus SYS_INPUT registers let me debug programs that change memory modes at runtime. I can watch the transition from shadow mode to normal mode then verify that the addresses resolve correctly before plus after. The expansion banking support opens the door to testing programs that use external memory. While I do not have a physical expansion board to verify against the simulation follows the documented behaviour so it should work when the hardware arrives.
