---
title: "Triptych, a retro computer in three parts"
status: published
thumbnail: assets/three-esp32-boards.png
summary: "Triptych is a retro computer project using three ESP32 boards for CPU and storage, VGA video, and sound. The goal is a machine you can program directly, with a Z80 and CP/M at the centre of the current design."
tags:
  - triptych
  - esp32
  - z80
  - retrocomputing
---
# Triptych, a retro computer in three parts

By John Hardy

<figure class="article-figure">
  <img src="./assets/three-esp32-boards.png" alt="Concept illustration of three ESP32 development boards mounted end to end on a white breadboard." width="1536" height="1024">
  <figcaption>Concept illustration of the three-board design. This illustration is public domain.</figcaption>
</figure>

I’m developing a retro computer around three ESP32 microcontroller boards. I call it Triptych because each board takes on a different subsystem: CPU and bulk storage, video, and sound. I’m currently working on the CPU board, with a design that emulates a Z80 and runs CP/M. The second board is for generating VGA signals to drive a monitor, and the third is for sound generation. The goal is a 1980s-style computer that you can develop software on directly, much as people did with the Commodore 64, TRS-80 or Apple II. I’ll be posting my progress here as the system takes shape.
