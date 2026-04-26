# DigitScript Implementation Guide

## Architecture Overview

DigitScript follows the **MVC (Model-View-Controller)** architecture pattern with a clear separation of concerns.

```
┌─────────────────────────────────────────────────┐
│                     View Layer                   │
│            (React + Ink Terminal UI)             │
│  ┌───────────┐  ┌──────────┐  ┌──────────────┐ │
│  │  Memory   │  │ Controls │  │  Execution   │ │
│  │  Display  │  │  Panel   │  │    Status    │ │
│  └───────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│                Controller Layer                  │
│         (Command Handlers & State Mgmt)          │
│  ┌────────────────┐    ┌──────────────────────┐│
│  │   UI Actions   │    │  Execution Control   ││
│  │   Handler      │    │     Handler          ││
│  └────────────────┘    └──────────────────────┘│
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│                  Model Layer                     │
│       (Core Language Implementation)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │  Memory  │  │ Executor │  │   Program    │ │
│  │  Manager │  │  Engine  │  │    Parser    │ │
│  └──────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────┘
```

## Project Structure

```
digitscript/
├── src/
│   ├── models/                    # Model Layer
│   │   ├── Memory.ts              # Memory management (1-1000 locations)
│   │   ├── Executor.ts            # Command execution engine
│   │   ├── Command.ts             # Command interface & implementations
│   │   ├── ProgramState.ts        # Program state & history
│   │   └── Parser.ts              # Program parser
│   │
│   ├── controllers/               # Controller Layer
│   │   ├── ProgramController.ts   # Main program control logic
│   │   ├── ExecutionController.ts # Step/run/undo control
│   │   └── InputController.ts     # User input handling
│   │
│   ├── views/                     # View Layer
│   │   ├── App.tsx                # Main React component
│   │   ├── MemoryView.tsx         # Memory display component
│   │   ├── ControlPanel.tsx       # Navigation controls
│   │   ├── StatusBar.tsx          # Execution status
│   │   └── InputView.tsx          # Program input interface
│   │
│   ├── commands/                  # Command Implementations
│   │   ├── AddCommand.ts          # Command 1: Add
│   │   ├── SubtractCommand.ts     # Command 2: Subtract
│   │   ├── JumpCommand.ts         # Command 3: Jump
│   │   ├── JumpIfEqualCommand.ts  # Command 4: Conditional Jump
│   │   ├── JumpIfLessThanCommand.ts # Command 5: Conditional Jump
│   │   ├── MoveCommand.ts         # Command 7: Move
│   │   └── HaltCommand.ts         # Command 9: Halt
│   │
│   ├── utils/                     # Utilities
│   │   ├── validators.ts          # Input validation
│   │   └── errors.ts              # Error definitions
│   │
│   └── index.tsx                  # Application entry point
│
├── tests/                         # Test suites
│   ├── models/
│   ├── controllers/
│   └── commands/
│
├── examples/                      # Example programs
│   ├── addition.ds
│   ├── loop.ds
│   └── fibonacci.ds
│
├── package.json
├── tsconfig.json
├── README.md
├── INSTRUCTIONS.md
└── IMPLEMENTATION.md
```

## Core Components

### 1. Model Layer

#### Memory.ts

```typescript
interface IMemory {
  read(location: number): number;
  write(location: number, value: number): void;
  reset(): void;
  getSnapshot(): number[];
  restoreSnapshot(snapshot: number[]): void;
}
```

**Responsibilities:**

- Manage 1000 memory locations (indices 1-1000)
- Validate memory access bounds
- Provide snapshot/restore for undo functionality
- Efficient memory operations

**Implementation Details:**

- Use TypedArray (Int32Array) for performance
- Implement bounds checking on all operations
- Support cloning for history tracking

---

#### Command.ts

```typescript
interface ICommand {
  readonly opcode: number;
  readonly operandCount: number;

  execute(memory: IMemory, operands: number[]): ExecutionResult;
  validate(operands: number[]): boolean;
}

interface ExecutionResult {
  success: boolean;
  newProgramCounter?: number; // For jump commands
  shouldHalt: boolean;
  error?: string;
}
```

**Responsibilities:**

- Define command interface
- Implement each command type (1, 2, 3, 4, 5, 7, 9)
- Validate operands before execution
- Return execution results with state changes

**Command Implementations:**

