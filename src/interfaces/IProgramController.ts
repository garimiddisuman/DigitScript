import { RunResult } from "./IExecutor";
import { ExecutionResult } from "./ICommand";
import { ValidationResult } from "./IParser";

export interface ProgramInfo {
  loaded: boolean;
  programLength: number;
  currentInstruction: number;
  stepCount: number;
  isHalted: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export interface IProgramController {
  // Program lifecycle
  loadProgram(input: string): void;
  validateProgram(input: string): ValidationResult;
  reset(): void;
  clear(): void;

  // Execution control
  step(): ExecutionResult;
  run(maxSteps?: number): RunResult;
  undo(): void;
  redo(): void;

  // State queries
  getProgramInfo(): ProgramInfo;
  getMemoryValue(location: number): number;
  getMemoryRange(start: number, end: number): number[];
  getMemorySnapshot(): number[];
}
