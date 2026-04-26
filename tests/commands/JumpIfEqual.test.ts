import { JumpIfEqualCommand } from "../../src/commands/JumpIfEqualCommand";
import { IMemory } from "../../src/interfaces/IMemory";
import { Memory } from "../../src/models/Memory";

describe("JumpIfEqualCommand", () => {
  let memory: IMemory;
  let command: JumpIfEqualCommand;

  beforeEach(() => {
    memory = new Memory(1000);
    command = new JumpIfEqualCommand();
  });

  describe("When values are equal", () => {
    it("should set newProgramCounter to jump location", () => {
      memory.write(10, 100);
      memory.write(20, 100);

      const result = command.execute(memory, [10, 20, 500]);

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(false);
      expect(result.newProgramCounter).toBe(500);
    });
  });

  describe("When values are not equal", () => {
    it("should not set newProgramCounter", () => {
      memory.write(10, 100);
      memory.write(20, 200);

      const result = command.execute(memory, [10, 20, 500]);

      expect(result.success).toBe(true);
      expect(result.shouldHalt).toBe(false);
      expect(result.newProgramCounter).toBeUndefined();
    });
  });
});
