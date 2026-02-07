---
status: published
title: "Emulating the ST7920 GLCD: Why Your First Read Returns Zero"
summary: "The ST7920 graphical LCD controller has a read pipeline that returns stale data on the first read after setting an address. I discovered this behaviour while debugging a display routine that worked on hardware but failed in emulation. Fixing the emulator required understanding how the real chip sequences its internal operations."
tags:
  - debug80
  - tec1g
  - st7920
  - glcd
  - emulation
  - hardware
series: debug80diaries
---

# Emulating the ST7920 GLCD: Why Your First Read Returns Zero

By John Hardy

The TEC-1G includes support for the ST7920 graphical LCD controller, a chip that drives 128×64 pixel displays using a parallel interface. Programs can write pixels to display buffer memory and read them back for verification or manipulation. The read path has a quirk that tripped me up: the first read after setting an address returns the data from the *previous* address, not the address you just specified.

I discovered this while testing a graphics routine that drew shapes and then verified the framebuffer contents. The routine worked correctly on real hardware but failed in my emulator. The verification loop expected specific pixel patterns and found zeros instead. The writes were landing correctly—I could see the display updating—but the reads returned wrong values.

## The pipeline behaviour

The ST7920's data sheet explains the read pipeline in a few terse sentences. When you set the address counter with a command, the controller latches the new address but does not immediately fetch the corresponding data. The data bus still holds whatever was fetched previously. To read the data at the new address, you must perform a dummy read that primes the pipeline, then perform the actual read that returns the wanted value.

The sequence looks like this:

1. Write a command to set the address counter to address N
2. Perform a dummy read (discard the result)
3. Perform the real read (returns data at address N)
4. Subsequent reads return data at N+1, N+2, etc. (address auto-increments)

The dummy read triggers an internal fetch from address N. That fetch completes during the read cycle, and the data becomes available for the next read. If you skip the dummy read, you get stale data from whatever address was previously active.

## Why emulators get this wrong

A naive emulator models the data read as a simple array lookup: given address N, return `memory[N]`. This works for writes, which take effect immediately, but fails for reads because it ignores the pipeline delay. The real chip does not deliver data from address N until one read cycle after you request it.

My initial implementation did exactly this. The read handler received the address and returned the corresponding byte from the display buffer. Writes worked. Single reads worked. But any code that set an address and immediately read from it returned the wrong value.

The fix required modelling the pipeline state. The emulator now tracks two values: the current address counter and the pending read value. When code sets a new address, the pending value stays stale. The first read returns the pending value and then loads the new address into the pipeline. Subsequent reads continue through the buffer with automatic incrementing.

## The implementation

The TEC-1G runtime maintains a `glcdPendingRead` field alongside the display buffer. When the address counter changes, this field is not updated. When a read occurs, the emulator returns `glcdPendingRead` and then fetches the byte at the current address into `glcdPendingRead` for the next read. The address counter increments after the fetch.

```typescript
readGlcdData(): number {
  const value = this.glcdPendingRead;
  this.glcdPendingRead = this.glcdBuffer[this.glcdAddress];
  this.glcdAddress = (this.glcdAddress + 1) & 0x1FFF;
  return value;
}
```

Setting a new address resets the pipeline state to a known value. I chose zero, which matches what I observed on hardware when reading from an uninitialised region.

```typescript
setGlcdAddress(address: number): void {
  this.glcdAddress = address & 0x1FFF;
  this.glcdPendingRead = 0x00;
}
```

The dummy read that programs must perform consumes the zero, primes the pipeline with the actual data at the new address, and leaves subsequent reads returning correct values.

## Testing the fix

I wrote a test that exercises the pipeline behaviour explicitly:

```typescript
it('returns stale data on first read after address change', () => {
  runtime.writeGlcdData(0xAA);  // Write 0xAA at address 0
  runtime.setGlcdAddress(0);    // Reset address to 0
  const dummy = runtime.readGlcdData();  // Dummy read
  const actual = runtime.readGlcdData(); // Real read
  expect(dummy).toBe(0x00);     // Stale/reset value
  expect(actual).toBe(0xAA);    // Actual data
});
```

The test captures the exact behaviour that the original routine depended on. With the pipeline modelled correctly, the verification loop in the graphics routine passes.

## Hardware verification

I confirmed the behaviour on a physical TEC-1G with an ST7920 display attached. A short Z80 program writes a known pattern to display memory, sets the address, performs reads, and reports the values through the serial port. The first read after setting the address returned zero. The second read returned the written value. The emulator now matches.

The data sheet describes this behaviour, but the description is easy to overlook. The phrase "dummy read" appears once without much context. I had read the data sheet before and missed the implication. Seeing the actual hardware behaviour made the documentation make sense retroactively.

## Implications for emulator design

Peripheral emulation often requires modelling internal timing and sequencing, not just the logical contents of registers. The ST7920's read pipeline is invisible to code that only writes to the display—writes take effect immediately—but becomes critical for code that reads back. An emulator that supports only writes might pass basic tests and fail on more sophisticated programs.

The fix was small: a few lines of state management. Finding the bug took longer because the symptoms—reads returning zero—could have indicated many different problems. Once I understood the real chip's behaviour, the solution was obvious. The lesson is familiar: when emulation diverges from hardware, the data sheet usually contains the answer, even if it takes a second reading to find it.

