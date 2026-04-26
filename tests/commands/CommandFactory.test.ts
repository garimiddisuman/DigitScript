import { CommandFactory } from "../../src/commands/CommandFactory";
import { MoveCommand } from "../../src/commands/MoveCommand";
import { HaltCommand } from "../../src/commands/HaltCommand";
import { AddCommand } from "../../src/commands/AddCommand";
import { JumpIfEqualCommand } from "../../src/commands/JumpIfEqualCommand";

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

    it("should create JumpIfEqualCommand for opcode 4", () => {
      const command = CommandFactory.createCommand(4);

      expect(command).toBeInstanceOf(JumpIfEqualCommand);
      expect(command.opcode).toBe(4);
      expect(command.operandCount).toBe(3);
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
});
