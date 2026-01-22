---
status: published
title: "Constructing the Core: Foundations of a Z80 Debugger"
summary: "The first step in building Debug80 was establishing a stable bridge between the VS Code Debug Adapter Protocol and the Z80 execution environment. This article explores the initial DAP implementation and the integration of the asm80 assembler."
tags:
  - debug80
  - z80
  - vs-code
  - dap
  - assemblers
series: debug80diaries
---

# Constructing the Core: Foundations of a Z80 Debugger

Building a debugger for a legacy architecture like the Z80 within a modern environment like VS Code requires more than just an emulator. It requires a stable, high-level interface that can translate abstract debugging commands into concrete machine actions. This article documents the foundational phase of the Debug80 project. I focused on the Debug Adapter Protocol (DAP). After that, I integrated the `asm80` assembler into a unified workflow.

## The Debug Adapter Protocol (DAP)

The Debug Adapter Protocol is the standard that allows VS Code to communicate with different debuggers. By implementing this protocol, Debug80 can use the full suite of VS Code’s debugging UI without needing to build a custom frontend. That contract brings core UI features without extra work. The heart of this implementation is the `Z80DebugSession` class, which extends the standard `DebugSession` base class to handle requests and manage the Z80 runtime lifecycle.

```typescript
export class Z80DebugSession extends DebugSession {
  private runtime: Z80Runtime | undefined;
  // ... other state

  protected async handleLaunchRequest(
    response: DebugProtocol.LaunchResponse,
    args: LaunchRequestArguments
  ): Promise<void> {
    // Initializing the session
    this.runtime = undefined;
    this.breakpoints.clear();
    
    // Establishing the workflow...
  }
}
```

The `launchRequest` is the entry point for any session. It parses the user's configuration and uses that to locate the binary artifacts before bringing the Z80 runtime online. This is the moment when a static configuration turns into a live debugging session.

## Closing the Loop: Integrating asm80

A significant hurdle in early Z80 development was the "disconnected loop." Developers would typically assemble their code in a standalone terminal. They would check the output for errors, then manually load the resulting HEX file into a separate debugger. I wanted Debug80 to provide a contemporary "F5" experience, where pressing a single key would build and debug the project seamlessly. This meant the debugger had to be aware of the source code and capable of running the assembler itself before starting the session.

I chose `asm80` for its reliability and modern JavaScript-based implementation, which fits naturally into a VS Code extension. The integration ensures that every time a debug session starts, the code is fresh and the mapping information remains accurate. It removes the manual step that used to drift out of sync.

```typescript
// From src/debug/adapter.ts
protected assembleIfRequested(
  merged: LaunchRequestArguments,
  asmPath: string | undefined,
  hexPath: string,
  listingPath: string,
  platform: string,
  simpleConfig?: SimplePlatformConfigNormalized
): void {
  if (merged.assemble === false || !asmPath) {
    return;
  }

  // Running asm80 as a child process
  const cmd = `npx asm80 ${asmPath} -o ${hexPath} -l ${listingPath}`;
  cp.execSync(cmd, { cwd: this.baseDir });
}
```

By automating this step, the debugger keeps the assembled artifacts in sync with the `.asm` source files. This synchronization is critical for the next stages of development, where source-level mapping keeps breakpoint placement accurate. That alignment is what makes stepping trustworthy.

## Configuration and Discovery

To make the system flexible, I implemented a configuration discovery mechanism. While users can provide explicit paths in their `launch.json`, the preferred method is a repository-level `debug80.json` file. This file defines the hardware layout, making the debug setup portable across different developer machines. It keeps project configuration readable and in one place.

```json
{
  "targets": {
    "app": {
      "sourceFile": "src/main.asm",
      "outputDir": "build",
      "artifactBase": "main",
      "platform": "simple"
    }
  }
}
```

When a session starts, `Z80DebugSession` looks for this file and merges its settings with the launch arguments. This allows for a minimal "zero-config" start for projects that follow a standard layout. I wanted new projects to start without a pile of boilerplate.

## Conclusion

Establishing this foundation mattered because it turned a pile of components into a single debugging pipeline. I now had a clean DAP implementation. The assembly loop was built-in and ready for daily use. The configuration system kept setup small and predictable. It transformed the Z80 from a black box into a controllable environment. In the next article, I will explore how I brought transparency to that environment through terminal I/O. I will also show how register state becomes visible in the same flow. Hardware abstraction then lets us map abstract instructions to real-world interface interactions.