- Each command is a separate class implementing ICommand
- Factory pattern for command instantiation based on opcode
- Immutable design: commands don't modify state directly

---

#### Executor.ts

```typescript
interface IExecutor {
  step(): ExecutionResult; // Execute one command
  run(): ExecutionResult; // Execute until halt
  getCurrentCommand(): CommandInfo;
  getProgramCounter(): number;
}
```

**Responsibilities:**

- Maintain program counter
- Fetch commands from memory
- Invoke appropriate command handlers
- Track execution state (running, halted, error)

**Implementation Details:**

- Read opcode at current program counter
- Fetch required operands based on command type
- Advance program counter after execution
- Handle jumps by updating program counter directly

---

#### ProgramState.ts

```typescript
interface IProgramState {
  memory: IMemory;
  programCounter: number;
  executionHistory: ExecutionStep[];

  saveState(): StateSnapshot;
  restoreState(snapshot: StateSnapshot): void;
  canUndo(): boolean;
  canRedo(): boolean;
}

interface ExecutionStep {
  timestamp: number;
  programCounter: number;
  memorySnapshot: number[];
  commandExecuted: CommandInfo;
}
```

**Responsibilities:**

- Maintain execution history for undo/redo
- Provide state snapshots
- Track execution timeline

---

#### Parser.ts

```typescript
interface IParser {
  parse(input: string): number[];
  validate(program: number[]): ValidationResult;
}
```

**Responsibilities:**

- Parse space/newline-separated numbers
- Validate input format
- Convert to number array
- Report syntax errors

---

### 2. Controller Layer

#### ProgramController.ts

```typescript
class ProgramController {
  private state: IProgramState;
  private executor: IExecutor;
  private eventEmitter: EventEmitter;

  loadProgram(numbers: number[]): void;
  stepForward(): void;
  stepBackward(): void;
  runAll(): void;
  reset(): void;

  // Event emitters for view updates
  onStateChange(callback: (state: ProgramState) => void): void;
  onError(callback: (error: Error) => void): void;
}
```

**Responsibilities:**

- Coordinate between model and view
- Handle user actions (step, run, undo)
- Emit events for view updates
- Manage program lifecycle

---

#### ExecutionController.ts

```typescript
class ExecutionController {
  executeStep(): Promise<ExecutionResult>;
  executeAll(): Promise<ExecutionResult>;
  undo(): ExecutionResult;
  redo(): ExecutionResult;
}
```

**Responsibilities:**

- Control execution flow
- Manage execution speed (for animations)
- Handle async execution for UI responsiveness

---

### 3. View Layer (React + Ink)

#### App.tsx

```typescript
interface AppProps {}

function App(): JSX.Element {
  const [programState, setProgramState] = useState<ProgramState>();
  const [mode, setMode] = useState<'input' | 'execution'>('input');

  return (
    <Box flexDirection="column">
      <StatusBar state={programState} />
      {mode === 'input' ? (
        <InputView onSubmit={handleProgramLoad} />
      ) : (
        <>
          <MemoryView memory={programState.memory} />
          <ControlPanel onAction={handleControlAction} />
        </>
      )}
    </Box>
  );
}
```

---

#### MemoryView.tsx

```typescript
interface MemoryViewProps {
  memory: IMemory;
  highlightLocations?: number[];
  programCounter: number;
}

function MemoryView({
  memory,
  highlightLocations,
  programCounter,
}: MemoryViewProps): JSX.Element {
  // Display memory in grid format
  // Highlight current instruction
  // Show changed values
}
```

**Features:**

- Paginated memory display (show relevant sections)
- Highlight active memory locations
- Color-coded changed values
- Program counter indicator

---

#### ControlPanel.tsx

```typescript
interface ControlPanelProps {
  onStepForward: () => void;
  onStepBackward: () => void;
  onRunAll: () => void;
  onReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

function ControlPanel(props: ControlPanelProps): JSX.Element {
  // Render 4 buttons with keyboard shortcuts
  // Disable buttons based on state
}
```

**Controls:**

- `→` Step Forward (execute next command)
- `←` Step Backward (undo last command)
- `>>` Run All (execute to halt)
- `<<` Reset (restart program)

---

## Data Flow

### 1. Program Loading

```
User Input → Parser → Memory.load() → State.reset() → View Update
```

### 2. Step Forward Execution

