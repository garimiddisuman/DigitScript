import { ProgramState } from "../../src/models/ProgramState";
import { Memory } from "../../src/models/Memory";
import { Executor } from "../../src/models/Executor";
import { IMemory } from "../../src/interfaces/IMemory";
import { IExecutor } from "../../src/interfaces/IExecutor";
import { ExecutionStep } from "../../src/interfaces/IProgramState";

describe("ProgramState", () => {
  let memory: IMemory;
  let executor: IExecutor;
  let programState: ProgramState;

  beforeEach(() => {
    memory = new Memory(1000);
    executor = new Executor(memory);
    programState = new ProgramState(memory, executor);
  });

  describe("saveState", () => {
    it("should capture current execution state", () => {
      executor.loadProgram([7, 10, 20, 9]);
      memory.write(10, 100);

      const snapshot = programState.saveState();

      expect(snapshot.programCounter).toBe(1);
      expect(snapshot.stepCount).toBe(0);
      expect(snapshot.halted).toBe(false);
      expect(snapshot.memorySnapshot.length).toBe(1001);
      expect(snapshot.memorySnapshot[10]).toBe(100);
    });

    it("should capture state after execution", () => {
      executor.loadProgram([7, 10, 20, 9]);
      memory.write(10, 55);
      executor.step();

      const snapshot = programState.saveState();

      expect(snapshot.programCounter).toBe(4);
      expect(snapshot.stepCount).toBe(1);
      expect(snapshot.halted).toBe(false);
    });
  });

  describe("restoreState", () => {
    it("should restore memory from a snapshot", () => {
      memory.write(10, 100);
      memory.write(20, 200);

      const snapshot = programState.saveState();

      memory.write(10, 999);
      memory.write(20, 888);

      programState.restoreState(snapshot);

      expect(memory.read(10)).toBe(100);
      expect(memory.read(20)).toBe(200);
    });
  });

  describe("recordStep", () => {
    it("should add execution step to history", () => {
      const step: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      programState.recordStep(step);

      expect(programState.executionHistory.length).toBe(1);
      expect(programState.executionHistory[0]).toBe(step);
    });

    it("should add multiple steps in sequence", () => {
      const step1: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      const step2: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 4,
        memorySnapshot: memory.getSnapshot(),
        opcode: 9,
        operands: [],
      };

      programState.recordStep(step1);
      programState.recordStep(step2);

      expect(programState.executionHistory.length).toBe(2);
      expect(programState.executionHistory[0]).toBe(step1);
      expect(programState.executionHistory[1]).toBe(step2);
    });

    it("should remove future steps when recording after undo", () => {
      const step1: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      const step2: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 4,
        memorySnapshot: memory.getSnapshot(),
        opcode: 9,
        operands: [],
      };

      const step3: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 5,
        memorySnapshot: memory.getSnapshot(),
        opcode: 1,
        operands: [10, 20, 30],
      };

      programState.recordStep(step1);
      programState.recordStep(step2);
      programState.undo();
      programState.recordStep(step3);

      expect(programState.executionHistory.length).toBe(2);
      expect(programState.executionHistory[1]).toBe(step3);
    });
  });

  describe("canUndo and canRedo", () => {
    it("should return false for canUndo when no history", () => {
      expect(programState.canUndo()).toBe(false);
    });

    it("should return false for canRedo when no history", () => {
      expect(programState.canRedo()).toBe(false);
    });

    it("should return false for canUndo with only one step", () => {
      const step: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      programState.recordStep(step);

      expect(programState.canUndo()).toBe(false);
    });

    it("should return true for canUndo with multiple steps", () => {
      const step1: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      const step2: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 4,
        memorySnapshot: memory.getSnapshot(),
        opcode: 9,
        operands: [],
      };

      programState.recordStep(step1);
      programState.recordStep(step2);

      expect(programState.canUndo()).toBe(true);
    });

    it("should return true for canRedo after undo", () => {
      const step1: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      const step2: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 4,
        memorySnapshot: memory.getSnapshot(),
        opcode: 9,
        operands: [],
      };

      programState.recordStep(step1);
      programState.recordStep(step2);
      programState.undo();

      expect(programState.canRedo()).toBe(true);
    });
  });

  describe("undo", () => {
    it("should throw error when cannot undo", () => {
      expect(() => programState.undo()).toThrow(
        "Cannot undo: no previous state available",
      );
    });

    it("should restore previous memory state", () => {
      memory.write(10, 100);
      const step1: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      memory.write(10, 200);
      const step2: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 4,
        memorySnapshot: memory.getSnapshot(),
        opcode: 9,
        operands: [],
      };

      programState.recordStep(step1);
      programState.recordStep(step2);

      expect(memory.read(10)).toBe(200);

      programState.undo();

      expect(memory.read(10)).toBe(100);
    });
  });

  describe("redo", () => {
    it("should throw error when cannot redo", () => {
      expect(() => programState.redo()).toThrow(
        "Cannot redo: no next state available",
      );
    });

    it("should restore next memory state", () => {
      memory.write(10, 100);
      const step1: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      memory.write(10, 200);
      const step2: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 4,
        memorySnapshot: memory.getSnapshot(),
        opcode: 9,
        operands: [],
      };

      programState.recordStep(step1);
      programState.recordStep(step2);
      programState.undo();

      expect(memory.read(10)).toBe(100);

      programState.redo();

      expect(memory.read(10)).toBe(200);
    });
  });

  describe("clear", () => {
    it("should remove all execution history", () => {
      const step1: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 1,
        memorySnapshot: memory.getSnapshot(),
        opcode: 7,
        operands: [10, 20],
      };

      const step2: ExecutionStep = {
        timestamp: Date.now(),
        programCounter: 4,
        memorySnapshot: memory.getSnapshot(),
        opcode: 9,
        operands: [],
      };

      programState.recordStep(step1);
      programState.recordStep(step2);

      programState.clear();

      expect(programState.executionHistory.length).toBe(0);
      expect(programState.canUndo()).toBe(false);
      expect(programState.canRedo()).toBe(false);
    });
  });
});
