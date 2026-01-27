---
status: published
title: "Caching Debug Maps and Streamlining the Debugger Workflow"
summary: "Every debug session was recompiling ROM listings from scratch. I added a caching layer that writes D8 debug maps alongside the listing files, then merged the memory panel into the main platform panel and taught the extension to open sources automatically on launch."
tags:
  - debug80
  - tec1
  - tec1g
  - caching
  - ux
  - workflow
series: debug80diaries
---

# Caching Debug Maps and Streamlining the Debugger Workflow

By John Hardy

The ROM source debugging feature I added last week had a noticeable startup cost. Every time I launched a debug session, the adapter recompiled the listing files to build source maps. For a small ROM like MON-1B this took a fraction of a second. For MON-3 with its 16K of code, the delay was long enough to notice. The listing file had not changed, but the adapter did the same work every time.

The fix was to cache the compiled debug maps. When the adapter processes an extra listing, it now writes the resulting D8 debug map to a file next to the listing. On subsequent launches, it checks whether the cache is newer than the listing. If so, it loads the cached map directly and skips the compilation step.

## The Caching Logic

The adapter resolves the cache path by replacing the listing extension with `.d8dbg.json`:

```typescript
private resolveExtraDebugMapPath(listingPath: string): string {
  const dir = path.dirname(listingPath);
  const base = path.basename(listingPath, path.extname(listingPath));
  return path.join(dir, `${base}.d8dbg.json`);
}
```
@@Caption: Deriving the cache path from the listing path.

The staleness check compares modification times. If the listing file is newer than the cached map, the cache is stale and the adapter regenerates it:

```typescript
const mapPath = this.resolveExtraDebugMapPath(listingPath);
const mapStale = this.isDebugMapStale(mapPath, listingPath);

let debugMap =
  !mapStale && fs.existsSync(mapPath) ? this.loadDebugMap(mapPath) : undefined;
if (debugMap) {
  const mapping = buildMappingFromD8DebugMap(debugMap);
  combined.segments.push(...mapping.segments);
  combined.anchors.push(...mapping.anchors);
  continue;
}
```
@@Caption: Loading from cache when fresh, regenerating when stale.

When the adapter does regenerate a map, it writes it back to disk so the next session benefits from the cache. The Debug Console logs when regeneration happens, which helps diagnose unexpected slowdowns.

## Auto-Opening Sources on Launch

While working on the caching, I noticed another friction point. Every session started with me manually opening the ROM source files so I could set breakpoints. The debugger knew where these files were, but it left me to open them by hand.

I added two new launch configuration options:

```json
{
  "openRomSourcesOnLaunch": true,
  "openMainSourceOnLaunch": true
}
```
@@Caption: Launch config options for auto-opening sources.

When `openRomSourcesOnLaunch` is true, the extension queries the adapter for the list of ROM sources and opens each one in the editor. It prefers `.asm` source files over `.lst` listing files when both exist. When `openMainSourceOnLaunch` is true, the extension opens the primary source file specified in the debug configuration.

The implementation waits for the session to stabilize before opening files. This avoids a race condition where the adapter has not yet resolved the source paths. If the first attempt fails, the extension retries with increasing delays until the sources become available or a timeout expires.

## Controlling Editor Layout

With sources and panels opening automatically, I needed control over where they appeared. VS Code organizes editors into columns, and I wanted sources on the left and platform panels on the right. Two more launch options handle this:

```json
{
  "sourceColumn": 1,
  "panelColumn": 2
}
```
@@Caption: Placing sources in column 1, panels in column 2.

The extension tracks these preferences per session. When it opens a source file or reveals a panel, it uses the configured column. This keeps the layout consistent even when VS Code tries to open files in unexpected places.

## Merging the Memory Panel

The TEC-1 and TEC-1G platforms each had two separate webview panels: a main UI panel showing the display and keypad, and a memory panel showing hex dumps. Switching between them required separate commands, and they competed for screen space.

I merged the memory panel into the main panel as a tab. The panel now has two tabs at the top: "TEC-1" for the hardware UI and "MEMORY" for the hex dump. Clicking a tab switches the view without opening a new panel.

The memory view retains all its features: four configurable pointer views (PC, SP, HL, DE by default), symbol lookup, and auto-refresh during stepping. The tab state persists across panel visibility changes, so switching away and back preserves your selection.

This consolidation removed two separate panel controllers and their associated state management. The code is simpler and the user experience is cleaner. One panel, two views.

## The Result

A typical debug session now starts like this:

1. I press F5 to launch.
2. The adapter loads cached debug maps instantly.
3. The extension opens the main source and ROM sources in column 1.
4. The platform panel appears in column 2 with the TEC-1 UI visible.
5. The debugger stops on entry, ready for me to step.

The delay from press to ready dropped from several seconds to under a second. The editor layout is correct from the start. The memory view is one click away instead of requiring a separate command.

These are small changes individually, but together they remove the repetitive setup work that interrupted every session. The debugger now gets out of the way and lets me focus on the code.
