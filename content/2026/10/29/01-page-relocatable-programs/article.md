---
title: "Relocating Z80 programs one bit at a time"
status: published
thumbnail: assets/prl-hero.png
summary: "PRL lets Z80 code load on any suitable 256-byte boundary, using an ordinary assembler and a tiny relocation routine. Bringing CP/M to the TEC-1G led me to this decades-old solution."
tags:
  - z80
  - cpm
  - retrocomputing
  - executable-formats
  - relocation
---
# Relocating Z80 programs one bit at a time

By John Hardy

<figure>
  <picture>
    <source srcset="./assets/prl-hero.svg" type="image/svg+xml">
    <img src="./assets/prl-hero.png" alt="A seventeen-byte program assembled at 0000h and at 0100h. Two bytes differ by one and are marked in a bitmap. Loaded at 8000h those two bytes become 80h and every other byte is unchanged." width="1200" height="670">
  </picture>
  <figcaption>Two assemblies reveal the address bytes to adjust for this program. This illustration is public domain.</figcaption>
</figure>

Digital Research’s PRL format lets you load a Z80 program wherever there’s room on a 256-byte boundary. You can produce it with an ordinary assembler, without a separate linker. The relocation routine below takes 26 bytes. After loading, the relocation information can be discarded.

That’s useful for drivers, resident utilities and overlays whose final address depends on what else is in memory. I’ve been programming the Z80 for roughly 45 years and somehow I’m only just discovering it.

