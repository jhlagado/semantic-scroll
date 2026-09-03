---
status: published
title: "First read, wrong data: the ST7920's dummy read"
summary: "The ST7920 LCD controller requires a dummy read after its graphics address changes. A routine that worked on a real TEC-1G but failed in Debug80 showed why a peripheral emulator must model bus transactions as well as stored bytes."
tags:
  - debug80
  - tec1g
  - st7920
  - glcd
  - emulation
  - hardware
---

# First read, wrong data: the ST7920's dummy read

By John Hardy

A graphics routine gave me a useful emulator failure. It drew correctly on a real TEC-1G, then read the pixels back to verify them. Debug80 drew the same image but returned zero during verification. The display proved that the writes had landed; the read path was wrong.

I had treated a read from the ST7920 LCD controller as an array lookup. Once the program selected an address, the emulator returned the byte stored there. That model captured the contents of display memory while missing the transaction the controller presents on its bus.

## The missing read

The [ST7920 data sheet](https://www.displayfuture.com/Display/datasheet/controller/ST7920.pdf) requires a dummy read after changing from a write to a read operation. It also requires another dummy read whenever software issues a new address instruction. Following bytes can then be read without repeating it.

For a program reading address N, the sequence is:

1. Set the graphics address to N.
2. Read once and discard the result.
3. Read again to receive the byte at N, then continue reading subsequent bytes.

A useful emulator model is a one-byte read latch. Setting a graphics row or column marks that latch as unprimed. The first data-port read loads the byte at the selected address into the latch and returns zero. The next read returns the latched byte, advances the controller's byte phase and column, and prepares the following byte.

The distinction matters because the first read changes the controller's state. A direct lookup can return the right byte while still emulating the device incorrectly.

## Proving the sequence

I checked the behaviour on a physical TEC-1G fitted with an ST7920 display. A short Z80 program wrote a known byte to graphics RAM, selected its address, performed two reads and sent both results over the serial port. The first result was zero; the second was the byte I had written.

Debug80 now records whether the graphics read latch has been primed. Its regression test writes `0xaa`, returns to that graphics address and checks the two reads explicitly:

```typescript
const dummy = rt.ioHandlers.read(0x87);
const value = rt.ioHandlers.read(0x87);

expect(dummy).toBe(0x00);
expect(value).toBe(0xaa);
```

That small test preserves the part most likely to disappear in a later tidy-up. Returning the requested byte immediately looks simpler and will pass any test that only writes to the display. It fails as soon as a program reads graphics RAM in the way the hardware expects.

The fault took longer to find than to fix. A zero on the read bus could have meant a bad write, a wrong address or an empty buffer. Seeing the correct image on the physical display ruled those out; the data sheet's brief mention of a dummy read then made sense.

The incident left me with a rule for emulator work: treat every peripheral read as a possible state transition until the hardware proves otherwise. The ST7920 stores ordinary bytes in graphics RAM; its bus delivers them through a read pipeline. Debug80 became accurate when it modelled both.
