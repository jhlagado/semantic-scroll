---
title: "Atom 0.3.6: less guesswork"
status: published
summary: "Atom 0.3.6 reports clearer errors at the source lines that need fixing. Examples show missing names, values that do not fit and short jumps that cannot reach their destinations."
tags:
  - atom
  - z80
  - cpm
  - retrocomputing
---
# Atom 0.3.6: less guesswork

By John Hardy

I’ve been improving the error messages in [Atom](https://debug80.com/atom/), my Z80 assembler for CP/M and modern computers. The changes in version 0.3.6 make it easier to find out why your code won’t assemble and where to fix it.

If your program uses a constant called `PORTBASE` and you’ve forgotten to define it, Atom now reports:

```text
MAIN.ASM:2:11: undefined symbol PORTBASE
```

That gives you the file, line and column followed by the missing name. You can check the spelling or add the definition.

If you define `LIMIT` as 300 and try to store it in a single byte, the message is `value of LIMIT (300) is out of range for this operand`. A byte can only hold values from 0 to 255 so the message names the constant and the value that needs changing.

A short jump can only reach nearby code. Adding instructions between it and its destination can push that destination out of reach. Previously the error pointed at the destination label even though the jump was the instruction that needed fixing. Atom now reports the jump’s location, names its destination and gives the required distance. You can replace the short jump with a longer one or rearrange the code.

The messages use identical wording on CP/M and Node. On a modern computer editors can use the file, line and column format to open the source at the reported location.

Node listings also show the size of each routine and flag jumps close to their limit. They point out where a shorter jump could save a byte when you’re trying to fit a program into a small machine.

You can [try Atom in Triptych](https://jhlagado.github.io/triptych/?workspace=https%3A%2F%2Fjhlagado.github.io%2Fcpm-recipes%2Frecipes%2Fatom-starter.json&components=atom%2Cedit%2Cdemo&a=A1&b=B1), a CP/M machine that runs in your browser. The disk includes the assembler, an editor and an example program you can change and assemble.

[Atom Book 1](https://debug80.com/atom-book/book1/) now has an appendix listing every message and its usual cause. I want people to spend their time writing Z80 programs with less time spent deciphering the assembler’s errors.
