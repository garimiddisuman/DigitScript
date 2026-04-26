import { IMemory } from "../interfaces/IMemory";

export class Memory implements IMemory {
  private memory: Int32Array;
  private static readonly MEMORY_START = 1;

  constructor(size : number) {
    this.memory = new Int32Array(size + Memory.MEMORY_START);
  }

  read(location: number): number {
    if (location < Memory.MEMORY_START || location >= this.memory.length) {
      throw new Error(
        `Memory access out of bounds: ${location} (valid range: ${Memory.MEMORY_START}-${this.memory.length})`,
      );
    }
    
    return this.memory[location];
  }

  write(location: number, value: number): void {
    if (location < Memory.MEMORY_START || location > this.memory.length) {
      throw new Error(
        `Memory access out of bounds: ${location} (valid range: ${Memory.MEMORY_START}-${this.memory.length})`,
      );
    }

    this.memory[location] = value;
  }

  reset(): void {
    this.memory.fill(0);
  }

  getSnapshot(): number[] {
    return [...Array.from(this.memory)];
  }

  restoreSnapshot(snapshot: number[]): void {
    if (snapshot.length !== this.memory.length) {
      throw new Error(
        `Snapshot size mismatch: expected ${this.memory.length}, got ${snapshot.length}`,
      );
    }

    this.memory.set(snapshot);
  }
}
