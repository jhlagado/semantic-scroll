# Debug80 Diaries: Article Planning Document

This document outlines a series of articles for the **debug80diaries** series, derived from the development activity in the debug80 repository between January 28 and February 2, 2026. Each entry reflects a coherent narrative around a development phase, feature, or architectural decision.

The series follows the established style: first-person technical diary entries that document real engineering decisions, include code samples where relevant, and explain not just what was built but why it was built that way.

---

## Selected Articles (Consolidated)

After reviewing the development activity, three strong narratives emerged. Two pairs of related topics have been consolidated into single articles with richer arcs.

---

### 1. Moving to the Sidebar: A Permanent Home for the Platform UI

**Target date:** 2026-01-29  
**Narrative focus:** The migration from ephemeral ViewPanels to a permanent sidebar view.

The platform UI (seven-segment displays, LCD, keypad simulation) used to open as an editor tab that competed with source files for space. Users who installed the extension had no visible entry point—they had to know the command palette incantation. This article documents the decision to move to a VS Code activity bar view container, giving Debug80 a permanent presence in the IDE.

The migration touched several architectural concerns: onboarding new users with a welcome view, preserving state when the sidebar is hidden (since `retainContextWhenHidden` is unavailable on View), and preventing stale updates from ended debug sessions through session-aware event routing. The result is a platform UI that feels integrated rather than bolted on.

**Key topics:**

- Why View instead of ViewPanel for permanent UI
- The welcome/onboarding flow and the `debug80.hasProject` context key
- The `uiRevision` counter pattern for handling visibility changes
- Session ID filtering to ignore events from ended sessions
- Multi-root workspace detection: any folder with `debug80.json` counts
- Routing all platform events through a single `PlatformViewProvider`

**Code samples:**

- The `package.json` contributions for activity bar and views
- The ViewProvider skeleton with session tracking
- Re-hydrating state on `onDidChangeVisibility`
- Event filtering by session ID

**Why this article:** The sidebar migration is the most user-visible change in this period. It transforms the extension from a hidden tool into an integrated part of the VS Code experience. The technical challenges—state preservation, session awareness, multi-root detection—make for a rich narrative.

---

### 2. Completing the HD44780: From Basic Commands to Custom Characters

**Target date:** 2026-01-30  
**Narrative focus:** Building a faithful HD44780 LCD simulation, from missing instructions to user-defined glyphs.

The earlier LCD simulation handled the basics—clear, home, DDRAM addressing, data writes—but real programs expect more. MON-3 uses entry mode and display control. User programs define custom characters in CGRAM. This article documents the journey from a partial simulation to a complete one, covering the full HD44780 instruction set and the custom character rendering pipeline.

The first half addresses the instruction set gaps: entry mode (increment vs decrement, display shift on write), display on/off control (the interplay of display, cursor, and blink flags), cursor/display shift (moving the window vs moving the cursor), and function set (stored but not enforced since the LCD2004 is fixed at 8-bit, 2-line). The second half adds CGRAM support: parsing the CGRAM address set instruction, routing writes to a 64-byte buffer, and rendering custom glyphs as 5×8 pixel grids in the webview.

**Key topics:**

- Entry mode set: `lcdEntryIncrement` and `lcdEntryShift` state variables
- Display on/off control: `lcdDisplayOn`, `lcdCursorOn`, `lcdCursorBlink`
- Cursor/display shift: `lcdDisplayShift` offset applied at render time
- Function set: why it is stored but ignored for LCD2004
- CGRAM address space: 8 characters × 8 bytes, codes 0x00–0x07
- Routing writes: detecting CGRAM vs DDRAM from the instruction
- Rendering custom characters in the webview font lookup

**Code samples:**

- The expanded LCD state interface
- Instruction parsing in `lcdWriteCommand`
- The `lcdCgram: Uint8Array(64)` buffer
- UI rendering: custom glyph lookup for character codes 0x00–0x07

**Why this article:** The HD44780 is ubiquitous in hobby hardware. Completing its simulation makes Debug80 useful for a wide range of programs. The progression from instruction gaps to CGRAM tells a satisfying story of increasing fidelity.

---

### 3. TEC-1G Hardware Fidelity: System Registers and Memory Banking

