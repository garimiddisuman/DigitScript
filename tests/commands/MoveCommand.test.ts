import { MoveCommand } from "../../src/commands/MoveCommand";
import { Memory } from "../../src/models/Memory";
import { IMemory } from "../../src/interfaces/IMemory";

describe("MoveCommand", () => {
  let memory: IMemory;
  let command: MoveCommand;

  beforeEach(() => {
    memory = new Memory(1000);
    command = new MoveCommand();
  });

  describe("Command Properties", () => {
    it("should have correct opcode", () => {
      expect(command.opcode).toBe(7);
    });

    it("should have correct operand count", () => {
      expect(command.operandCount).toBe(2);
    });
  });

  describe("Successful Execution", () => {
    it("should copy value from source to destination", () => {
      memory.write(10, 100);

      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(false);
      expect(memory.read(20)).toBe(100);
      expect(memory.read(10)).toBe(100); // Source unchanged
    });

    it("should copy zero value", () => {
      memory.write(10, 0);

      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(true);
      expect(memory.read(20)).toBe(0);
    });

    it("should copy negative value", () => {
      memory.write(10, -500);

      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(true);
      expect(memory.read(20)).toBe(-500);
    });

    it("should copy large positive value", () => {
      memory.write(10, 999999);

      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(true);
      expect(memory.read(20)).toBe(999999);
    });

    it("should overwrite existing value at destination", () => {
      memory.write(10, 100);
      memory.write(20, 500);

      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(true);
      expect(memory.read(20)).toBe(100);
    });

    it("should work when source and destination are the same", () => {
      memory.write(10, 100);

      const result = command.execute(memory, [10, 10]);

      expect(result.success).toBe(true);
      expect(memory.read(10)).toBe(100);
    });

    it("should copy from uninitialized location (should be 0)", () => {
      const result = command.execute(memory, [50, 60]);

      expect(result.success).toBe(true);
      expect(memory.read(60)).toBe(0);
    });

    it("should not have program counter change", () => {
      memory.write(10, 100);
      const result = command.execute(memory, [10, 20]);

      expect(result.newProgramCounter).toBeUndefined();
    });

    it("should work at boundary memory locations", () => {
      memory.write(1, 50);

      const result = command.execute(memory, [1, 1000]);

      expect(result.success).toBe(true);
      expect(memory.read(1000)).toBe(50);
    });

    it("should copy from high to low memory location", () => {
      memory.write(900, 777);

      const result = command.execute(memory, [900, 10]);

      expect(result.success).toBe(true);
      expect(memory.read(10)).toBe(777);
    });
  });

  describe("Error Handling", () => {
    it("should return error with no operands", () => {
      const result = command.execute(memory, []);

      expect(result.success).toBe(false);
      expect(result.shouldHalt).toBe(false);
      expect(result.error).toContain("requires 2 operands");
    });

    it("should return error with only one operand", () => {
      const result = command.execute(memory, [10]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("requires 2 operands");
    });

    it("should return error with too many operands", () => {
      const result = command.execute(memory, [10, 20, 30]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("requires 2 operands");
    });

    it("should return error when source location is out of bounds (0)", () => {
      const result = command.execute(memory, [0, 20]);

      expect(result.success).toBe(false);
      expect(result.shouldHalt).toBe(false);
      expect(result.error).toContain("out of bounds");
    });

    it("should return error when source location is out of bounds (negative)", () => {
      const result = command.execute(memory, [-5, 20]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("out of bounds");
    });

    it("should return error when source location is out of bounds (too high)", () => {
      const result = command.execute(memory, [1002, 20]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("out of bounds");
    });

    it("should return error when destination location is out of bounds (0)", () => {
      memory.write(10, 100);
      const result = command.execute(memory, [10, 0]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("out of bounds");
    });

    it("should return error when destination location is out of bounds (negative)", () => {
      memory.write(10, 100);
      const result = command.execute(memory, [10, -10]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("out of bounds");
    });

    it("should return error when destination location is out of bounds (too high)", () => {
      memory.write(10, 100);
      const result = command.execute(memory, [10, 1002]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("out of bounds");
    });

    it("should return error when both locations are out of bounds", () => {
      const result = command.execute(memory, [0, 1002]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("out of bounds");
    });
  });

  describe("Multiple Operations", () => {
    it("should handle sequential move operations", () => {
      memory.write(10, 100);

      // Chain of moves
      command.execute(memory, [10, 20]);
      command.execute(memory, [20, 30]);
      command.execute(memory, [30, 40]);

      expect(memory.read(20)).toBe(100);
      expect(memory.read(30)).toBe(100);
      expect(memory.read(40)).toBe(100);
    });

    it("should handle circular move pattern", () => {
      memory.write(10, 100);
      memory.write(20, 200);
      memory.write(30, 300);

      // Create temporary storage
      command.execute(memory, [10, 40]); // temp = 10
      command.execute(memory, [20, 10]); // 10 = 20
      command.execute(memory, [30, 20]); // 20 = 30
      command.execute(memory, [40, 30]); // 30 = temp

      expect(memory.read(10)).toBe(200);
      expect(memory.read(20)).toBe(300);
      expect(memory.read(30)).toBe(100);
    });
  });

  describe("Edge Cases", () => {
    it("should handle maximum positive Int32 value", () => {
      const maxInt32 = 2147483647;
      memory.write(10, maxInt32);

      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(true);
      expect(memory.read(20)).toBe(maxInt32);
    });

    it("should handle minimum negative Int32 value", () => {
      const minInt32 = -2147483648;
      memory.write(10, minInt32);

      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(true);
      expect(memory.read(20)).toBe(minInt32);
    });

    it("should work with adjacent memory locations", () => {
      memory.write(100, 999);

      const result = command.execute(memory, [100, 101]);

      expect(result.success).toBe(true);
      expect(memory.read(101)).toBe(999);
    });
  });
});
