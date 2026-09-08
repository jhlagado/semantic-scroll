---
title: "Recovering Hyperdrive, part one: a very old cassette"
status: published
thumbnail: assets/vic20-versions-te-8.jpg
series: recovering-hyperdrive
summary: "Recovering Ken Stone’s VIC-20 adventure from a cassette recording involved decoding pulse timings, BASIC and PETSCII. The investigation also helped me reconstruct memories of our early work on Caverns and the games Ken sold through Micro Parts."
tags:
  - retrocomputing
  - vic20
  - software-preservation
  - history
---
# Recovering Hyperdrive, part one: a very old cassette

By John Hardy

<figure>
  <img src="./assets/vic20-versions-te-8.jpg" alt="Micro Parts advertisement for Hyperdrive and Caverns, with spacecraft and cavern illustrations.">
  <figcaption>Micro Parts advertises Hyperdrive and Caverns in Talking Electronics, issue 8.</figcaption>
</figure>

We tend to imagine a memory as a recording, something the brain files away until we find a way to play it back. Remembering is a process of construction. We retain traces of experience, then assemble them into an account of what happened. The psychologist Frederic Bartlett called remembering “an imaginative reconstruction, or construction” in his 1932 book *Remembering*. When I look back across nearly forty-five years, a small fact can trigger a connection, rule out something I'd assumed, or give me enough to work backwards. Discussing it with someone who was there helps us build a shared account. A surviving object gives us something outside our own heads to check.

In this case, the object was a cassette containing Hyperdrive, a text adventure my friend Ken Stone wrote in the early 1980s. Ken and I knew each other growing up and worked together on many projects, most famously the TEC-1 computer kit. We also wrote games. Hyperdrive grew out of Caverns, which I started on a Sinclair ZX81 with a 16K RAM expansion in 1981. By 1982 it had developed into a substantial adventure and a collaboration between Ken and me.

Ken bought a VIC-20 that year, and I remember us entering the Caverns code into it largely by hand. He then used my Caverns code as the foundation for Hyperdrive. The new game's story, text, setting and puzzles were entirely Ken's work: he turned the cave adventure into an exploration of a derelict spacecraft. Ken sold both games on cassette through his business, Micro Parts. The advertisement above lists their prices and memory requirements, including a 16K expansion for Hyperdrive.

Ken has never been much for throwing things away, and he kept the cassette long after he moved on from the VIC-20. He no longer had a machine to read it, and attempts to recover the game went nowhere. Years later he recorded the tape as a WAV file. After I recovered some of my own early work, with considerable help from others, he asked whether I could do anything with his recording. Around Christmas 2025, I began investigating. I could make copies and try different approaches without putting the ageing cassette through another tape player.

There was no guarantee of success. Magnetic tape deteriorates, and a WAV file preserves any damage in the signal along with the data. I expected the recording to use [frequency-shift keying](https://www.ti.com/lit/an/sprac94c/sprac94c.pdf), or FSK, familiar from cassette storage and modems. Binary FSK represents a zero with one audio frequency and a one with another. A decoder distinguishes the two tones to recover the bits. That wasn't the scheme I needed for this recording.

Commodore used pulse-width modulation, encoding information through the duration and sequence of pulses. Its [standard cassette format](https://www.pagetable.com/?p=964) uses short, medium and long pulses: short followed by medium represents zero, medium followed by short represents one, and combinations involving long pulses mark boundaries. Analysing the waveform meant looking for those timing patterns. I worked through a series of programs to extract progressively more information, from pulse lengths to bytes and then recognisable BASIC. One surviving decoder groups pulse lengths into three clusters; another stage searches the decoded bytes for plausible BASIC line numbers and program structure.

Even a good set of bytes wouldn't simply open as a text file. Commodore BASIC stores keywords such as `PRINT` as single-byte tokens, alongside line numbers, pointers and the text inside quotation marks. The recovery programs had to interpret that structure to produce a readable listing. Some early output contained dots and unfamiliar symbols where I expected words. I initially aimed for an uppercase transcription and would have happily discarded the apparently indecipherable bits just to read Ken's game again.

That would have thrown away text I could recover. Commodore used PETSCII, its own character encoding, and reading it as ASCII gave misleading results. The VIC-20 also had a [choice of character sets](https://www.zimmers.net/anonftp/pub/cbm/vic20/manuals/vic20-programmers-reference-guide-1.1.txt): uppercase with a large selection of graphics, or upper- and lowercase with fewer graphics. The same character code could produce a different symbol or letter depending on that choice. Hyperdrive switches between these sets for its title and main game. Once I understood the encoding and display modes, I could recover the mixed case instead of flattening everything into capitals. Some apparent missing text had survived on the tape; I hadn't yet interpreted it correctly.

Colour gave me another reason to look more closely. A BASIC string could contain control codes that changed the text colour when the program printed it; in a listing, those controls could look like odd symbols. Programs could also use `POKE` to write directly to the VIC's hardware registers, as the [programming guide](https://www.zimmers.net/anonftp/pub/cbm/vic20/manuals/vic20-programmers-reference-guide-1.1.txt) explains. Hyperdrive does this to change its screen colours and character settings, and to produce sound effects. My original ZX81 Caverns had no sound. As I understood more of Ken's program, recovering its colour and sound became part of the job too. I no longer wanted to stop at a readable transcript.

The details also gave me a way back into the older work. Hyperdrive has a compass, an odd accessory aboard a spacecraft until you recognise its origin in Caverns. That surviving piece of code establishes a connection I might otherwise have forgotten. From there I could ask what Ken had kept, what he'd changed, and how we'd got from one game to the other. I couldn't reconstruct Hyperdrive from memory. Reading it let me reconstruct parts of that history by following evidence and eliminating possibilities that didn't fit. The investigation ended with Ken's game running again, and with a much clearer account of work I hadn't thought about for decades.

In the next article, I'll follow the recovery experiments in detail: how the programs extracted BASIC from the recording, what the early listings got wrong, and how I refined them.
