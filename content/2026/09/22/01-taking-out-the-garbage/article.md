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

Scheme is appealing because it lets a programmer express an algorithm through procedures and the values flowing between them, rather than spelling it out chiefly as a sequence of changes to storage. That style has its roots in lambda calculus and often feels closer to how we reason through a problem. Lists and other structures can take shape as the calculation proceeds and remain available for as long as the program can use them.

In a language such as C, the programmer also has to arrange the lifetime of dynamically allocated data. As a structure passes between parts of a program, deciding when it is safe to free it can become a substantial part of the work. Scheme moves that bookkeeping into the runtime.

That trade becomes sharper in Skate, my attempt to make a useful Scheme for small Z80 systems. The compiled program, its runtime and its data all have to fit within a 64 KiB address space. Garbage collection lets repeated work reuse storage, but the collector itself takes up space and pauses the program while it traces live data. Getting enough Scheme onto the machine means paying for that machinery without leaving too little room or time for the program.

A list gives us a simple example. It consists of pairs, small two-slot records. One part of each pair holds an item and the other refers to the next pair. A reference to the first pair is enough to find the entire list by following those links. When the last reference to a list disappears, its pairs still occupy memory until the runtime recovers them. It must distinguish those pairs from ones the program can still use.

The collector begins with *roots*: known places where the running program can still hold references. A global variable can be a root. So can a live value in an active procedure call. There is no single master root for the whole program. Collection starts from all the roots that are live at that moment and follows references from each one.

The diagram shows two roots. The upper one leads to two pairs and the lower one leads to a third. One grey pair points to another, but neither can be reached from a root. A link between abandoned pairs does not keep them alive. What counts is a path *from a root*.

This is mark-and-sweep collection. Skate marks every pair it reaches from a root, then sweeps through the allocated pairs and returns the unmarked ones to the allocator's free list. If a program keeps every list it creates, those lists remain reachable and collection cannot make space for more. When references disappear, repeated work can use the same finite heap again.
