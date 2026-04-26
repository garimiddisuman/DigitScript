// src/models/interfaces/IExecutor.ts

import { ExecutionResult } from "./ICommand";

export interface IExecutor {
  loadProgram(program: number[]): void;
  step(): ExecutionResult;
  run(maxSteps?: number): ExecutionResult;
  getProgramCounter(): number;
  getStepCount(): number;
  isHalted(): boolean;
  reset(): void;
}
