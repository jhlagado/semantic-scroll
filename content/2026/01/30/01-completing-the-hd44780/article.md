---
status: published
title: "Completing the HD44780 LCD Simulation"
summary: "The TEC-1G includes an HD44780-compatible LCD display. Debug80 needed to simulate it accurately. I finished implementing the remaining controller features: entry mode plus display control plus cursor behaviour plus shift behaviour plus custom character RAM."
tags:
  - debug80
  - tec1g
  - hd44780
  - lcd
  - emulation
  - hardware
series: debug80diaries
---

# Completing the HD44780 LCD Simulation

By John Hardy

The TEC-1G uses an HD44780-compatible LCD display that shows sixteen characters on each of its two rows. When I started the Debug80 project I implemented only enough of the controller to get text on the screen. That meant writing characters to DDRAM plus reading the busy flag. The display would show characters where the program wrote them but cursor movement was wrong while shifting did not work while custom characters were missing entirely. The incomplete simulation meant I could not debug LCD-related code effectively because the display behaved differently from the real hardware. I set out to fill in the gaps then make the simulation accurate enough to trust.

## Entry Mode Plus Cursor Movement

The entry mode register controls what happens after each character write. The HD44780 supports two behaviours depending on the increment/decrement bit plus the shift flag. After writing a character the address counter either increments or decrements. The display optionally shifts in the opposite direction. The implementation stores the entry mode bits then applies them after each DDRAM write. If the mode is increment with shift then writing a character advances the cursor then shifts the entire display left. This creates a scrolling effect where new text pushes old text off the screen. The challenge came in handling the wrapping since the address counter wraps from the end of DDRAM back to the beginning. The display shift is cyclic so characters that shift off one side appear on the other. Getting those details right required reading the datasheet multiple times then comparing the simulation output to captured traces from real hardware.

## Display Control Plus Blink

The display control register determines whether the display is on or off while also determining whether the cursor is visible while also determining whether the cursor blinks. I implemented all three flags so the simulation matches the visual appearance of a real LCD. The cursor appears as an underline when visible. When the user enables blinking it alternates between visible plus invisible on a timer. The blink rate matches the datasheet specification because programs sometimes rely on the timing for visual feedback. The display-off state is distinct from clearing the display since the contents remain in DDRAM then reappear when the display turns back on. I had to track the display state separately from the memory contents. The panel rendering queries that state before drawing so it can show a blank screen when the display is off.

## Shift Commands

The shift commands move either the cursor or the entire display without affecting DDRAM contents. The HD44780 uses the same command byte for both operations with a single bit distinguishing them. Cursor left shifts the address counter down while display left shifts all the characters one position to the left. The shift amount is always one position since programs build larger shifts by issuing the command multiple times so the simulation just applies the shift each time it sees the command without trying to batch them. The display shift maintains the relationship between DDRAM addresses plus display positions. If I shift the display right the character that was at the left edge wraps to the right edge. The address counter still points to the same DDRAM location even though the visible content has moved.

## Custom Character RAM

The CGRAM feature lets programs define custom characters by writing pixel patterns to a dedicated memory region. Each custom character occupies eight bytes corresponding to the eight rows of pixels. Each byte holds five bits for the five columns. The HD44780 supports eight custom characters stored at CGRAM addresses zero through seven. Programs display them by writing character codes zero through seven to DDRAM so the simulation intercepts those codes then renders the custom pattern instead of looking up a font glyph. The panel drawing code reads the CGRAM contents then builds a pixel grid for each custom character. The grid uses the same scaling as the built-in font so custom characters blend in visually. This makes the simulation useful for programs that define custom icons or graphics.

## What This Enables

The completed LCD simulation means I can debug TEC-1G programs that use the display without worrying that the simulation will diverge from the hardware since scrolling text appears correctly while custom characters appear correctly while blink effects appear correctly. When a program fails to initialise the display properly the simulation shows the same wrong output the real hardware would show. This helps me identify initialisation bugs rather than blaming the simulation. The accuracy also builds confidence in the platform runtime because if the LCD simulation matches the rest of the peripheral simulation is more likely to be correct. That confidence lets me focus on my program instead of second-guessing the debugger.
