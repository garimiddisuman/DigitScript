import { HaltCommand } from "../../src/commands/HaltCommand";
import { IMemory } from "../../src/interfaces/IMemory";
import { Memory } from "../../src/models/Memory";

describe("HaltCommand", () => {
  let memory: IMemory;
  let command: HaltCommand;

  beforeEach(() => {
    memory = new Memory(1000);
    command = new HaltCommand();
  });

  describe("Command Properties", () => {
    it("should have correct opcode", () => {
      expect(command.opcode).toBe(9);
    });

    it("should have correct operand count", () => {
      expect(command.operandCount).toBe(0);
    });
  });

  describe("Successful Execution", () => {
    it("should halt successfully with no operands", () => {
      const result = command.execute(memory, []);

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should not modify memory", () => {
      memory.write(10, 100);
      memory.write(20, 200);

      command.execute(memory, []);

      expect(memory.read(10)).toBe(100);
      expect(memory.read(20)).toBe(200);
    });

    it("should not have a program counter change", () => {
      const result = command.execute(memory, []);

      expect(result.newProgramCounter).toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should return error with one operand", () => {
      const result = command.execute(memory, [1]);

      expect(result.success).toBe(false);
      expect(result.shouldHalt).toBe(true);
      expect(result.error).toContain("requires no operands");
    });

    it("should return error with multiple operands", () => {
      const result = command.execute(memory, [1, 2, 3]);

      expect(result.success).toBe(false);
      expect(result.shouldHalt).toBe(true);
      expect(result.error).toContain("requires no operands");
    });

    it("should still halt even with invalid operands", () => {
      const result = command.execute(memory, [999]);

      expect(result.shouldHalt).toBe(true);
    });
  });

  describe("Idempotency", () => {
    it("should behave the same on multiple executions", () => {
      const result1 = command.execute(memory, []);
      const result2 = command.execute(memory, []);
      const result3 = command.execute(memory, []);

      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });
  });

  describe("Memory State Independence", () => {
    it("should halt regardless of memory state", () => {
      // Empty memory
      const result1 = command.execute(memory, []);
      expect(result1.success).toBe(true);
      expect(result1.shouldHalt).toBe(true);

      // Populated memory
      memory.write(1, 999);
      memory.write(100, -500);
      memory.write(1000, 12345);

      const result2 = command.execute(memory, []);
      expect(result2.success).toBe(true);
      expect(result2.shouldHalt).toBe(true);
    });
  });
});
