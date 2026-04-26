import {
  IProgramState,
  ExecutionStep,
  StateSnapshot,
} from "../interfaces/IProgramState";
import { IMemory } from "../interfaces/IMemory";
import { IExecutor } from "../interfaces/IExecutor";

export class ProgramState implements IProgramState {
  readonly memory: IMemory;
  readonly executionHistory: ExecutionStep[];
  private executor: IExecutor;
  private historyIndex: number;
  private maxHistorySize: number;

  constructor(
    memory: IMemory,
    executor: IExecutor,
    maxHistorySize: number = 1000,
  ) {
    this.memory = memory;
    this.executor = executor;
    this.executionHistory = [];
    this.historyIndex = -1;
    this.maxHistorySize = maxHistorySize;
  }

  saveState(): StateSnapshot {
    return {
      programCounter: this.executor.getProgramCounter(),
      stepCount: this.executor.getStepCount(),
      halted: this.executor.isHalted(),
      memorySnapshot: this.memory.getSnapshot(),
    };
  }

  restoreState(snapshot: StateSnapshot): void {
    this.memory.restoreSnapshot(snapshot.memorySnapshot);
    this.executor.reset();
    // Note: This is a simplified restore. Full implementation would need
    // to restore PC, step count, and halted state in the executor
  }

  recordStep(step: ExecutionStep): void {
    // If we're not at the end of history, remove any "future" steps
    if (this.historyIndex < this.executionHistory.length - 1) {
      this.executionHistory.splice(this.historyIndex + 1);
    }

    // Add the new step
    this.executionHistory.push(step);
    this.historyIndex++;

    // Enforce max history size (remove oldest if needed)
    if (this.executionHistory.length > this.maxHistorySize) {
      this.executionHistory.shift();
      this.historyIndex--;
    }
  }

  canUndo(): boolean {
    return this.historyIndex > 0;
  }

  canRedo(): boolean {
    return this.historyIndex < this.executionHistory.length - 1;
  }

  undo(): void {
    if (!this.canUndo()) {
      throw new Error("Cannot undo: no previous state available");
    }

    this.historyIndex--;
    const step = this.executionHistory[this.historyIndex];
    this.memory.restoreSnapshot(step.memorySnapshot);
  }

  redo(): void {
    if (!this.canRedo()) {
      throw new Error("Cannot redo: no next state available");
    }

    this.historyIndex++;
    const step = this.executionHistory[this.historyIndex];
    this.memory.restoreSnapshot(step.memorySnapshot);
  }

  clear(): void {
    this.executionHistory.length = 0;
    this.historyIndex = -1;
  }
}
