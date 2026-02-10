---
status: published
title: "Caching a Z80 Decoder"
summary: "The Z80 instruction decoder for Debug80 grew to 1,616 lines of switch statements and lookup tables. I split it into prefix-based modules and added WeakMap caching so that each unique instruction decodes only once. The cache key is the instruction bytes themselves. The hit rate in typical programs exceeds 95 percent."
tags:
  - debug80
  - z80
  - decoder
  - performance
  - caching
series: debug80diaries
---

# Caching a Z80 Decoder

By John Hardy

The Z80 has a baroque instruction encoding that requires careful handling. A single-byte opcode might decode to one instruction, or it might be a prefix indicating that the real opcode follows. The `CB` prefix introduces bit manipulation instructions. The `DD` and `FD` prefixes switch the operand register from `HL` to `IX` or `IY`. The `ED` prefix accesses extended instructions like block moves and I/O loops. Combinations like `DD CB` introduce indexed bit operations with yet another encoding scheme. Every path through this maze needs code to handle it.

The Debug80 decoder started as a single file with nested switch statements. I added cases as I encountered instructions during testing. By the time I had reasonable Z80 coverage, the file had reached 1,616 lines. The primary opcode switch alone spanned hundreds of lines. The prefix handlers added hundreds more lines of their own. The file had become difficult to navigate and slower to load than I liked.

## The split

I reorganised the decoder into separate modules by prefix:

- `decode-primary.ts` handles unprefixed opcodes (the main instruction set)
- `decode-cb.ts` handles `CB`-prefixed bit operations
- `decode-dd.ts` handles `DD`-prefixed `IX` instructions
- `decode-fd.ts` handles `FD`-prefixed `IY` instructions
- `decode-ed.ts` handles `ED`-prefixed extended instructions
- `decode-ddcb.ts` handles the indexed bit operations (`DD CB` and `FD CB`)
- `decode-helpers.ts` contains shared utilities for operand formatting

Each module exports a single decoder function that takes the instruction bytes and returns a decoded result. The main decoder dispatches to the appropriate module based on the first byte. The structure mirrors the CPU's own decoding logic: check the prefix, then delegate.

The split made each module independently testable. I could verify `CB` instructions without loading the entire decoder. The file sizes dropped to a few hundred lines each, small enough to hold in working memory while editing. The organisation also made gaps visible in the implementation. When I noticed that `decode-ed.ts` was missing block I/O instructions, the absence stood out.

## The caching problem

A debugger decodes instructions constantly. Single-stepping through code means decoding the current instruction, then the next, then the next. Memory views decode ranges of bytes to show disassembly. Breakpoint displays decode the instruction at each breakpoint address. The same instructions decode repeatedly during a debugging session.

The Z80's instruction encoding is deterministic: the byte sequence `21 00 40` always decodes to `LD HL, 4000h` regardless of context. No mode switching changes the interpretation of bytes. No hidden state affects the decoding process. Once decoded, an instruction's representation remains constant forever. This determinism makes caching straightforward to implement.

## WeakMap as a cache

JavaScript's `WeakMap` provides a natural caching mechanism for object keys. I treat each instruction's byte sequence as a Uint8Array and use that array as the cache key. When decoding, the decoder first checks whether the byte sequence exists in the cache. If so, it returns the cached result immediately. If not, it decodes the instruction then stores the result then returns it.

```typescript
const cache = new WeakMap<Uint8Array, DecodedInstruction>();

function decode(bytes: Uint8Array): DecodedInstruction {
  let result = cache.get(bytes);
  if (result) {
    return result;
  }
  result = decodeInstruction(bytes);
  cache.set(bytes, result);
  return result;
}
```

The WeakMap holds references weakly so entries can be garbage-collected. When the byte array goes out of scope elsewhere, the cache entry becomes eligible for garbage collection. This prevents the cache from growing without bound during long debugging sessions. The cache stays proportional to the working set of instructions currently relevant rather than accumulating every instruction ever seen.

## Cache hit rates

I instrumented the decoder during typical debugging sessions to measure cache effectiveness. The hit rate depends on the program under test, but typical values exceed 95 percent. A tight loop like a delay routine might decode the same handful of instructions thousands of times. The decoder does the work once and serves the cached result for subsequent hits.

The miss rate spikes when scrolling through memory views because each scroll brings new addresses into view. Even then, returning to previously viewed regions hits the cache. The steady-state behaviour favours the cache heavily.

## Performance characteristics

The cache lookup is fast—a hash table probe and a reference comparison. The cache miss path runs the full decoder, which involves a switch dispatch and operand parsing. For multi-byte instructions with displacement values or immediate values, the parsing includes bounds checking alongside endianness conversion. The cached path skips all of that.

The memory overhead is proportional to the number of unique instructions in the cache. Each entry holds a Uint8Array key (typically 1 to 4 bytes) and a decoded result object (a few tens of bytes including the mnemonic string and operand descriptions). For a program with a few hundred unique instruction patterns, the cache consumes a few kilobytes. The memory cost is negligible compared to the time saved.

## Lessons from the refactor

Breaking the decoder into modules forced me to think about the instruction set systematically. The Z80's prefixing scheme, awkward as it sometimes feels, maps naturally onto a module-per-prefix structure. The code now reflects the architecture it decodes.

The caching emerged from profiling the decoder during real sessions. I noticed redundant decoding in the hot path and asked whether the work was necessary. The deterministic encoding made the answer obvious while the WeakMap made the implementation clean while the hit rate validated the approach.

The two changes—splitting and caching—happened in the same commit because they reinforced each other. The split made the decoder easier to reason about while the caching made it faster. Together, they transformed a sprawling file into a maintainable subsystem with measurable performance characteristics.

