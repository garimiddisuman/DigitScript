import { IExecutor } from "../interfaces/IExecutor";
import { IMemory } from "../interfaces/IMemory";
import { CommandFactory } from "../commands/CommandFactory";
import { ExecutionResult } from "../interfaces/ICommand";
import { RunResult } from "../interfaces/IExecutor";

export class Executor implements IExecutor {
  private memory: IMemory;
  private programCounter: number;
  private stepCount: number;
  private halted: boolean;

  constructor(memory: IMemory) {
    this.memory = memory;
    this.programCounter = 1;
    this.stepCount = 0;
    this.halted = false;
  }

  loadProgram(program: number[]): void {
    // Load program into memory starting at location 1
    for (let i = 0; i < program.length; i++) {
      this.memory.write(i + 1, program[i]);
    }
    this.reset();
  }

  step(): ExecutionResult {
    if (this.halted) {
      return {
        success: true,
        shouldHalt: true,
      };
    }

    try {
      // Fetch opcode
      const opcode = this.memory.read(this.programCounter);

      // Get command from factory
      const command = CommandFactory.createCommand(opcode);

      // Read operands
      const operands: number[] = [];
      for (let i = 0; i < command.operandCount; i++) {
        operands.push(this.memory.read(this.programCounter + 1 + i));
      }

      // Execute command
      const result = command.execute(this.memory, operands);

      // Update program counter
      if (result.newProgramCounter !== undefined) {
        this.programCounter = result.newProgramCounter;
      } else {
        this.programCounter += 1 + command.operandCount;
      }

      // Update state
      this.stepCount++;
      if (result.shouldHalt) {
        this.halted = true;
      }

      return result;
    } catch (error) {
      this.halted = true;
      return {
        success: false,
        shouldHalt: true,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  run(maxSteps: number = 10000): RunResult {
    let lastResult: ExecutionResult = { success: true, shouldHalt: false };

    while (!this.halted && this.stepCount < maxSteps) {
      lastResult = this.step();

      if (!lastResult.success || lastResult.shouldHalt) {
        break;
      }
    }

    if (this.stepCount >= maxSteps) {
      return {
        success: false,
        shouldHalt: true,
        error: `Maximum steps (${maxSteps}) exceeded - possible infinite loop`,
        stepCount: this.stepCount,
      };
    }

    return {
      ...lastResult,
      stepCount: this.stepCount,
    };
  }

  getProgramCounter(): number {
    return this.programCounter;
  }

  getStepCount(): number {
    return this.stepCount;
  }

  isHalted(): boolean {
    return this.halted;
  }

  reset(): void {
    this.programCounter = 1;
    this.stepCount = 0;
    this.halted = false;
  }
}
