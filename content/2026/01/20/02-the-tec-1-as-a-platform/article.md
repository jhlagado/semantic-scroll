---
status: published
title: "The TEC-1 as a Platform"
summary: "The TEC-1 defines a small but complete hardware platform. Its memory map, I/O model, and human interface provide a concrete starting point for Debug80’s platform system."
tags:
  - debug80
  - z80
  - tec1
  - platforms
  - hardware
series: debug80diaries
thumbnail: assets/tec1-blue-prototype.jpg
---

# The TEC-1 as a Platform

In Debug80, the term *platform* carries a specific structural meaning. A platform acts as a machine description that models the memory and I/O devices alongside specific hardware behaviour. This model defines exactly how software runs on a particular system. Because the debugger remains largely platform-agnostic, adding support for a new machine simply requires a corresponding platform module. The TEC-1 serves as the first full implementation in this system because its small, bounded nature makes it a perfect starting point for development.

![The TEC-1 Blue Prototype](./assets/tec1-blue-prototype.jpg "The TEC-1 blue prototype: a bridge between 1983 and the modern debugger.")

## A bounded machine

The original TEC-1 hardware utilizes a fixed and minimal memory layout. The ROM resides at `0000–07FF` hex, while the RAM occupies the `0800–0FFF` hex range. No operating system or file system exists to abstract this space. Instead, the program code and data share the same limited RAM alongside the stack and display logic. This constraint encourages developers to write compact programs and maintain a disciplined approach to address management.

For the Debug80 environment, this simplicity ensures that memory behaves as a concrete rather than abstract resource. The debugger presents the entire address space directly to the user. Every change to a memory location carries immediate meaning because no background activity or hidden consumers compete for the system state.

## I/O as the system boundary

All interaction with the outside world passes through a small number of Z80 I/O ports. Port 0 handles input by reading the 20-key hexadecimal keypad. The system also uses the higher bits of this port for bit-banged serial input. While key presses can trigger a non-maskable interrupt for immediate response, many programs rely on polling to keep control flow explicit and predictable.

Output functions concentrate on Ports 1 and 2. Port 1 selects the active display digit and controls additional components such as the speaker and bit-banged serial output. Port 2 drives the seven-segment display data and the decimal point. Because the hardware requires software-based multiplexing, the scanning loop remains a visible component of program execution with observable timing consequences. From a platform perspective, display output represents a core behaviour that Debug80 must model with absolute accuracy.

## The keypad as a control surface

The TEC-1 keypad defines the physical interface and how a developer uses the machine. It includes hexadecimal keys from `0` to `F` for data entry, alongside specialized function keys. The `AD` key toggles between address and data modes, while `GO` initiates execution from the current address. Users increment or decrement addresses using the `+` and `-` keys. A dedicated hardware **RESET** key returns the system to its initial state.

Programming on this platform remains an iterative and physical process. A developer selects addresses and enters bytes before starting execution and observing the results on the segmented display. While the monitor software supports this workflow, the programmer maintains the essential mental model. Debug80 informs its own execution control via this interaction style, even when software views replace the physical keypad and display.

## Platform modules in Debug80

Debug80 models each machine as a distinct platform module that defines the memory layout and I/O port behaviour while specifying attached devices and timing assumptions. The TEC-1 module includes full software emulation of the hardware. This covers keypad scanning and display multiplexing alongside speaker output and bit-banged serial communication. Every instruction executes entirely within this precise emulated environment.

Alongside the TEC-1, the project maintains a minimal **simple** platform. This intentionally stripped-down Z80 system provides only serial input and output. It serves as a baseline and a development aid that allows for the exercise of debugger features without the overhead of device complexity. By testing against this simple model, I can ensure the core debugger logic remains sound before moving to more complex hardware.

## Incremental expansion

The current platform model enables support for other classic Z80 machines as the project evolves. Some platforms attract interest because of their excellent hardware documentation. In other cases, developers can adapt existing software emulation for debugger use. Each addition brings both opportunity and technical cost that requires careful examination.

Hardware behaviour requires deep understanding, and every device requires a thorough model to ensure accuracy. Furthermore, I must evaluate the assumptions present in existing emulation code before integration. For these reasons, Debug80 expands its platform support deliberately and incrementally. The TEC-1 establishes the baseline for this growth: a small, complete machine where the developer can account for every single interaction.
