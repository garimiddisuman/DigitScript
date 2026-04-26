import { Memory } from "../../src/models/Memory";
import { IMemory } from "../../src/interfaces/IMemory";

describe("Memory", () => {
  let memory: IMemory;

  beforeEach(() => {
    memory = new Memory(1000);
  });

  describe("Initialization", () => {
    it("should initialize all memory locations to 0", () => {
      expect(memory.read(1)).toBe(0);
      expect(memory.read(500)).toBe(0);
      expect(memory.read(1000)).toBe(0);
    });
  });

  describe("Write Operation", () => {
    it("should write a value to a valid memory location", () => {
      memory.write(1, 100);
      expect(memory.read(1)).toBe(100);
    });

    it("should write multiple values to different locations", () => {
      memory.write(1, 100);
      memory.write(500, 200);
      memory.write(1000, 300);

      expect(memory.read(1)).toBe(100);
      expect(memory.read(500)).toBe(200);
      expect(memory.read(1000)).toBe(300);
    });

    it("should throw error when writing to location 0", () => {
      expect(() => memory.write(0, 100)).toThrow(
        "Memory access out of bounds: 0",
      );
    });

    it("should throw error when writing to location 1001", () => {
      expect(() => memory.write(1001, 100)).toThrow(
        "Memory access out of bounds: 1001 (valid range: 1-1000)",
      );
    });

    it("should throw error when writing to negative location", () => {
      expect(() => memory.write(-5, 100)).toThrow(
        "Memory access out of bounds: -5",
      );
    });
  });

  describe("Read Operation", () => {
    it("should read a value from a valid memory location", () => {
      memory.write(10, 999);
      expect(memory.read(10)).toBe(999);
    });

    it("should throw error when reading from location 0", () => {
      expect(() => memory.read(0)).toThrow(
        "Memory access out of bounds: 0 (valid range: 1-1000)",
      );
    });

    it("should throw error when reading from location 1001", () => {
      expect(() => memory.read(1001)).toThrow(
        "Memory access out of bounds: 1001 (valid range: 1-1000)",
      );
    });

    it("should throw error when reading from negative location", () => {
      expect(() => memory.read(-10)).toThrow(
        "Memory access out of bounds: -10",
      );
    });
  });

  describe("Reset Operation", () => {
    it("should reset all memory locations to 0", () => {
      memory.write(1, 100);
      memory.write(500, 200);
      memory.write(1000, 300);

      memory.reset();

      expect(memory.read(1)).toBe(0);
      expect(memory.read(500)).toBe(0);
      expect(memory.read(1000)).toBe(0);
    });
  });

  describe("Snapshot Operation", () => {
    it("should create a snapshot of current memory state", () => {
      memory.write(1, 100);
      memory.write(10, 200);

      const snapshot = memory.getSnapshot();

      expect(snapshot[1]).toBe(100); // location 1 maps to index 1
      expect(snapshot[10]).toBe(200); // location 10 maps to index 10
      expect(snapshot.length).toBe(1001);
    });

    it("should create independent copy (modifying original does not affect snapshot)", () => {
      memory.write(1, 100);
      const snapshot = memory.getSnapshot();

      memory.write(1, 999);
      expect(snapshot[1]).toBe(100); // Snapshot should remain unchanged
      expect(memory.read(1)).toBe(999); // Memory changed
    });
  });

  describe("Restore Operation", () => {
    it("should restore memory from a snapshot", () => {
      memory.write(1, 100);
      memory.write(10, 200);

      const snapshot = memory.getSnapshot();

      memory.write(1, 100);
      memory.write(10, 200);

      memory.restoreSnapshot(snapshot);

      expect(memory.read(1)).toBe(100);
      expect(memory.read(10)).toBe(200);
    });

    it("should throw error when snapshot size does not match memory size", () => {
      const invalidSnapshot = [1, 2, 3]; // Only 3 elements

      expect(() => memory.restoreSnapshot(invalidSnapshot)).toThrow(
        "Snapshot size mismatch",
      );
    });
  });
});
