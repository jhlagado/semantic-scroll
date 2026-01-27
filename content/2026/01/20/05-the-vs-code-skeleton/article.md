---
status: published
title: "The VS Code Skeleton"
summary: "Building a debugger means implementing the Debug Adapter Protocol. For Debug80, I chose an inline implementation to keep the connection between the interface and the machine model as tight as possible."
tags:
  - debug80
  - vscode
  - dap
  - typescript
  - architecture
series: debug80diaries
thumbnail: assets/tec1-blue-prototype.jpg
---

# The VS Code Skeleton

A debugger in VS Code lives in two distinct worlds. One world is the user interface, and the other houses the execution engine. The Debug Adapter Protocol (DAP) serves as the critical bridge between these two environments. For Debug80, building this connection started with a "skeleton"—a minimal implementation of the protocol that allowed VS Code to communicate with my Z80 runtime. This foundational layer established the basic dialogue needed to control execution from within the editor.

## The common language of DAP

The Debug Adapter Protocol provides a standardized way for editors to interact with debuggers. Instead of developers writing custom interfaces for every language, VS Code requires a debug adapter to handle a small set of requests so the editor can control execution. This abstraction allows me to focus on Z80 specific logic while VS Code handles the heavy lifting of the graphical interface. When a user clicks the margin to set a breakpoint, VS Code sends a `setBreakpoints` request. My adapter translates that request into a machine address. The engine stops when it reaches that location.

## Why I chose an Inline implementation

Debug adapters typically run as separate processes to provide stability, as a crash in the debugger will not take down the editor. However, Debug80 utilizes an "inline" implementation where the adapter runs directly inside the extension process. I chose this approach to simplify communication with my custom UI panels. Running inline avoids the need for complex inter-process communication when synchronizing the machine state with the visual hardware representation. This tight integration keeps the TEC-1 display in sync with the underlying code execution.

## Activation and the Resolution cycle

The lifecycle of a Debug80 session begins with activation. In the `package.json` manifest, I instruct VS Code to activate my extension whenever a user requests a `z80` debug type.

```json
"activationEvents": [
  "onDebugResolve:z80"
]
```

When a user initiates a session, VS Code triggers an initialization handshake. The adapter responds with a capabilities description so VS Code can drive the session. Once this handshake completes, the environment is ready to load the Z80 program. The execution cycle then bridges the final gap between the static JSON configuration and the live machine.

## The Z80DebugSession

The heart of the skeleton resides in the `Z80DebugSession` class. This component inherits from the standard `DebugSession` base and acts as a central coordinator for the entire system. It manages the runtime state by using the mapping data I established in previous articles to route commands directly to the CPU engine.

By implementing this backbone first, I created a stable platform for the more complex work that follows. With the skeleton in place, I could finally begin the technical task of simulating the Z80 heartbeat—the execution loop that truly brings the machine to life.

This structural readiness allowed me to transition from protocol management to physical system simulation without revisiting my architectural assumptions.
