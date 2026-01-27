---
status: published
title: "Cracked the Code: The D8 Mapping Specification"
summary: "Source-level debugging in VS Code requires a precise mapping between machine addresses and source lines. This article details how I developed the D8 Mapping Specification to bridge the gap between Z80 machine code and original assembly source."
tags:
  - debug80
  - z80
  - source-maps
  - json
  - debugging-tools
series: debug80diaries
---

# Cracked the Code: The D8 Mapping Specification

In modern web development, source maps are a given. We write TypeScript, and the debugger maps execution back from the transpiled JavaScript without extra work. In the world of 8-bit assembly, no such standard exists. A typical assembler produces a `.hex` file for execution. It also emits a `.lst` (listing) file for human reading. To give Debug80 the "Source-Level" feel (the ability to click a line in an `.asm` file and set a persistent breakpoint), I had to build a translation layer known as the D8 Mapping Specification.

## The Problem: Listing Ambiguity

An assembly listing file is a textual representation of the assembly process. The listing pairs each source line with its emitted bytes at a specific address. Parsing these files on the fly during a debug session is slow. Listings turn ambiguous when macros or `INCLUDE` directives appear. I needed a more structured approach built for lookup, not for human reading.

That format needed to support quick runtime queries while staying portable across machines. Multi-file projects also had to work without forcing a custom parser into the runtime.

## The Solution: The D8 Debug Map

The D8 Debug Map is a JSON schema that acts as a pre-indexed cache of the assembly process. This schema transforms the linear listing into a file-centric hierarchy, which makes lookups fast and reliable. That change moves the heavy parsing work into the build step, where it belongs.

```typescript
// From src/mapping/d8-map.ts
export interface D8DebugMap {
  format: 'd8-debug-map';
  version: 1;
  arch: 'z80';
  files: Record<string, D8FileEntry>;
  // ...
}

export interface D8Segment {
  start: number;
  end: number;
  line?: number;
  kind?: D8SegmentKind;
  confidence?: D8Confidence;
}
```

By grouping segments by their original source file, the debug adapter can instantly resolve a Program Counter (PC) address to a specific line in a specific file. This eliminates the need for linear scanning. Breakpoint resolution becomes nearly instantaneous in practice. It also means every lookup has a clear owner, which simplifies the adapter’s logic.

## The Concept of Confidence

One of the most useful features of the D8 spec is the use of "Confidence Levels." Because the mapping between machine code and source is not always one-to-one, I introduced the `D8Confidence` type for cases where directives inline data. It lets the mapper assign a level of certainty to each file entry based on how direct the mapping is.

A **High** confidence level means the address is explicitly mapped to a specific line of code. **Medium** indicates the mapper has guessed the line based on surrounding context. Finally, **Low** serves as a fallback match where the address falls within a file's range.

This allows the UI to remain helpful; by moving the instruction pointer to the closest "best guess" line, the debugger avoids failing when a precise match is missing. The goal is graceful behaviour even when the listing cannot provide a perfect answer.

## Pre-Indexing for Performance

Early versions of Debug80 parsed the `.lst` file on every launch, but for a project like *Caverns* with thousands of lines, this added a noticeable delay. With the D8 spec, the assembly process generates the `.d8.json` file. The adapter then simply performs a `JSON.parse()`. If the file is missing or stale compared to the listing, the adapter regenerates it automatically. That keeps mapping accurate without a performance penalty.

## Conclusion

The D8 Mapping Specification is the glue that makes Debug80 feel like a modern tool. It handles the messy reality of assembly listings. The interface it provides for the VS Code editor stays clean and fast. With the code mapped, it’s time to look at the next frontier: simulating real hardware. In the fifth article, I’ll explore the world of cycle-accurate timing and the TEC-1 hardware periphery.
