---
status: published
title: "Simulating Hardware: TEC-1 and Cycle-Accurate Timing"
summary: "True hardware emulation requires more than just instruction execution; it requires a deterministic model of time based on processor cycles. This article explores the CycleClock and the challenges of emulating the TEC-1 periphery."
tags:
  - debug80
  - z80
  - tec1
  - emulation
  - hardware-timing
series: debug80diaries
---

# Simulating Hardware: TEC-1 and Cycle-Accurate Timing

In the initial versions of Debug80, the emulator ran as fast as the host processor allowed. While great for performance, this was disastrous for hardware fidelity. Legacy hardware like the TEC-1 depends on exact timing for everything from the pitch of its speaker to the stability of its bit-banged serial communication. To solve this, I had to move away from real-time clocks and implement a system of cycle-accurate timing.

## The Problem with Real-Time

If you use `Date.now()` to time a 4MHz Z80, you are at the mercy of the host OS's scheduling jitter. A 16ms delay might actually be 20ms or 30ms. This variance is unnoticeable to a human but fatal for a 9600 baud serial routine. The solution is the `CycleClock`, a time base that counts CPU cycles instead of milliseconds. It measures T-states—the internal clock cycles of the Z80 CPU.

## The CycleClock Implementation

The `CycleClock` is a deterministic scheduler that advances time by counting CPU cycles. Every instruction executed by the CPU returns the number of cycles it consumed, such as 4 cycles for `NOP` or 17 for `CALL`. We then advance the clock by this specific amount.

```typescript
// From src/platforms/cycle-clock.ts
export class CycleClock {
  private nowCycles = 0;
  private queue: CycleEvent[] = [];

  advance(cycles: number): void {
    this.nowCycles += cycles;
    while (this.queue.length > 0 && this.queue[0].at <= this.nowCycles) {
      const event = this.queue.shift();
      event.callback();
      // Handle intervals...
    }
  }
}
```

By scheduling events at specific cycle marks, we ensure that peripherals behave exactly the same way every time the code runs, regardless of how fast the host machine is.

## Emulating the TEC-1 Periphery

The TEC-1 is a minimalist machine without a dedicated display controller or a UART chip. Instead, the CPU handles everything by toggling bits on an I/O port. For the display, the hardware works by latching segments and then selecting a digit. The `tec1/runtime.ts` intercepts writes to ports `0x01` and `0x02`, storing the latched values until the CPU toggles a "digit select" bit.

Bit-banged serial was perhaps the biggest challenge. On a real TEC-1, the `MON1` ROM bit-bangs the serial lines. To support this in emulation, I implemented a `BitbangUartDecoder` that "watches" the I/O port. Because we use cycle-accurate timing, the decoder can know exactly when a start bit begins and sample the subsequent bits at the precise intervals required for 9600 baud.

## Audio Fidelity and the Silence Watchdog

Toggling a speaker bit produces audio on the TEC-1. The Z80 produces a 400Hz tone by toggling the bit 800 times in a simulated second.

```typescript
// From src/platforms/tec1/runtime.ts
if (speaker !== state.speaker) {
  const now = state.cycleClock.now();
  if (state.lastEdgeCycle !== null) {
    const delta = now - state.lastEdgeCycle;
    state.speakerHz = Math.round((state.clockHz / 2) / delta);
  }
  state.lastEdgeCycle = now;
}
```

To prevent audio from "sticking" when the CPU halts, I implemented a "silence watchdog" that schedules a silence event. Every time the speaker toggles, it schedules an event a few thousand cycles into the future. If the CPU stops toggling, the watchdog triggers and clears the tone.

## Conclusion

Cycle-accurate timing transformed Debug80 from a software emulator into a hardware simulator. It allowed me to run original ROMs without modification and experience the machine exactly as it behaved in 1983. In the final article of this series, I will discuss the "Great Unbundling"—how I modularized the project to support an entire ecosystem of platforms while keeping the core debugger lean and stable.
