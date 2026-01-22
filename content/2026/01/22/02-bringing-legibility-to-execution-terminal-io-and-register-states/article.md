---
status: published
title: "Bringing Legibility to Execution: Terminal I/O and Register States"
summary: "Debugging is the process of making the invisible visible. This article examines how Debug80 implements terminal interaction and rich register visibility to provide a legible state of the Z80 machine."
tags:
  - debug80
  - z80
  - terminal
  - io
  - registers
series: debug80diaries
---

# Bringing Legibility to Execution: Terminal I/O and Register States

A debugger that only tracks memory addresses and hex codes is an exercise in mental overhead. To be truly useful, a debugging environment must provide a legible, high-level view of the machine’s state and a way to interact with its execution. In the second phase of Debug80’s development, I focused on two critical visibility features: rich register formatting and an integrated terminal I/O system.

## The I/O Handler Interface

At the core of Debug80’s hardware abstraction is the `IoHandlers` interface. This interface allows the VS Code debug adapter to intercept Z80 `IN` and `OUT` instructions and route them to modern UI components, such as the VS Code Terminal panel.

```typescript
// From src/z80/runtime.ts
export interface IoHandlers {
  read?: (port: number) => number;
  write?: (port: number, value: number) => void;
  tick?: () => TickResult | void;
}
```

By providing custom handlers to the `Z80Runtime`, we can emulate a serial port or a simple terminal by simply mapping specific ports to the debug session's state. When the Z80 emulator encounters an `OUT (P), A` instruction, it triggers the registered `write` handler. In the case of the "Simple" platform, the handler redirects this write to the VS Code terminal through a DAP `OutputEvent`.

```typescript
// Conceptual implementation in adapter.ts
const ioHandlers: IoHandlers = {
  write: (port, value) => {
    if (port === terminalTxPort) {
      const char = String.fromCharCode(value);
      this.sendEvent(new OutputEvent(char, 'stdout'));
    }
  },
  read: (port) => {
    if (port === terminalRxPort) {
      return this.terminalState.input.shift() ?? 0;
    }
    return 0xff;
  }
};
```

This simple mapping turns the abstract `OUT` instruction into a real-time character on the screen, allowing users to see "Hello World" or debug logs directly in the VS Code environment.

The Z80 has a unique register set. It features shadow registers like `AF'` and `HL'` alongside index registers such as `IX`. Seeing these in a raw hex block is tedious. I wanted the VS Code Variables view to feel like a purpose-built Z80 dashboard. To achieve this, I implemented a heavy formatting layer in the `variablesRequest` handler. This layer converts the numeric register values into formatted hex strings. It also expands the flag byte into its individual named bits, such as S, Z, and C.

```typescript
// From src/debug/adapter.ts
const flagsStr = (f: Flags) => {
  const letters = [['S', 's'], ['Z', 'z'], ['H', 'h'], ...];
  return letters.map(([k, ch]) => (f[k] ? ch.toUpperCase() : ch)).join('');
};

response.body = {
  variables: [
    { name: 'Flags', value: flagsStr(regs.flags) },
    { name: 'PC', value: `0x${regs.pc.toString(16).padStart(4, '0')}` },
    // ...
  ]
};
```

By displaying flags like `szhPNC`, the developer can instantly see that the Sign and Parity/Overflow flags are set while the Carry flag is clear. This high-density information is essential for reasoning about the complex branching logic common in Z80 assembly.

## The "Terminal Break"

Interaction isn't just about I/O; it's about control. I implemented a "Terminal Break" feature using custom DAP requests. When a user presses a specific key combination in the terminal, the adapter can signal the Z80 runtime to halt, effectively providing a "Pause" button that is sensitive to the user's interaction point.

## Conclusion

By making the Z80’s state legible and its I/O interactive, Debug80 moved from being a simple emulator to a functional development tool. However, even with great visibility, writing assembly remains a challenge of organisation. In the next article, I’ll detail the "Caverns Saga"—a journey into organising complex assembly logic through data tables and declarative rules.
