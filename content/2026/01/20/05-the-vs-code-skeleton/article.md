---
status: published
title: "The VS Code Skeleton"
summary: "Building a debugger means implementing the Debug Adapter Protocol. For Debug80, we chose an inline implementation to keep the connection between the interface and the machine model as tight as possible."
tags:
  - debug80
  - vscode
  - dap
  - typescript
  - architecture
series: debug80-diaries
thumbnail: assets/tec1-blue-prototype.jpg
---

# The VS Code Skeleton

A debugger in VS Code lives in two distinct worlds. One world encompasses the user interface where developers interact with breakpoints and hover over variables. The other world houses the execution engine where bytes move through memory and registers undergo state changes. The Debug Adapter Protocol, or DAP, serves as the critical bridge between these two environments. For Debug80, building this connection started with a "skeleton"—a minimal implementation of the protocol that allowed VS Code to communicate with our Z80 runtime. This foundational layer established the basic dialogue needed to control execution from within the editor.

## The common language of DAP

The Debug Adapter Protocol provides a standardized way for editors to interact with debuggers. Instead of developers writing custom interfaces for every language or architecture, VS Code expects a debug adapter to handle a specific set of requests like `initialize` and `launch` along with `setBreakpoints`. This abstraction allows us to focus on Z80 specific logic while VS Code handles the heavy lifting of the graphical interface. When a user clicks the margin to set a breakpoint, VS Code sends a `setBreakpoints` request. Our adapter then translates that request into a machine address and instructs the engine to stop when it reaches that location.

## Why we chose an Inline implementation

Debug adapters typically run as separate processes to provide stability, as a crash in the debugger will not take down the editor. However, Debug80 utilizes an "inline" implementation where the adapter runs directly inside the extension process. We chose this approach to simplify the communication between the debugger and our custom UI panels, such as the TEC-1 emulator view. Running inline eliminates the need for complex inter-process communication when synchronizing the machine state with the visual hardware representation. This tight integration ensures that the LED displays and speaker output remain perfectly in sync with the underlying code execution.

## Activation and the Resolution cycle

The lifecycle of a Debug80 session begins with activation. In the `package.json` manifest, we instruct VS Code to activate our extension whenever a user requests a `z80` debug type.

```json
"activationEvents": [
  "onDebugResolve:z80"
]
```

When a user initiates a session, VS Code triggers an initialization handshake. The adapter responds by describing its specific capabilities, such as support for stepping or variable inspection. Once this handshake completes, the environment remains ready to load the Z80 program and begin the execution cycle, bridging the final gap between the static JSON configuration and the live machine.

## The Z80DebugSession

The heart of the skeleton resides in the `Z80DebugSession` class. This component inherits from the standard `DebugSession` base and acts as a central coordinator for the entire system. It manages the runtime state while utilizing the mapping data we established in previous articles and routing commands directly to the CPU engine.

By implementing this backbone first, we created a stable platform for the more complex work that follows. With the skeleton in place, we could finally begin the technical task of simulating the Z80 heartbeat—the execution loop that truly brings the machine to life. This structural readiness allowed us to transition from protocol management to physical system simulation without revisiting our architectural assumptions.
