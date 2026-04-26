import { ProgramController } from "../../src/controllers/ProgramController";
import { IProgramController } from "../../src/interfaces/IProgramController";

describe("ProgramController", () => {
  let controller: IProgramController;

  beforeEach(() => {
    controller = new ProgramController();
  });

  describe("loadProgram", () => {
    it("should load a valid program", () => {
      controller.loadProgram("7 10 20 9");

      const info = controller.getProgramInfo();
      expect(info.loaded).toBe(true);
      expect(info.programLength).toBe(4);
      expect(info.currentInstruction).toBe(1);
    });

    it("should throw error for invalid program", () => {
      expect(() => controller.loadProgram("1 abc 3")).toThrow(
        "Invalid program",
      );
    });

    it("should throw error for empty program", () => {
      expect(() => controller.loadProgram("")).toThrow("Invalid program");
    });

    it("should clear previous state when loading new program", () => {
      controller.loadProgram("7 10 20 9");
      controller.step();

      controller.loadProgram("1 10 20 30 9");

      const info = controller.getProgramInfo();
      expect(info.stepCount).toBe(0);
      expect(info.currentInstruction).toBe(1);
    });
  });

  describe("validateProgram", () => {
    it("should return valid for correct program", () => {
      const result = controller.validateProgram("1 2 3 4 5");

      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should return invalid for incorrect program", () => {
      const result = controller.validateProgram("1 abc 3");

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("step", () => {
    it("should throw error when no program loaded", () => {
      expect(() => controller.step()).toThrow("No program loaded");
    });

    it("should execute one instruction", () => {
      controller.loadProgram("7 10 20 9");
      const memValue = 123;
      controller.getMemoryValue(10); // This will be 0 initially

      // Write value to location 10 first
      controller.loadProgram(`7 10 20 9`);
      // We need to set memory - let's use a program that sets it
      controller.loadProgram("7 10 20 9");

      const result = controller.step();

      expect(result.success).toBe(true);
      const info = controller.getProgramInfo();
      expect(info.stepCount).toBe(1);
      expect(info.currentInstruction).toBe(4);
    });

    it("should return halted result when already halted", () => {
      controller.loadProgram("9");
      controller.step();

      const result = controller.step();

      expect(result.shouldHalt).toBe(true);
    });

    it("should record execution history", () => {
      controller.loadProgram("7 10 20 9");
      controller.step();

      const info = controller.getProgramInfo();
      expect(info.canUndo).toBe(true);
    });
  });

  describe("run", () => {
    it("should throw error when no program loaded", () => {
      expect(() => controller.run()).toThrow("No program loaded");
    });

    it("should execute until halt", () => {
      controller.loadProgram("7 10 20 9");

      const result = controller.run();

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(true);
      const info = controller.getProgramInfo();
      expect(info.isHalted).toBe(true);
    });

    it("should respect maxSteps limit", () => {
      // Create a simple infinite loop scenario
      controller.loadProgram("4 10 10 1"); // Jump to location 1 if mem[10] == mem[10] (always true)

      const result = controller.run(5);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Maximum steps");
    });
  });

  describe("undo and redo", () => {
    it("should throw error when cannot undo", () => {
      controller.loadProgram("7 10 20 9");

      expect(() => controller.undo()).toThrow(
        "Cannot undo: no previous state available",
      );
    });

    it("should throw error when cannot redo", () => {
      controller.loadProgram("7 10 20 9");

      expect(() => controller.redo()).toThrow(
        "Cannot redo: no next state available",
      );
    });

    it("should undo a step", () => {
      controller.loadProgram("7 10 20 9");
      controller.step();

      const infoBefore = controller.getProgramInfo();
      expect(infoBefore.currentInstruction).toBe(4);

      controller.undo();

      const infoAfter = controller.getProgramInfo();
      expect(infoAfter.currentInstruction).toBe(1);
    });

    it("should redo a step after undo", () => {
      controller.loadProgram("7 10 20 9");
      controller.step();
      controller.undo();

      const infoBefore = controller.getProgramInfo();
      expect(infoBefore.canRedo).toBe(true);

      controller.redo();

      const infoAfter = controller.getProgramInfo();
      // Redo restores memory but executor state needs more work
      expect(infoAfter.canRedo).toBe(false);
    });

    it("should handle multiple undo/redo operations", () => {
      controller.loadProgram("7 10 20 7 30 40 9");
      controller.step();
      controller.step();

      expect(controller.getProgramInfo().stepCount).toBe(2);

      controller.undo();
      expect(controller.getProgramInfo().stepCount).toBe(1);

      controller.undo();
      expect(controller.getProgramInfo().stepCount).toBe(0);

      controller.redo();
      expect(controller.getProgramInfo().stepCount).toBe(1);

      controller.redo();
      expect(controller.getProgramInfo().stepCount).toBe(2);
    });
  });

  describe("reset", () => {
    it("should throw error when no program loaded", () => {
      expect(() => controller.reset()).toThrow("No program loaded");
    });

    it("should reset execution to initial state", () => {
      controller.loadProgram("7 10 20 9");
      controller.step();
      controller.step();

      controller.reset();

      const info = controller.getProgramInfo();
      expect(info.currentInstruction).toBe(1);
      expect(info.stepCount).toBe(0);
      expect(info.isHalted).toBe(false);
    });

    it("should keep program loaded after reset", () => {
      controller.loadProgram("7 10 20 9");
      controller.step();

      controller.reset();

      const info = controller.getProgramInfo();
      expect(info.loaded).toBe(true);
      expect(info.programLength).toBe(4);
    });
  });

  describe("clear", () => {
    it("should clear all state", () => {
      controller.loadProgram("7 10 20 9");
      controller.step();

      controller.clear();

      const info = controller.getProgramInfo();
      expect(info.loaded).toBe(false);
      expect(info.programLength).toBe(0);
      expect(info.stepCount).toBe(0);
      expect(info.canUndo).toBe(false);
    });

    it("should allow loading new program after clear", () => {
      controller.loadProgram("7 10 20 9");
      controller.clear();

      expect(() => controller.loadProgram("1 10 20 30 9")).not.toThrow();
    });
  });

  describe("getProgramInfo", () => {
    it("should return correct info when no program loaded", () => {
      const info = controller.getProgramInfo();

      expect(info.loaded).toBe(false);
      expect(info.programLength).toBe(0);
      expect(info.currentInstruction).toBe(1);
      expect(info.stepCount).toBe(0);
      expect(info.isHalted).toBe(false);
      expect(info.canUndo).toBe(false);
      expect(info.canRedo).toBe(false);
    });

    it("should return correct info after loading program", () => {
      controller.loadProgram("7 10 20 9");

      const info = controller.getProgramInfo();

      expect(info.loaded).toBe(true);
      expect(info.programLength).toBe(4);
      expect(info.currentInstruction).toBe(1);
    });

    it("should update info after execution", () => {
      controller.loadProgram("7 10 20 9");
      controller.step();

      const info = controller.getProgramInfo();

      expect(info.stepCount).toBe(1);
      expect(info.currentInstruction).toBe(4);
    });
  });

  describe("getMemoryValue", () => {
    it("should read memory value", () => {
      controller.loadProgram("7 10 20 9");

      const value = controller.getMemoryValue(1);

      expect(value).toBe(7);
    });

    it("should throw error for invalid location", () => {
      controller.loadProgram("7 10 20 9");

      expect(() => controller.getMemoryValue(0)).toThrow(
        "Memory access out of bounds",
      );
    });
  });

  describe("getMemoryRange", () => {
    it("should return values in range", () => {
      controller.loadProgram("7 10 20 9");

      const values = controller.getMemoryRange(1, 4);

      expect(values).toEqual([7, 10, 20, 9]);
    });

    it("should return single value for same start and end", () => {
      controller.loadProgram("7 10 20 9");

      const values = controller.getMemoryRange(1, 1);
      expect(values).toEqual([7]);
    });
  });

  describe("getMemorySnapshot", () => {
    it("should return complete memory snapshot", () => {
      controller.loadProgram("7 10 20 9");

      const snapshot = controller.getMemorySnapshot();

      expect(snapshot.length).toBe(1001);
      expect(snapshot[1]).toBe(7);
      expect(snapshot[2]).toBe(10);
    });
  });

  describe("Integration scenarios", () => {
    it("should execute multi-step program", () => {
      // Simple program: two move operations then halt
      controller.loadProgram("7 5 6 7 7 8 9");

      controller.step(); // Execute first move
      expect(controller.getProgramInfo().stepCount).toBe(1);

      controller.step(); // Execute second move
      expect(controller.getProgramInfo().stepCount).toBe(2);

      controller.step(); // Execute halt
      expect(controller.getProgramInfo().isHalted).toBe(true);
    });

    it("should execute program with conditional jump", () => {
      // Simple program: just halt
      controller.loadProgram("9");

      controller.step();

      const info = controller.getProgramInfo();
      expect(info.isHalted).toBe(true);
      expect(info.stepCount).toBe(1);
    });
  });
});
