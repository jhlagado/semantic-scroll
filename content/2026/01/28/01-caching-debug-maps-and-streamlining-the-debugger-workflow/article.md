---
status: published
title: "Caching Debug Maps Plus Streamlining the Debugger Workflow"
summary: "Debug80 regenerated its debug maps on every session start even when the underlying source had not changed. I added content-hash based caching to skip redundant work then tackled two quality-of-life improvements: auto-opening source files plus consolidating the memory panel."
tags:
  - debug80
  - vscode
  - caching
  - performance
  - debugging
series: debug80diaries
---

# Caching Debug Maps Plus Streamlining the Debugger Workflow

By John Hardy

Every time I launched a debug session the adapter would parse all the listing files then build the debug map from scratch. For a small project that took a fraction of a second but as I added more ROM sources plus extraListings entries the startup time grew noticeable. The fix was straightforward since the listing files rarely change between sessions. If I could detect when the inputs matched their previous state I could skip the parsing then reuse the previous map. The mechanism I chose was content hashing because it handles the case where someone touches a file without modifying its contents.

## Content-Hash Based Caching

The caching system computes a SHA-256 hash of every input file at session start then concatenates those hashes in a deterministic order then hashes the concatenation to produce a cache key. If any input file changes the key changes then the cache misses. The adapter stores the serialized debug map alongside the cache key in a JSON file. The location defaults to the VS Code global storage directory so it persists across sessions without polluting the workspace though a configuration option allows overriding the path for users who want the cache in a project-specific location. On subsequent launches the adapter first checks whether the cache file exists then checks whether the stored key matches the computed key. If both conditions hold it deserializes the map then skips parsing entirely. This cuts startup time from seconds to milliseconds for projects with large ROM sources. Any source change automatically invalidates the cache so I never see stale data. The invalidation logic is conservative since even a whitespace change to a listing file triggers a rebuild.

## Watching Source Files for Changes

I also wanted the debugger to notice when I edit a source file during a session. The adapter now registers file watchers on all the listing plus source files it loads at session start. When a watcher fires the adapter clears the in-memory map for that file then triggers a rebuild. The rebuild is incremental since the adapter reparses only the affected file while the rest of the map remains intact which keeps the disruption minimal. The debugger continues running during the rebuild so I do not lose my place. This matters most when I am iterating on a bug in the ROM source because I can edit the listing file then save it then immediately see the updated source lines in the editor without restarting the session.

## Auto-Opening Source Files

A small but persistent annoyance was that starting a debug session required manually opening the source file before I could set breakpoints. I added an option called `openSourcesOnSessionStart` that takes a list of file patterns. When a session starts the adapter expands those patterns against the source map then opens matching files in the editor. The typical configuration opens the main program file plus any ROM sources I frequently debug. The files open in the background so they are ready when I need them but do not steal focus from the active editor. The patterns support globs so I can specify `*.asm` to open everything. I can specify `**/mon-3/**` to open only the MON-3 sources. The pattern matching uses the same library the rest of the codebase uses for path resolution which keeps behaviour consistent.

## Consolidating the Memory Panel

The memory panel started as two separate webviews because the TEC-1 plus TEC-1G platforms had different memory layouts. I wanted each to show only the relevant regions but maintaining two implementations doubled the work whenever I changed the panel styling. Adding a feature meant doing the work twice. I merged them into a single panel that queries the adapter for the platform's memory map at session start. The unified panel renders a list of regions where each region gets a collapsible section with a hex dump. The section header shows the region name alongside its address range which makes it easy to scan for the region I want. The adapter provides the memory map within the platform configuration so adding a new platform with a different layout does not require changing the panel code since the panel just iterates the regions it receives.

## What This Enables

The caching change makes launching a session feel instant. This matters because I often stop then restart sessions when I am exploring a bug then want to reset the CPU state. Waiting for the map to rebuild was interrupting my flow. The auto-open feature means the source is ready when I need it so I can set a breakpoint in the first few seconds without hunting for the file. The consolidated memory panel reduces maintenance burden while giving me a clearer view of the address space. These are small quality-of-life improvements but they compound over a long debugging session. The debugger now feels polished rather than rough like a tool I enjoy using rather than one I tolerate.
