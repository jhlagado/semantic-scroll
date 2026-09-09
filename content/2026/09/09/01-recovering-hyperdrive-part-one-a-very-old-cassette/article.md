---
title: "Recovering Hyperdrive, part one: a very old cassette"
status: published
thumbnail: assets/vic20-versions-te-8.jpg
series: recovering-hyperdrive
summary: "Ken Stone’s old cassette preserved a game I could no longer reconstruct from memory. Recovering Hyperdrive gave me evidence to piece together the history of our early work on Caverns and the games he sold through Micro Parts."
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

We tend to imagine a memory as a recording, something the brain files away until we find a way to play it back. But remembering is a process of construction: we build an account in the present from the traces of experience we still retain. The psychologist Frederic Bartlett called it “an imaginative reconstruction, or construction” in his 1932 book *Remembering*. Looking back across nearly forty-five years, I have fragments to work from, with considerable gaps between them. A small fact can trigger a connection; inference and deduction can help me work backwards, test an assumption and piece together a sequence of events. Discussing it with someone who was there gives us more to work with. A surviving object lets us check that growing account against something that has persisted outside our own recollections.

In this case, the object was a cassette containing Hyperdrive, a text adventure my friend Ken Stone wrote in the early 1980s. Ken and I knew each other growing up and worked together on many projects, most famously the TEC-1 computer kit. We also wrote games. Hyperdrive grew out of Caverns, which I started on a Sinclair ZX81 with a 16K RAM expansion in 1981. By 1982 it had developed into a substantial adventure and a collaboration between Ken and me.

Ken bought a VIC-20 that year, and I remember us entering the Caverns code into it largely by hand. He then used my Caverns code as the foundation for Hyperdrive. The new game's story, text, setting and puzzles were entirely Ken's work: he turned the cave adventure into an exploration of a derelict spacecraft. Ken sold both games on cassette through his business, Micro Parts. The advertisement above lists their prices and memory requirements, including a 16K expansion for Hyperdrive.

Ken has never been much for throwing things away, and he kept the cassette long after he moved on from the VIC-20. He no longer had a machine to read it, and attempts to recover the game went nowhere. Years later he recorded the tape as a WAV file. After I recovered some of my own early work, with considerable help from others, he asked whether I could do anything with his recording. Around Christmas 2025, I began investigating. I could make copies and try different approaches without putting the ageing cassette through another tape player.

Magnetic tape deteriorates, and the recording would preserve damage along with the data. Once I understood how Commodore encoded the program, I could measure the pulse timings and extract bytes. Interpreting those bytes as BASIC, the language we'd used, produced readable descriptions and instructions, although some early output contained dots and unfamiliar symbols. I initially aimed for an uppercase transcription. Checking Commodore's character encoding showed that some apparent damage came from my conversion; the original letter case and screen controls were still present.

The recovered program included the title positioning, text colours and sound effects that Ken had added on the VIC-20. My original ZX81 Caverns had no sound. Restoring those features took further work after I could read the source, and I eventually had the game running again.

Reading the code also helped me examine its history. Hyperdrive has a compass, an odd accessory aboard a spacecraft, inherited from Caverns. I could follow that connection to establish what Ken had retained or changed, comparing the code with what I remembered. The cassette preserved the program; that evidence, together with the fragments I still recalled, let me construct an account of its history.

In [part two](https://semantic-scroll.com/content/2026/09/09/02-recovering-hyperdrive-part-two-pulse-width-modulation/), I'll follow the recovery experiments in detail: how the programs extracted BASIC from the recording, what the early listings got wrong, and how I refined them.
