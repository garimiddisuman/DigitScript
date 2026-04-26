import { ICommand } from "../interfaces/ICommand";
import { IMemory } from "../interfaces/IMemory";
import { ExecutionResult } from "../interfaces/ICommand";
import { CommandsInfo } from "./CommandsInfo";

export class JumpIfEqualCommand implements ICommand {
  readonly opcode = CommandsInfo.JUMP_IF_EQUAL.opcode;
  readonly operandCount = CommandsInfo.JUMP_IF_EQUAL.operandCount;

  private validate(operands: number[]): boolean {
    return operands.length === this.operandCount;
  }

  execute(memory: IMemory, operands: number[]): ExecutionResult {
    if (!this.validate(operands)) {
      return {
        success: false,
        shouldHalt: false,
        error: `JumpIfEqual command requires ${this.operandCount} operands`,
      };
    }

    const [locationA, locationB, jumpLocation] = operands;

    try {
      const valueA = memory.read(locationA);
      const valueB = memory.read(locationB);

      if (valueA === valueB) {
        return {
          success: true,
          shouldHalt: false,
          newProgramCounter: jumpLocation,
        };
      }

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
        error: `Error executing JumpIfEqual command: ${errorMessage}`,
      };
    }
  }
}
