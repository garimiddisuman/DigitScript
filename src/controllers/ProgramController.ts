import {
  IProgramController,
  ProgramInfo,
} from "../interfaces/IProgramController";
import { IMemory } from "../interfaces/IMemory";
import { IExecutor, RunResult } from "../interfaces/IExecutor";
import { IParser, ValidationResult } from "../interfaces/IParser";
import { IProgramState, ExecutionStep } from "../interfaces/IProgramState";
import { ExecutionResult } from "../interfaces/ICommand";
import { Memory } from "../models/Memory";
import { Executor } from "../models/Executor";
import { ProgramState } from "../models/ProgramState";
import { Parser } from "../utils/Parser";

export class ProgramController implements IProgramController {
  private memory: IMemory;
  private executor: IExecutor;
  private parser: IParser;
  private programState: IProgramState;
  private programLoaded: boolean;
  private programLength: number;

  constructor(memorySize: number = 1000) {
    this.memory = new Memory(memorySize);
    this.executor = new Executor(this.memory);
    this.parser = new Parser();
    this.programState = new ProgramState(this.memory, this.executor);
    this.programLoaded = false;
    this.programLength = 0;
  }

  loadProgram(input: string): void {
    // Validate first
    const validation = this.parser.validate(input);
    if (!validation.valid) {
      throw new Error(`Invalid program: ${validation.errors.join(", ")}`);
    }

    // Parse the program
    const program = this.parser.parse(input);

    // Reset state before loading
    this.clear();

    // Load into executor
    this.executor.loadProgram(program);

    // Record initial state
    const initialStep: ExecutionStep = {
      timestamp: Date.now(),
      programCounter: this.executor.getProgramCounter(),
      memorySnapshot: this.memory.getSnapshot(),
      opcode: 0,
      operands: [],
    };
    this.programState.recordStep(initialStep);

    this.programLoaded = true;
    this.programLength = program.length;
  }

  validateProgram(input: string): ValidationResult {
    return this.parser.validate(input);
  }

  reset(): void {
    if (!this.programLoaded) {
      throw new Error("No program loaded");
    }

    // Go back to initial state
    while (this.programState.canUndo()) {
      this.programState.undo();
    }

    // Reset executor state
    this.executor.reset();
  }

  clear(): void {
    this.memory.reset();
    this.executor.reset();
    this.programState.clear();
    this.programLoaded = false;
    this.programLength = 0;
  }

  step(): ExecutionResult {
    if (!this.programLoaded) {
      throw new Error("No program loaded");
    }

    if (this.executor.isHalted()) {
      return {
        success: true,
        shouldHalt: true,
      };
    }

    // Capture state before execution
    const pcBefore = this.executor.getProgramCounter();
    const opcode = this.memory.read(pcBefore);

    // Execute the step
    const result = this.executor.step();

    // Record the step if successful
    if (result.success) {
      const step: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: pcBefore,
        memorySnapshot: this.memory.getSnapshot(),
        opcode: opcode,
        operands: [], // We could extract operands here if needed
      };
      this.programState.recordStep(step);
    }

    return result;
  }

  run(maxSteps: number = 10000): RunResult {
    if (!this.programLoaded) {
      throw new Error("No program loaded");
    }

    return this.executor.run(maxSteps);
  }

  undo(): void {
    if (!this.programState.canUndo()) {
      throw new Error("Cannot undo: no previous state available");
    }

    this.programState.undo();
  }

  redo(): void {
    if (!this.programState.canRedo()) {
      throw new Error("Cannot redo: no next state available");
    }

    this.programState.redo();
  }

  getProgramInfo(): ProgramInfo {
    return {
      loaded: this.programLoaded,
      programLength: this.programLength,
      currentInstruction: this.executor.getProgramCounter(),
      stepCount: this.executor.getStepCount(),
      isHalted: this.executor.isHalted(),
      canUndo: this.programState.canUndo(),
      canRedo: this.programState.canRedo(),
    };
  }

  getMemoryValue(location: number): number {
    return this.memory.read(location);
  }

  getMemoryRange(start: number, end: number): number[] {
    const values: number[] = [];
    for (let i = start; i <= end; i++) {
      values.push(this.memory.read(i));
    }
    return values;
  }

  getMemorySnapshot(): number[] {
    return this.memory.getSnapshot();
  }
}
