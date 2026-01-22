---
status: published
title: "Cracked the Code: The D8 Mapping Specification"
summary: "Source-level debugging in VS Code expects a precise mapping between machine addresses and source lines. This article details how I developed the D8 Mapping Specification to bridge the gap between Z80 machine code and original assembly source."
tags:
  - debug80
  - z80
  - source-maps
  - json
  - debugging-tools
series: debug80diaries
---

# Cracked the Code: The D8 Mapping Specification

In modern web development, source maps are a given. We write TypeScript, and the debugger seamlessly maps execution back from the transpiled JavaScript. In the world of 8-bit assembly, no such standard exists. A typical assembler produces a `.hex` file for execution and a `.lst` (listing) file for human reading. To give Debug80 the "Source-Level" feel (the ability to click a line in an `.asm` file and set a persistent breakpoint), I had to build a translation layer known as the D8 Mapping Specification.

## The Problem: Listing Ambiguity

An assembly listing file is a textual representation of the assembly process. It shows the address, the machine code bytes, and the original source line. However, parsing these files on the fly during a debug session is slow. Furthermore, listings can be ambiguous, especially when dealing with macros or `INCLUDE` directives. I needed a more structured approach.

I needed a format that was:
1.  **Fast**: Grouped for O(1) or O(log N) lookup.
2.  **Portable**: Machine-independent (JSON).
3.  **Extensible**: Able to handle multi-file projects.

## The Solution: The D8 Debug Map

The D8 Debug Map is a JSON schema that acts as a pre-indexed cache of the assembly process. It transforms the linear listing into a file-centric hierarchy, making lookups fast and reliable.

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

By grouping segments by their original source file, the debug adapter can instantly resolve a Program Counter (PC) address to a specific line in a specific file. This eliminates the need for linear scanning and makes breakpoint resolution nearly instantaneous.

## The Concept of Confidence

One of the most innovative features of the D8 spec is the use of "Confidence Levels." Because the mapping between machine code and source is not always one-to-one (e.g., inlined data or multi-line directives), I introduced the `D8Confidence` type. This type allows the mapper to assign a level of certainty to each file entry:

A **High** confidence level means the address is explicitly mapped to a specific line of code. **Medium** indicates the mapper has guessed the line based on surrounding context. Finally, **Low** serves as a fallback match where the address falls within a file's range.

This allows the UI to remain helpful; by moving the instruction pointer to the closest "best guess" line, the debugger avoids failing when a precise match is missing.

## Pre-Indexing for Performance

Early versions of Debug80 parsed the `.lst` file on every launch, but for a project like *Caverns* with thousands of lines, this added a noticeable delay. With the D8 spec, the assembly process generates the `.d8.json` file. The adapter then simply performs a `JSON.parse()`. If the file is missing or stale compared to the listing, the adapter regenerates it automatically, ensuring the developer always has accurate mapping without a performance penalty.

## Conclusion

The D8 Mapping Specification is the glue that makes Debug80 feel like a modern tool. It handles the messy reality of assembly listings and provides a clean, fast interface for the VS Code editor. With our code mapped and our logic organised, it’s time to look at the next frontier: simulating real hardware. In the fifth article, I’ll explore the world of cycle-accurate timing and the TEC-1 hardware periphery.
