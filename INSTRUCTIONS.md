# DigitScript Language Manual

## Introduction

DigitScript is a programming language where **everything is a number**. There are no keywords, no variable names, no strings—just numbers that manipulate other numbers in memory.

## Memory Model

DigitScript provides 1000 memory locations, numbered from **1 to 1000**. Each location can store a single integer value (positive, negative, or zero).

**Initial State:**

- All memory locations start with value `0`
- Programs load numbers sequentially starting from memory location 1

## Program Structure

A DigitScript program is a sequence of numbers separated by spaces or newlines. The interpreter loads these numbers into memory starting from location 1, then begins execution from location 1.

### Example

```
3 6 10 20 0 1 3 4 5 9
```

**Memory after loading:**

```
mem[1] = 3
mem[2] = 6
mem[3] = 10
mem[4] = 20
mem[5] = 0
mem[6] = 1
mem[7] = 3
mem[8] = 4
mem[9] = 5
mem[10] = 9
```

## Command Reference

### 1. Add Command

**Format:** `1 a b c`

Adds the values at memory locations `a` and `b`, stores the result in memory location `c`.

**Example:**

```
1 3 4 5
```

If mem[3] = 10 and mem[4] = 20, then mem[5] = 30

---

### 2. Subtract Command

**Format:** `2 a b c`

Subtracts the value at memory location `b` from the value at memory location `a`, stores the result in memory location `c`.

**Example:**

```
2 5 6 7
```

If mem[5] = 50 and mem[6] = 20, then mem[7] = 30

---

### 3. Jump Command

**Format:** `3 a`

Jumps to the memory location specified by `a`. Execution continues from that location.

**Example:**

```
3 10
```

Jumps to memory location 10 and continues execution from there.

---

### 4. Jump If Equal Command

**Format:** `4 a b c`

If the value at memory location `a` equals the value at memory location `b`, jump to memory location `c`. Otherwise, continue to the next command.

**Example:**

```
4 5 6 10
```

If mem[5] == mem[6], jump to memory location 10

---

### 5. Jump If Less Than Command

**Format:** `5 a b c`

If the value at memory location `a` is less than the value at memory location `b`, jump to memory location `c`. Otherwise, continue to the next command.

**Example:**

```
5 6 7 15
```

If mem[6] < mem[7], jump to memory location 15

---

### 7. Move Command

**Format:** `7 a b`

Copies the value from memory location `a` to memory location `b`.

**Example:**

```
7 5 10
```

mem[10] = mem[5]

---

### 9. Halt Command

**Format:** `9`

Stops program execution immediately.

**Example:**

```
9
```

## Program Execution

1. **Loading Phase**: All numbers from your program are loaded sequentially into memory starting at location 1
2. **Execution Phase**: The interpreter starts reading from memory location 1 and executes commands
3. **Command Reading**: Each command reads its opcode and required operands from consecutive memory locations
4. **Increment**: After executing a command, the program counter advances by the number of values read (1-4 depending on the command)

## Example Programs

### Example 1: Simple Addition

```
1 6 7 8 9 100 200 0
```

**Breakdown:**

- mem[1] = 1 (Add command)
- mem[2] = 6 (operand a)
- mem[3] = 7 (operand b)
- mem[4] = 8 (operand c - result location)
- mem[5] = 9 (Halt command)
- mem[6] = 100 (first number to add)
- mem[7] = 200 (second number to add)
- mem[8] = 0 (result will be stored here)

**Execution:**

1. Read command at mem[1]: `1 6 7 8` → Add mem[6] and mem[7], store in mem[8]
2. mem[8] now contains 300
3. Read command at mem[5]: `9` → Halt

**Result:** mem[8] = 300

---

### Example 2: Conditional Jump

```
4 5 6 8 9 10 10 3 1
```

**Breakdown:**

- mem[1-4]: `4 5 6 8` (JumpIfEqual command)
- mem[5] = 9 (Halt)
- mem[6] = 10 (first comparison value)
- mem[7] = 10 (second comparison value)
- mem[8] = 3 (jump destination)
- mem[9] = 1 (value at jump destination)

**Execution:**

1. Read mem[1]: `4 5 6 8` → Compare mem[5] with mem[6]
2. mem[5] = 9, mem[6] = 10 → Not equal
3. Continue to mem[5]: `9` → Halt

**Result:** Program halts at mem[5]

---

### Example 3: Loop Counter

```
1 10 11 10 5 10 12 1 2 10 13 10 9 5 1 20
```

This program implements a simple counter that increments mem[10] until it reaches 20.

## Interactive Mode Navigation

DigitScript provides time-travel debugging controls:

- **Step Forward**: Execute the next single command
- **Step Backward**: Undo the last executed command
- **Run All**: Execute the entire program until halt
- **Reset**: Reset program to initial state

## Error Handling

DigitScript will halt with an error if:

- Memory location is out of bounds (< 1 or > 1000)
- Invalid command opcode is encountered
- Jump destination is invalid
- Program counter goes out of bounds

## Tips for Writing DigitScript

1. **Plan Your Memory Layout**: Decide which memory locations store code vs. data
2. **Use High Memory for Data**: Store variables in high-numbered locations (e.g., 900-1000) to avoid code/data overlap
3. **Track Your Program Counter**: Remember each command advances the counter by its size
4. **Comment with Memory Maps**: Document your memory layout separately

## Advanced Patterns

### Subroutines

Use Jump commands to implement subroutine calls (manual stack management required).

### Loops

Combine conditional jumps with counters to create loops.

### Indirect Addressing

Store memory addresses in variables and use them as operands.

---

**Happy coding with DigitScript!** 🔢
