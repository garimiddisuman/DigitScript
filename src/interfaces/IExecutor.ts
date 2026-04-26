// src/models/interfaces/IExecutor.ts

import { ExecutionResult } from "./ICommand";

export interface RunResult extends ExecutionResult {
  stepCount: number;
}

export interface IExecutor {
  loadProgram(program: number[]): void;
  step(): ExecutionResult;
  run(maxSteps?: number): RunResult;
  getProgramCounter(): number;
  getStepCount(): number;
  isHalted(): boolean;
  reset(): void;
}
