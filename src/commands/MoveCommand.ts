import { ICommand } from "../interfaces/ICommand";
import { IMemory } from "../interfaces/IMemory";
import { ExecutionResult } from "../interfaces/ICommand";
import { CommandsInfo } from "./CommandsInfo";

export class MoveCommand implements ICommand {
  readonly opcode = CommandsInfo.MOVE.opcode;
  readonly operandCount = CommandsInfo.MOVE.operandCount;

  private validate(operands: number[]): boolean {
    return operands.length === this.operandCount;
  }

  execute(memory: IMemory, operands: number[]): ExecutionResult {
    if (!this.validate(operands)) {
      return {
        success: false,
        shouldHalt: false,
        error: `Move command requires ${this.operandCount} operands`,
      };
    }

    const [source, destination] = operands;

    try {
      const value = memory.read(source);
      memory.write(destination, value);

      return {
        success: true,
        shouldHalt: false,
      };
    } catch (error) {
      return {
        success: false,
        shouldHalt: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
