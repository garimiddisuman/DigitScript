import { CommandFactory } from "../../src/commands/CommandFactory";
import { ICommand } from "../../src/interfaces/ICommand";
import { IMemory } from "../../src/interfaces/IMemory";
import { Executor } from "../../src/models/Executor";
import { Memory } from "../../src/models/Memory";

describe("Executor", () => {
  let memory: IMemory;
  let executor: Executor;

  beforeEach(() => {
    memory = new Memory(1000);
    executor = new Executor(memory);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("step", () => {
    it("should execute one command and advance state", () => {
      executor.loadProgram([7, 10, 20, 9]);
      memory.write(10, 123);

      const result = executor.step();

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(false);
      expect(memory.read(20)).toBe(123);
      expect(executor.getProgramCounter()).toBe(4);
      expect(executor.getStepCount()).toBe(1);
      expect(executor.isHalted()).toBe(false);
    });

    it("should halt when executing a halt command", () => {
      executor.loadProgram([9]);

      const result = executor.step();

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(true);
      expect(executor.isHalted()).toBe(true);
      expect(executor.getProgramCounter()).toBe(2);
      expect(executor.getStepCount()).toBe(1);
    });

    it("should return halted result without changing state after halt", () => {
      executor.loadProgram([9]);
      executor.step();

      const result = executor.step();

      expect(result).toEqual({ success: true, shouldHalt: true });
      expect(executor.getProgramCounter()).toBe(2);
      expect(executor.getStepCount()).toBe(1);
    });

    it("should halt with an error on unknown opcode", () => {
      executor.loadProgram([99]);

      const result = executor.step();

      expect(result.success).toBe(false);
      expect(result.shouldHalt).toBe(true);
      expect(result.error).toContain("Unknown command opcode: 99");
      expect(executor.isHalted()).toBe(true);
      expect(executor.getStepCount()).toBe(0);
    });

    it("should update program counter from jump command result", () => {
      executor.loadProgram([4, 10, 20, 6, 9, 9]);
      memory.write(10, 77);
      memory.write(20, 77);

      const result = executor.step();

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(false);
      expect(result.newProgramCounter).toBe(6);
      expect(executor.getProgramCounter()).toBe(6);
      expect(executor.getStepCount()).toBe(1);
      expect(executor.isHalted()).toBe(false);
    });
  });

  describe("run", () => {
    it("should run until halt and report total step count", () => {
      executor.loadProgram([7, 10, 20, 9]);
      memory.write(10, 55);

      const result = executor.run();

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(true);
      expect(result.stepCount).toBe(2);
      expect(memory.read(20)).toBe(55);
      expect(executor.getStepCount()).toBe(2);
      expect(executor.isHalted()).toBe(true);
    });

    it("should stop when max steps is exceeded", () => {
      const loopingCommand: ICommand = {
        opcode: 42,
        operandCount: 0,
        execute: () => ({
          success: true,
          shouldHalt: false,
          newProgramCounter: 1,
        }),
      };

      jest
        .spyOn(CommandFactory, "createCommand")
        .mockReturnValue(loopingCommand);
      executor.loadProgram([42]);

      const result = executor.run(3);

      expect(result.success).toBe(false);
      expect(result.shouldHalt).toBe(true);
      expect(result.error).toContain("Maximum steps (3) exceeded");
      expect(result.stepCount).toBe(3);
      expect(executor.getStepCount()).toBe(3);
      expect(executor.isHalted()).toBe(false);
    });

    it("should follow a jump and skip over intervening instructions", () => {
      executor.loadProgram([4, 10, 20, 8, 7, 10, 30, 9]);
      memory.write(10, 9);
      memory.write(20, 9);
      memory.write(30, 0);

      const result = executor.run();

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(true);
      expect(result.stepCount).toBe(2);
      expect(memory.read(30)).toBe(0);
      expect(executor.getProgramCounter()).toBe(9);
      expect(executor.isHalted()).toBe(true);
    });
  });

  describe("reset behavior", () => {
    it("should reset execution state when loading a new program", () => {
      executor.loadProgram([9]);
      executor.step();

      executor.loadProgram([7, 10, 20, 9]);

      expect(executor.getProgramCounter()).toBe(1);
      expect(executor.getStepCount()).toBe(0);
      expect(executor.isHalted()).toBe(false);
    });
  });

  describe("restoreState", () => {
    it("should restore program counter", () => {
      executor.loadProgram([7, 10, 20, 9]);
      executor.step();

      executor.restoreState(1, 0, false);

      expect(executor.getProgramCounter()).toBe(1);
    });

    it("should restore step count", () => {
      executor.loadProgram([7, 10, 20, 9]);
      executor.step();
      executor.step();

      executor.restoreState(4, 1, false);

      expect(executor.getStepCount()).toBe(1);
    });

    it("should restore halted state", () => {
      executor.loadProgram([9]);
      executor.step();

      expect(executor.isHalted()).toBe(true);

      executor.restoreState(1, 0, false);

      expect(executor.isHalted()).toBe(false);
    });

    it("should restore all state together", () => {
      executor.loadProgram([7, 10, 20, 9]);
      executor.step();
      executor.step();

      executor.restoreState(4, 1, true);

      expect(executor.getProgramCounter()).toBe(4);
      expect(executor.getStepCount()).toBe(1);
      expect(executor.isHalted()).toBe(true);
    });
  });
});
