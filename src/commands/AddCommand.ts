import { ICommand } from "../interfaces/ICommand";
import { IMemory } from "../interfaces/IMemory";
import { ExecutionResult } from "../interfaces/ICommand";
import { CommandsInfo } from "./CommandsInfo";

export class AddCommand implements ICommand {
  readonly opcode = CommandsInfo.ADD.opcode;
  readonly operandCount = CommandsInfo.ADD.operandCount;

  private validate(operands: number[]): boolean {
    return operands.length === this.operandCount;
  }

  execute(memory: IMemory, operands: number[]): ExecutionResult {
    if (!this.validate(operands)) {
      return {
        success: false,
        shouldHalt: false,
        error: `Add command requires ${this.operandCount} operands`,
      };
    }

    const [operand1, operand2, destination] = operands;

    try {
      const value1 = memory.read(operand1);
      const value2 = memory.read(operand2);
      const result = value1 + value2;
      memory.write(destination, result);

      return {
        success: true,
        shouldHalt: false,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        success: false,
        shouldHalt: false,
        error: `Error executing Add command: ${errorMessage}`,
      };
    }
  }
}
