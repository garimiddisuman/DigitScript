# DigitScript Interpreter

A terminal-based interpreter for the DigitScript programming language.

## Installation

```bash
npm install
```

## Running the Interpreter

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## Usage

### Keyboard Controls

- `e` - Edit/Enter program input mode
- `c` - Clear program
- `s` - Step (execute one instruction)
- `Enter` - Run (execute until halt)
- `u` - Undo last step
- `r` - Reset to start
- `q` - Quit

### Example Program

```
7 10 20 9
```

This program:

1. Moves value from memory location 10 to location 20
2. Halts

### Memory Display

- **Green bold (▶)** - Current instruction (opcode)
- **Cyan (·)** - Operands for current instruction
- Gray - Other memory locations

## Running Tests

```bash
npm test
```

## Building

```bash
npm run build
```

## Language Reference

See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for complete language documentation.
