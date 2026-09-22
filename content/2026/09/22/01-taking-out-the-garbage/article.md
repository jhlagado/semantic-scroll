---
title: "Taking out the garbage"
status: published
thumbnail: assets/hero.png
series: building-skate
summary: "Skate reclaims list pairs that a running program can no longer reach. Its collector traces from live roots, keeps reachable pairs and returns the rest to the free list."
tags:
  - retrocomputing
  - scheme
  - z80
  - cpm
  - garbage-collection
  - triptych
---
# Taking out the garbage

By John Hardy

<figure>
  <picture>
    <source srcset="./assets/hero.svg" type="image/svg+xml">
    <img src="./assets/hero.png" alt="Two roots lead to three reachable pairs. Two other pairs have no path from either root and can be reclaimed." width="1200" height="680">
  </picture>
  <figcaption>The coloured pairs remain reachable. The grey pairs can be reclaimed. This illustration is public domain.</figcaption>
</figure>

I'm building Skate, a Scheme compiler for small Z80 systems running CP/M. In [Room to run](https://semantic-scroll.com/content/2026/09/20/01-room-to-run/) I looked at the memory a compiled Scheme program has to share with its runtime and working data. Lists make that budget tangible. A program can assemble a list, pass it between procedures and eventually stop using it. The list consists of pairs, small two-slot records that still occupy memory until the runtime recovers them.

In an ordinary list, one part of each pair holds an item and the other refers to the next pair. A reference to the first pair is enough to find the entire list by following those links. The runtime needs a way to distinguish a list still in use from one that has been abandoned. Scheme doesn't ask the programmer to free each pair.

The collector begins with *roots*: known places where the running program can still hold references. A global variable can be a root. So can a live value in an active procedure call. There is no single master root for the whole program. Collection starts from all the roots that are live at that moment and follows references from each one.

The diagram shows two roots. The upper one leads to two pairs and the lower one leads to a third. One grey pair points to another, but neither can be reached from a root. A link between abandoned pairs does not keep them alive. What counts is a path *from a root*.

Skate marks each pair it reaches and then examines the allocated pairs left unmarked. Those unmarked pairs are the garbage. Their storage can return to the allocator's free list, ready for another list. If a program keeps every list it creates, those lists remain reachable and collection cannot make space for more. When references disappear, repeated work can use the same finite heap again.