```
User Action → Controller.stepForward() →
  Executor.step() → Command.execute() →
  Memory.write() → State.saveHistory() →
  EventEmitter.emit('stateChange') → View Update
```

### 3. Step Backward (Undo)

```
User Action → Controller.stepBackward() →
  State.popHistory() → State.restoreSnapshot() →
  EventEmitter.emit('stateChange') → View Update
```

### 4. Run All

```
User Action → Controller.runAll() →
  Loop: Executor.step() until halt/error →
  EventEmitter.emit('stateChange') (throttled) →
  View Update (animated)
```

## Implementation Phases

### Phase 1: Core Model (Week 1)

- [ ] Implement Memory class with bounds checking
- [ ] Create Command interface and base implementations
- [ ] Build Executor with program counter logic
- [ ] Implement Parser for input processing
- [ ] Write unit tests for all commands

### Phase 2: State Management (Week 1)

- [ ] Implement ProgramState with history tracking
- [ ] Create snapshot/restore mechanisms
- [ ] Add undo/redo functionality
- [ ] Test state transitions

### Phase 3: Controller Layer (Week 2)

- [ ] Build ProgramController with event system
- [ ] Implement ExecutionController with async support
- [ ] Add error handling and validation
- [ ] Create controller integration tests

### Phase 4: View Layer (Week 2-3)

- [ ] Set up Ink + TypeScript project structure
- [ ] Create MemoryView component with formatting
- [ ] Build ControlPanel with keyboard shortcuts
- [ ] Implement StatusBar and InputView
- [ ] Add syntax highlighting for numbers

### Phase 5: Integration & Polish (Week 3)

- [ ] Connect all layers
- [ ] Add execution speed control
- [ ] Implement memory view pagination
- [ ] Create example programs
- [ ] Write end-to-end tests
- [ ] Performance optimization

### Phase 6: Documentation & Distribution (Week 4)

- [ ] Complete API documentation
- [ ] Create tutorial videos/GIFs
- [ ] Package for npm distribution
- [ ] Set up CI/CD pipeline

## Key Design Decisions

### 1. Immutable State

- All state changes create new snapshots
- Enables efficient undo/redo
- Prevents accidental mutations

### 2. Event-Driven Architecture

- Controllers emit events for state changes
- Views subscribe to state changes
- Decouples layers effectively

### 3. Command Pattern

- Each operation is a command object
- Easy to add new commands
- Testable in isolation

### 4. History with Snapshots

- Full memory snapshots for each step
- Trade-off: memory usage for simplicity
- Optimization: delta compression for large programs

### 5. TypeScript Strict Mode

- Null safety
- Type checking prevents runtime errors
- Better IDE support

## Testing Strategy

### Unit Tests

- Each command in isolation
- Memory bounds checking
- Parser edge cases
- State snapshot/restore

### Integration Tests

- Full program execution
- Undo/redo sequences
- Error handling flows

### End-to-End Tests

- Sample programs from INSTRUCTIONS.md
- UI interaction simulation
- Performance benchmarks

## Performance Considerations

1. **Memory Efficiency**: TypedArray for memory (4KB for 1000 integers)
2. **History Management**: Limit history depth (e.g., 1000 steps max)
3. **View Updates**: Throttle during "Run All" to maintain UI responsiveness
4. **Lazy Rendering**: Only render visible memory sections

## Error Handling

```typescript
enum ErrorType {
  MEMORY_OUT_OF_BOUNDS,
  INVALID_COMMAND,
  INVALID_OPERAND,
  PROGRAM_COUNTER_OUT_OF_BOUNDS,
  PARSE_ERROR,
}

class DigitScriptError extends Error {
  constructor(
    public type: ErrorType,
    public location: number,
    message: string,
  ) {
    super(message);
  }
}
```

## Future Enhancements

1. **Debugger Features**: Breakpoints, watch expressions
2. **Visual Mode**: Graphical memory visualization
3. **Web Version**: Browser-based IDE
4. **Extended Commands**: Multiply, divide, I/O operations
5. **Syntax Sugar**: Labels for memory locations (transpiled to numbers)
6. **Performance Profiling**: Show command execution counts
7. **File System**: Save/load programs
8. **REPL Mode**: Interactive shell

---

This implementation guide provides the foundation for building DigitScript with TypeScript, React, and Node.js. Follow the phases sequentially for a robust, maintainable implementation.
