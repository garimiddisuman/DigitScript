export interface IMemory {
  read(location: number): number;
  write(location: number, value: number): void;
  reset(): void;
  getSnapshot(): number[];
  restoreSnapshot(snapshot: number[]): void;
}