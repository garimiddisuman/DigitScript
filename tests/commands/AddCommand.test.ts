import { AddCommand } from "../../src/commands/AddCommand";
import { IMemory } from "../../src/interfaces/IMemory";
import { Memory } from "../../src/models/Memory";
import { CommandsInfo } from "../../src/commands/CommandsInfo";

describe("AddCommand", () => {
  let memory: IMemory;
  let command: AddCommand;

  beforeEach(() => {
    memory = new Memory(1000);
    command = new AddCommand();
  });

  describe("Command Properties", () => {
    it("should have correct opcode", () => {
      expect(command.opcode).toBe(CommandsInfo.ADD.opcode);
    });

    it("should have correct operand count", () => {
      expect(command.operandCount).toBe(CommandsInfo.ADD.operandCount);
    });
  });

  describe("Successful Execution", () => {
    it("should add two positive numbers", () => {
      memory.write(10, 100);
      memory.write(20, 200);

      const result = command.execute(memory, [10, 20, 30]);

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(false);
      expect(memory.read(30)).toBe(300);
    });

    it("should add zero to a number", () => {
      memory.write(10, 100);
      memory.write(20, 0);

      const result = command.execute(memory, [10, 20, 30]);

      expect(result.success).toBe(true);
      expect(memory.read(30)).toBe(100);
    });

    it("should add negative numbers", () => {
      memory.write(10, -50);
      memory.write(20, -30);

      const result = command.execute(memory, [10, 20, 30]);

      expect(result.success).toBe(true);
      expect(memory.read(30)).toBe(-80);
    });

    it("should add positive and negative numbers", () => {
      memory.write(10, 100);
      memory.write(20, -50);

      const result = command.execute(memory, [10, 20, 30]);

      expect(result.success).toBe(true);
      expect(memory.read(30)).toBe(50);
    });

    it("should write result to the same location as operand", () => {
      memory.write(10, 100);
      memory.write(20, 200);

      const result = command.execute(memory, [10, 20, 10]);

      expect(result.success).toBe(true);
      expect(memory.read(10)).toBe(300);
    });
  });

  describe("Error Handling", () => {
    it("should return error with no operands", () => {
      const result = command.execute(memory, []);

      expect(result.success).toBe(false);
      expect(result.shouldHalt).toBe(false);
      expect(result.error).toContain("requires 3 operands");
    });

    it("should return error with only 1 operand", () => {
      const result = command.execute(memory, [10]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("requires 3 operands");
    });

    it("should return error with only 2 operands", () => {
      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("requires 3 operands");
    });

    it("should return error with too many operands", () => {
      const result = command.execute(memory, [10, 20, 30, 40]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("requires 3 operands");
    });

    it("should return error when reading from invalid memory location", () => {
      memory.write(10, 100);

      const result = command.execute(memory, [10, 1002, 30]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Error executing Add command");
      expect(result.error).toContain("out of bounds");
    });

    it("should return error when writing to invalid memory location", () => {
      memory.write(10, 100);
      memory.write(20, 200);

      const result = command.execute(memory, [10, 20, 1002]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Error executing Add command");
      expect(result.error).toContain("out of bounds");
    });

    it("should return error when operand source is out of bounds", () => {
      memory.write(10, 100);

      const result = command.execute(memory, [0, 10, 30]);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Error executing Add command");
    });
  });

  describe("Edge Cases", () => {
    it("should handle large numbers", () => {
      memory.write(10, 1000000);
      memory.write(20, 2000000);

      const result = command.execute(memory, [10, 20, 30]);

      expect(result.success).toBe(true);
      expect(memory.read(30)).toBe(3000000);
    });

    it("should work at boundary memory locations", () => {
      memory.write(1, 50);
      memory.write(1000, 100);

      const result = command.execute(memory, [1, 1000, 500]);

      expect(result.success).toBe(true);
      expect(memory.read(500)).toBe(150);
    });
  });
});
