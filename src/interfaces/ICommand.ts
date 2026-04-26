import { IMemory } from "./IMemory";

export interface ExecutionResult {
  success: boolean;
  shouldHalt: boolean;
  newProgramCounter?: number;
  error?: string;
}

export interface ICommand {
  readonly opcode: number;
  readonly operandCount: number;
  
  execute(memory: IMemory, operands: number[]): ExecutionResult;
}