I encountered PRL while bringing CP/M to the [TEC-1G](https://github.com/MarkJelic/TEC-1G) through [TEC-OS](https://debug80.com/tec-os/). Ken Stone and I designed the original [TEC-1](https://github.com/crsjones/TEC-1), published in *Talking Electronics* in 1983. Mark Jelic developed the TEC-1G for its fortieth anniversary in 2023. With the operating system in ROM and files on SD, I wanted resident programs to fit into available RAM without rebuilding each for a fixed address.

## The relocation problem

CP/M loads a COM file at 0100h. Its internal subroutine calls, jumps and data pointers contain absolute addresses. Copy it elsewhere and those addresses still point to the old location. Relative branches help locally but the Z80 has no relative `CALL` or general program-counter-relative data addressing.

MS-DOS inherited COM files but the 8086’s segment registers made placement more flexible. Offset 0100h could refer to different physical locations. The Z80 has no equivalent segment registers, so the addresses inside the code need adjusting.

PRL means **Page Relocatable**. Used by MP/M and CP/M 3, it restricts loading to **256-byte page boundaries**. Moving by whole pages leaves each internal address’s low byte unchanged. Only the high byte needs adjusting. A routine at 0109h becomes 8009h when its program moves to 8000h. Add 7Fh to the high byte and leave 09h alone.

The loader needs a list of bytes to adjust. PRL stores that list as a bitmap, one bit per code byte. Fixed addresses such as CP/M’s BDOS entry at 0005h remain untouched. The loader never decodes an instruction.

## Two assemblies, no linker

Assemble the same source at 0000h and 0100h, then compare the images. For ordinary internal addresses, the high byte increases by one. Fixed addresses and the rest of the code stay unchanged. This supplies the relocation information without a special assembler or a separate linking step.

Here’s a program that prints `HI` through CP/M:

```asm
BDOS    EQU     $0005
        ORG     $0100
START:  LD      DE,MSG
        CALL    PRINT
        JP      $0000
PRINT:  LD      C,9
        JP      BDOS
MSG:    DB      "HI$"
```

[Atom](https://semantic-scroll.com/content/2026/09/04/01-atom-my-z80-assembler/), my Z80 assembler, turns it into 17 bytes. These are the two images:

<pre aria-label="Assembly comparison. Highlighted columns 02 and 05 contain the bytes to relocate."><code>offset   00 01 <span style="background:#f2c6b8;color:#512518;font-weight:700" title="Relocation byte at offset 02">02</span> 03 04 <span style="background:#c5ddd6;color:#173e35;font-weight:700" title="Relocation byte at offset 05">05</span> 06 07 08 09 0A 0B 0C 0D 0E 0F 10
0000h    11 0E <span style="background:#f2c6b8;color:#512518;font-weight:700" title="Relocation byte at offset 02">00</span> CD 09 <span style="background:#c5ddd6;color:#173e35;font-weight:700" title="Relocation byte at offset 05">00</span> C3 00 00 0E 09 C3 05 00 48 49 24
0100h    11 0E <span style="background:#f2c6b8;color:#512518;font-weight:700" title="Relocation byte at offset 02">01</span> CD 09 <span style="background:#c5ddd6;color:#173e35;font-weight:700" title="Relocation byte at offset 05">01</span> C3 00 00 0E 09 C3 05 00 48 49 24
diff     00 00 <span style="background:#f2c6b8;color:#512518;font-weight:700" title="Relocation byte at offset 02">01</span> 00 00 <span style="background:#c5ddd6;color:#173e35;font-weight:700" title="Relocation byte at offset 05">01</span> 00 00 00 00 00 00 00 00 00 00 00</code></pre>


Only offsets 2 and 5 differ. They hold the high bytes of `MSG` and `PRINT`. The fixed jumps to 0000h and 0005h remain identical. [Atom](https://semantic-scroll.com/content/2026/09/04/01-atom-my-z80-assembler/) produces these 17-byte images by changing the `ORG` between assemblies.

The difference row subtracts the first image from the second. Packing the marks into bits, most significant bit first, gives:

```text
code offsets    00 01 02 03 04 05 06 07 | 08 09 0A 0B 0C 0D 0E 0F | 10 -- -- -- -- -- -- --
bitmap bits      0  0  1  0  0  1  0  0 |  0  0  0  0  0  0  0  0 |  0  0  0  0  0  0  0  0
binary byte             00100100         |         00000000         |         00000000
hex byte                   24           |            00            |            00
```


Offsets 2 and 5 become bits 5 and 2: `20h + 04h = 24h`. The complete bitmap is `24 00 00`. Seventeen code bytes require three bitmap bytes, with seven unused bits at the end.

This technique requires code written for page relocation. Multiplying an internal address by two, for example, needs a different adjustment. A comparison tool should reject differences other than zero or one, though two assemblies alone cannot prove every possible address expression safe. Keep internal references straightforward and fixed hardware or system addresses constant.

## Loading the result

A PRL file contains a 256-byte header, code assembled for 0100h and the relocation bitmap. The header records the code length and any extra uninitialised storage required. Loading the code at page `p` means adding `p - 1` to each marked byte. At 8000h, `p` is 80h and the adjustment is 7Fh.

The origin is worth checking. The related SPR format uses code assembled for 0000h. I initially used that convention under the PRL name in TEC-OS. My own files worked but a genuine PRL would have been relocated one page out.

Here’s the 26-byte relocation loop. `HL` points to the code, `IX` to the bitmap, `BC` holds the code length and `E` holds the page adjustment:

```asm
; Relocate BC bytes of code at HL, adding E to each byte whose bit is set
; in the bitmap at IX.
RELOC:  LD      D,0             ; no bitmap bits in hand yet
NEXT:   LD      A,B             ; stop when the count reaches zero
        OR      C
        RET     Z
        SLA     D               ; the next bit goes into carry
        JR      NZ,TEST         ; D still holds the marker, so the bit is real
        LD      A,(IX+0)        ; fetch the next eight bits
        INC     IX
        SCF                     ; a marker bit enters at bit 0
        RLA                     ; and bit 7 goes into carry
        LD      D,A
TEST:   JR      NC,SKIP         ; an unmarked byte stays as it is
        LD      A,(HL)
        ADD     A,E             ; a marked byte gets the page offset
        LD      (HL),A
SKIP:   INC     HL
        DEC     BC
        JR      NEXT
```


A marker bit in `D` tracks progress through each bitmap byte. `SLA` shifts the next relocation bit into carry. Once the marker leaves `D`, the routine fetches another byte. Only marked code bytes receive the adjustment. The destination must have room for the complete image and its extra storage.

## Beyond CP/M

The page-relocation arithmetic doesn’t depend on CP/M or on Z80 opcodes. It could also suit other 8-bit processors with 16-bit addresses, including the 6502. Its [instruction set](https://www.westerndesigncenter.com/wdc/documentation/w65c02s.pdf) includes absolute addresses and relative branches too. That’s an application of the same technique, not compatibility with CP/M executables. A loader and suitable assembly conventions would still be needed, particularly around fixed zero-page locations and address-dependent instruction sizes.

In TEC-OS I use PRL to load residents below the BDOS and lower the available program area accordingly. The code fits around what’s already installed and the bitmap occupies no RAM afterwards. I think this deserves to be familiar territory for Z80 programmers. It would have saved me some work if I’d heard the news earlier.