**Target date:** 2026-01-31  
**Narrative focus:** Completing the TEC-1G emulation by decoding every bit of the system registers and implementing expansion memory banking.

The TEC-1G has two key registers: the system latch at port 0xFF (SYS_CTRL) and the system input buffer at port 0x03 (SYS_INPUT). Early emulation handled only the core bits—shadow, protect, expand—but the schematic reveals eight bits in each register. This article documents the full decode and the closely related expansion banking feature.

The first half covers the registers. SYS_CTRL gains bank select (E_A14), caps lock, and reserved bits. SYS_INPUT gains shift key, raw key detection, GIMP, and the cartridge flag. A bug is fixed where bit 3 of SYS_INPUT was incorrectly mirroring the expand flag instead of indicating cartridge presence. The second half implements expansion banking: allocating a 32K buffer, routing memory access through a bank index controlled by E_A14, and respecting the CONFIG DIP switch default on reset.

**Key topics:**

- Reading the TEC-1G schematic (v1.21) to identify bit assignments
- SYS_CTRL full decode: shadow, protect, expand, bank select, caps, reserved
- SYS_INPUT full decode: shift key, protect, expand, cart, raw key, GIMP, KDA, RX
- The CART bug: why it is independent of EXPAND
- Expansion banking: 32K buffer, `bankA14` field, 16K window at 0x8000–0xBFFF
- Memory view bank awareness in the debug adapter
- CONFIG switch 3: setting the default bank on reset

**Code samples:**

- The expanded `Tec1gSysCtrlState` type with all 8 bits
- The corrected port 0x03 read handler
- Memory read/write routing through `tec1g-memory.ts`
- Bank switch handling in the port 0xFF write handler
- Unit tests: port 0x03 bits in isolation, bank switching round-trip

**Why this article:** This is the deepest dive into TEC-1G hardware fidelity. It demonstrates the methodology of schematic analysis, catches a real bug, and implements a feature (banking) that enables larger programs. The combination of register decode and memory banking forms a coherent narrative about making the emulation complete.

---

## Summary

| #   | Title                    | Date       | Theme                      |
| --- | ------------------------ | ---------- | -------------------------- |
| 1   | Moving to the Sidebar    | 2026-01-29 | UX and VS Code integration |
| 2   | Completing the HD44780   | 2026-01-30 | LCD simulation fidelity    |
| 3   | TEC-1G Hardware Fidelity | 2026-01-31 | Schematic-driven emulation |

**Deferred topics** (can become future articles):

- The Great Refactoring: adapter helper extraction and Vitest setup
- CI and Quality: GitHub Actions and coverage thresholds
- TEC-1G Emulation Review: the full audit document (could be a reference post)

---

## Series Continuity Notes

These articles follow existing entries in the debug80diaries series. The January 20–28 articles established:

- The motivation for returning to the Z80 (January 20)
- The TEC-1 platform configuration (January 20)
- Debug80 as a system (January 20)
- The DAP foundation and asm80 integration (January 22)
- Terminal I/O and register states (January 22)
- The Caverns saga and complex assembly organization (January 22)
- The D8 mapping specification (January 22)
- TEC-1 simulation and cycle-accurate timing (January 22)
- The great unbundling of the toolchain (January 22, January 23)
- The HD44780 LCD simulation (January 24)
- The TEC-1G platform introduction (January 27)
- ROM source-level debugging (January 27)
- Debug map caching and workflow streamlining (January 28)

The three selected articles continue this narrative arc: the sidebar migration improves the user experience, the HD44780 completion deepens simulation fidelity, and the TEC-1G hardware article demonstrates schematic-driven development.

---

## Article Structure Guidelines

Each article should follow the established format:

1. **Frontmatter:** status, title, summary (2–3 sentences), tags, series
2. **Title:** `# Title of the Article`
3. **Byline:** `By John Hardy`
4. **Opening paragraphs:** Set the context, explain what problem existed
5. **Technical sections:** Use `##` headings, include code samples with `@@Caption`
6. **Closing:** Reflect on what was achieved, hint at what comes next

Avoid AI-isms (see `authoring.md`). Write in first person. Explain why, not just what. Include concrete code when it clarifies the narrative.
