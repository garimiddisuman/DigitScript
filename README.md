# DigitScript

A minimalist programming language where everything is a number.

## Overview

DigitScript is an educational programming language that uses only numeric commands to manipulate memory locations. Perfect for understanding low-level computing concepts through a simple, elegant syntax.

## Features

- **Pure Numeric Syntax**: All commands and operations use only numbers
- **Memory-Based Architecture**: 1000 memory locations (1-1000) for data storage
- **Interactive CLI**: Navigate through program execution step-by-step
- **Time Travel Debugging**: Step forward/backward through execution
- **Visual Memory Display**: See memory state changes in real-time

## Quick Start

```bash
# Install dependencies
npm install

# Run DigitScript REPL
npm start

# Run a DigitScript file
npm start -- main.ts
```

## Example Program

```
3 6 10 20 0 1 3 4 5 9
```

This program:

1. Loads values into memory locations 1-10
2. Adds memory[3] (10) and memory[4] (20)
3. Stores result (30) in memory[5]
4. Halts

## Command Reference

| Command | Format    | Description                                        |
| ------- | --------- | -------------------------------------------------- |
| 1       | `1 a b c` | Add: mem[c] = mem[a] + mem[b]                      |
| 2       | `2 a b c` | Subtract: mem[c] = mem[a] - mem[b]                 |
| 3       | `3 a`     | Jump: go to memory location a                      |
| 4       | `4 a b c` | JumpIfEqual: if mem[a] == mem[b], jump to mem[c]   |
| 5       | `5 a b c` | JumpIfLessThan: if mem[a] < mem[b], jump to mem[c] |
| 7       | `7 a b`   | Move: mem[b] = mem[a]                              |
| 9       | `9`       | Halt: stop execution                               |

## Tech Stack

- **TypeScript**: Type-safe language implementation
- **Node.js**: Runtime environment
- **React + Ink**: Terminal UI framework
- **MVC Architecture**: Clean separation of concerns

## Documentation

- [Instruction Manual](./INSTRUCTIONS.md) - Complete language reference
- [Implementation Guide](./IMPLEMENTATION.md) - Technical architecture details

## License

MIT
