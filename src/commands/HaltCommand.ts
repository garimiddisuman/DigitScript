import { ICommand } from "../interfaces/ICommand";
import { IMemory } from "../interfaces/IMemory";
import { ExecutionResult } from "../interfaces/ICommand";
import { CommandsInfo } from "./CommandsInfo";  

export class HaltCommand implements ICommand {
  readonly opcode = CommandsInfo.HALT.opcode;
  readonly operandCount = CommandsInfo.HALT.operandCount;

  private validate(operands: number[]): boolean {
    return operands.length === this.operandCount;
  }

  execute(memory: IMemory, operands: number[]): ExecutionResult {
    if (!this.validate(operands)) {
      return {
        success: false,
        shouldHalt: true,
        error: "Halt command requires no operands",
      };
    }

    return {
      success: true,
      shouldHalt: true,
    };
  }
}
