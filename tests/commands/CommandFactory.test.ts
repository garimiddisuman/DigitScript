import { CommandFactory } from "../../src/commands/CommandFactory";
import { MoveCommand } from "../../src/commands/MoveCommand";
import { HaltCommand } from "../../src/commands/HaltCommand";
import { AddCommand } from "../../src/commands/AddCommand";
import { Memory } from "../../src/models/Memory";


describe("CommandFactory", () => {
  describe("createCommand", () => {
    it("should create AddCommand for opcode 1", () => {
      const command = CommandFactory.createCommand(1);

      expect(command).toBeInstanceOf(AddCommand);
      expect(command.opcode).toBe(1);
      expect(command.operandCount).toBe(3);
    });

    it("should create MoveCommand for opcode 7", () => {
      const command = CommandFactory.createCommand(7);

      expect(command).toBeInstanceOf(MoveCommand);
      expect(command.opcode).toBe(7);
      expect(command.operandCount).toBe(2);
    });

    it("should create HaltCommand for opcode 9", () => {
      const command = CommandFactory.createCommand(9);

      expect(command).toBeInstanceOf(HaltCommand);
      expect(command.opcode).toBe(9);
      expect(command.operandCount).toBe(0);
    });

    it("should throw error for unknown opcode", () => {
      expect(() => CommandFactory.createCommand(99)).toThrow(
        "Unknown command opcode: 99",
      );
    });

    it("should throw error for opcode 0", () => {
      expect(() => CommandFactory.createCommand(0)).toThrow(
        "Unknown command opcode: 0",
      );
    });

    it("should throw error for negative opcode", () => {
      expect(() => CommandFactory.createCommand(-1)).toThrow(
        "Unknown command opcode: -1",
      );
    });
  });

  describe("Command Singleton Behavior", () => {
    it("should return the same instance for repeated calls", () => {
      const command1 = CommandFactory.createCommand(7);
      const command2 = CommandFactory.createCommand(7);

      expect(command1).toBe(command2);
    });
  });

  describe("Created Commands Functionality", () => {
    it("should create functional MoveCommand", () => {
      const memory = new Memory(1000);
      const command = CommandFactory.createCommand(7);

      memory.write(10, 100);
      const result = command.execute(memory, [10, 20]);

      expect(result.success).toBe(true);
      expect(memory.read(20)).toBe(100);
    });

    it("should create functional AddCommand", () => {
      const memory = new Memory(1000);
      const command = CommandFactory.createCommand(1);

      memory.write(10, 50);
      memory.write(20, 100);
      const result = command.execute(memory, [10, 20, 30]);

      expect(result.success).toBe(true);
      expect(memory.read(30)).toBe(150);
    });

    it("should create functional HaltCommand", () => {
      const memory = new Memory(1000);
      const command = CommandFactory.createCommand(9);

      const result = command.execute(memory, []);

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(true);
    });
  });
});

describe("MoveCommand", () => {
  it("should copy value from source to destination", () => {
    const memory = new Memory(1000);
    const command = new MoveCommand();

    memory.write(10, 100);
    const result = command.execute(memory, [10, 20]);

    expect(result.success).toBe(true);
    expect(result.shouldHalt).toBe(false);
    expect(memory.read(20)).toBe(100);
  });

  it("should return error with invalid operand count", () => {
    const memory = new Memory(1000);
    const command = new MoveCommand();

    const result = command.execute(memory, [10]);

    expect(result.success).toBe(false);
    expect(result.error).toContain("requires 2 operands");
  });
});
