---
status: published
title: "The Caverns Saga: Organising Complex Assembly"
summary: "Writing a small assembly routine is manageable. Writing a 2,000-line textual adventure game is a different challenge entirely. This article explores how I organised the Caverns 80 project using modular architecture and declarative rule engines."
tags:
  - debug80
  - z80
  - assembly
  - game-development
  - architecture
series: debug80diaries
---

# The Caverns Saga: Organising Complex Assembly

While building the Debug80 environment, I needed a non-trivial project to test its limits. I chose to port an old adventure game to Z80 assembly: *Caverns*. What started as a simple exercise quickly became a lesson in assembly project management. As the codebase grew past 2,000 lines, the "standard" approach of monolithic files and hardcoded logic became unscalable. I had to rethink the architecture, moving toward a modular, data-driven system.

## Modular Architecture: The "Great Unbundling"

The first step was breaking the project into logical components. In Z80 assembly, without a high-level linker, this means careful use of `INCLUDE` directives and symbolic constants. Each file would have a clear, single responsibility, making the codebase easier to navigate and maintain.

- **main.asm**: The entry point and primary game loop.
- **game.asm**: This file contains the high-level command handlers, such as look, get, drop, and attack.
- **tables.asm**: The declarative heart of the game—movement grids and object locations.
- **strings.asm**: A central repository for all textual data, preventing string duplication in the logic.

## The Declarative Rule Engine

Instead of writing complex `if/else` logic for every room, I moved the world logic into data tables. This "rule engine" approach allowed me to define the entire map in a single, compact table.

```asm
; From src/tables.asm
movementTable:
    ; Room 1: Forest Clearing (North, South, West, East)
    DB roomForestClearing, 0, 0, 0
    ; Room 2: Dark Forest
    DB 0, 0, roomDarkForest, roomCloverField
    ; ...
```

The movement logic then becomes a generic lookup. The system takes the current room ID and finds its row in the table. It then jumps to the ID listed in the column corresponding to the player's direction. This approach eliminated hundreds of lines of conditional branching and made the game world trivially easy to modify or expand.

## Orderless Input Scanning

One of the most modern-feeling features of the port is the input parser. Traditional Z80 parsers are often rigid, expecting "VERB NOUN" in exactly that order. In Caverns, I implemented an orderless token scanner. The scanner pads the input with spaces and then searches for matches against a `verbTokenTable` and `nounTokenTable`.

```asm
; From src/game.asm
scanInputTokens:
    ; ...
    ; Scan verbs (first match wins)
    LD IX, verbTokenTable
    LD B, verbTokenCount
sv_loop:
    LD E, (IX+0)
    LD D, (IX+1)        ; DE = token ptr
    LD HL, inputBuffer  ; HL = input string
    CALL containsTokenCI
    JR Z, sv_hit
    ; ...
```

By searching for patterns like " GET " or " TAKE ", the engine doesn't care if the user types "GET THE LAMP" or "LAMP GET". This flexibility makes the game feel far more intuitive than a typical 8-bit title.

## Dynamic Exit Patching

Static tables are great for fixed geometry, but adventure games need changing worlds. I implemented a `dynamicExitPatchTable` that allows the game state to modify the `movementTable` at runtime.

```asm
; From src/tables.asm
dynamicExitPatchTable:
    DB roomBridgeNorthAnchor, dirSouth
    DW bridgeCondition  ; Variable holding the runtime destination
```

When the player lowers a bridge, the game updates the `bridgeCondition` variable. A periodic system routine reads this table and "patches" the movement logic, seamlessly opening a new path for the player.

## Conclusion

The Caverns port proved that complex software on the Z80 is a matter of data organization. I treated the processor as an executor for data-driven rules rather than a bucket for branching logic. This kept the project manageable and bug-free.

Next, we’ll see how I solved the ultimate "legibility" problem: mapping these complex assembly files back to the debugger's source view through the D8 Mapping Specification.
