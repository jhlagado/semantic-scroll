---
title: "Recovering Hyperdrive, part two: Pulse-width modulation"
status: published
thumbnail: assets/tape-encoding.svg
series: recovering-hyperdrive
summary: "Decoding Ken Stone’s cassette recording turned pulse timings into readable BASIC. As the words emerged, apparent damage gave way to unfamiliar Commodore conventions, and I began recovering details I could no longer recall."
tags:
  - retrocomputing
  - vic20
  - software-preservation
  - history
---
# Recovering Hyperdrive, part two: Pulse-width modulation

By John Hardy

<figure>
  <img src="./assets/tape-encoding.svg" alt="The bits 0, 1, 0, 1 encoded as two FSK tones and as Commodore short–medium or medium–short pulse pairs." width="960" height="580">
  <figcaption>Two ways to put bits on tape. Schematic waveforms, with bit durations normalised for comparison. This illustration is public domain.</figcaption>
</figure>

When Ken asked whether I could recover Hyperdrive, I would have settled for being able to read it. Nearly forty-five years had passed since he'd written the game, building a science-fiction adventure on the Caverns code we'd worked on together. In [part one](https://semantic-scroll.com/content/2026/09/09/01-recovering-hyperdrive-part-one-a-very-old-cassette/), I described how his old cassette gave me a way to investigate work I could no longer reconstruct from memory. His WAV recording contained a little over four minutes of sound. Somewhere in it were the descriptions, puzzles and instructions, in far more detail than I could remember. At first, an imperfect, all-uppercase transcription would have been enough.

A WAV file contains measurements of an audio waveform, including any noise or distortion in the recording. I expected to find frequency-shift keying, or FSK, familiar from modems and many cassette systems: one tone for zero, another for one. Commodore had surprised me by using a different system, based on pulse-width modulation. I needed to interpret the sequence of pulse lengths rather than distinguish two tones. I had to work out how Commodore had arranged the pulses, then write programs to measure their timing and extract the information from them.

There were three pulse lengths to distinguish, which at first seems an odd way to record something made of zeros and ones. Commodore used short and medium pulses in pairs: short–medium represented zero, and medium–short represented one. Both combinations took the same total time, and the VIC could read them by measuring intervals with a timer. Each eight-bit byte therefore needed sixteen pulses for its data. The third, long pulse made it possible to mark boundaries among those bits. Long–medium marked the start of a byte; long–short marked the end of a data block. Once I understood those combinations, I could look for places where a decoder could regain its position after a misreading.

Commodore had also allowed for the imperfections of cassette recording. Before a block, a run of short pulses called the leader let the computer establish timing and accommodate differences in tape speed. A recognisable countdown followed it. Each byte included a parity bit, an extra bit calculated from the data to help detect errors, and a checksum supplied a further check across the block. The computer recorded both the program and its identifying header twice, so a dropout in one copy needn't destroy the only copy of those bytes. These precautions cost tape and loading time, but they gave me structure to investigate and repeated material to compare. 

I used a TAP file to separate the timing analysis from the rest of the recovery. Commodore emulation tools use this format to represent a tape as a sequence of pulse durations. Where the WAV contains sampled sound, the TAP contains timings extracted from it, including the leaders, markers and repeated blocks. I could work on decoding those timings without analysing the audio afresh on every attempt. I wrote programs to classify pulses, find byte boundaries and extract the resulting bytes, then looked for anything I could recognise as text. That last step produced fragments like these:

```text
KHYPERDRIVE
COPY RIGHT MICRO PARTS, 1982
DIST10
TI
000000"
```

There was the game's name, followed by Micro Parts, Ken's business, and the date. Room descriptions and prompts appeared elsewhere among fragments of instructions. After looking through so many numbers, I was finally reading words from the game. But I couldn't yet treat everything printable as text. The stray K in `KHYPERDRIVE` came from a number immediately before the filename, whose value happened to match the character code for K. My extraction joined them together. To get a reliable listing, I needed the structure around those words too.

The tape header contained the filename and the memory addresses for the beginning and end of the program. Once I separated the program bytes from that surrounding information, I could put them in a PRG file. This is the standard Commodore program-file format: a two-byte loading address, followed by the bytes to place in memory, without the tape's pulses and repeated copies. A PRG can contain different kinds of program, but Hyperdrive's contents were BASIC in the form the VIC-20 stored it. Reading that as ordinary text mixed together characters and numbers with entirely different jobs.

BASIC was the language you typed directly into the VIC-20. You entered numbered instructions, then typed `RUN` for the interpreter to execute them. That was how we wrote games, but the text you typed wasn't exactly what the computer saved. The five letters of `PRINT`, for example, became a single numerical token occupying one byte. This saved scarce memory and let the interpreter select the appropriate routine directly from the token when running the program. Commodore also stored each line with its number and a pointer, an address identifying the next line. What looked like a page of numbered text was actually a compact arrangement of records and tokens. It remained BASIC, rather than compiled machine code, but I had to reverse that arrangement to read the instructions again.

One early listing opened like this:

```basic
156 H..
45604 "000000"
5 FU=0
```

That looks like a badly damaged beginning, followed by a sudden improvement. With a recording this old, damage was an obvious possibility, but the extraction could create nonsense of its own. Here, the extractor had started at the record for line three and treated its pointer as the PRG's loading address. The listing program then interpreted fields in the wrong positions. Adjusting the starting point produced sensible BASIC from line four onwards. I could make progress by correcting how I read the bytes, before concluding that I had lost them. The opening still needed attention, especially the copyright notice I'd glimpsed among the fragments. I wanted that in its original form, including the odd spelling:

```basic
1 REM COPY RIGHT MICRO PARTS, 1982
2 REM DIST10
3 CLR
```

All three lines occur in both recorded copies. `REM` introduces a comment, which the interpreter skips during execution; `CLR` clears variables. He'd written `COPY RIGHT` as two words. I could easily have typed a tidier notice myself, but that would have defeated the purpose of recovering his. The business name, date and exact wording gave me something to check against what I remembered.

The notice dates from two years before Australia's [1984 copyright amendment](https://www.legislation.gov.au/C2004A02907/asmade) explicitly included computer programs as literary works. The earlier law could protect written source, while courts distinguished it from the machine-readable form in computer chips. Ken was already selling his game and asserting copyright while the law still left those distinctions unsettled. A line the interpreter ignored preserved something of the circumstances in which he'd written it.

I could now recognise much of the BASIC, but the dots and strange symbols among the words still looked like damage. I'd been prepared to discard them. Looking into PETSCII, Commodore's character encoding, gave me another explanation for the apparent missing text. ASCII assigns numbers to letters, digits and punctuation. PETSCII overlaps enough of it to give a misleading impression of success: numbers and much punctuation come through, and many letter values look familiar. But Commodore had fitted graphics and screen controls into its character codes as well. I had to rediscover conventions that a VIC programmer in 1982 could use straight from the keyboard.

Even the alphabet depended on a setting. The VIC's default character set gave you uppercase letters alongside lines, blocks, card suits and other graphics. If you wanted lowercase letters, you switched to an alternative set and gave up some of those symbols. You could change the appearance of the text without changing a byte of the text itself. A value of 65 displayed as A in the first mode and a in the second; in mixed-case mode, which combines uppercase and lowercase letters, 193 could display an uppercase A. It's an odd arrangement if you're expecting ASCII, and it explained some of the misleading output. My conversion could turn a lowercase letter into a capital, discard the actual capital as an unrecognisable symbol, and leave me thinking I'd recovered an uppercase-only game. The original bytes still contained the letter-case information I had assumed I might have to give up.

The title provides a small example of how much I could throw away during conversion. Two attempts rendered the same line like this:

```basic
422 PRINT".........YPERDRIVE"
422 PRINT"       HYPERDRIVE"
```

The first converter inserted dots for values it didn't translate. Those nine dots covered a black-text control, five moves to the right, two moves down and an uppercase H. The title routine selected mixed-case mode, so the remaining letters would appear in lowercase: *Hyperdrive*. The second conversion recovered the H, but still replaced cursor movements with spaces and printed the word in capitals. It looked cleaner, yet still lost the positioning and letter case.

Commodore even let you put screen operations inside quotation marks along with the text. A colour-key press could insert a control byte into a string; printing that string would change the colour of the letters that followed. Cursor movements worked in much the same way. During a BASIC listing on the VIC, those controls could appear as reversed symbols that you could edit alongside the words. A single `PRINT` statement could position the title and set its colour. Decades later, I was replacing those instructions with dots. Even the value 144 depended on context: it meant the BASIC keyword `STOP` in an instruction, but selected black text inside an output string. I had to follow the quotation marks and interpret the bytes accordingly to recover the original screen presentation.

By this stage I could read the descriptions and trace the logic of a game I couldn't have recreated from memory. Working through those roughly fourteen kilobytes of descriptions and instructions brought back details I hadn't thought about for decades. The exact spelling of a notice, the case of a letter and the positioning of a title were all still there to recover. I'd started out willing to lose the letter case and colour for the sake of reading anything at all. Now I wanted to see the title appear as he'd arranged it, enter a command and explore the game again.

In the next article, I'll take the recovered program into VICE, a Commodore emulator. Getting a readable listing was one achievement; getting that program to accept commands, display its text and produce sound would take more work.
