import { IMemory } from "./IMemory";

export interface ExecutionStep {
  timestamp: number;
  programCounter: number;
  memorySnapshot: number[];
  opcode: number;
  operands: number[];
}

export interface StateSnapshot {
  programCounter: number;
  stepCount: number;
  halted: boolean;
  memorySnapshot: number[];
}

export interface IProgramState {
  readonly memory: IMemory;
  readonly executionHistory: ExecutionStep[];

  saveState(): StateSnapshot;
  restoreState(snapshot: StateSnapshot): void;
  recordStep(step: ExecutionStep): void;
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
  clear(): void;
}
