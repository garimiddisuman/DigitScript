class CommandInfo {
  public readonly opcode: number;
  public readonly operandCount: number;

  constructor(opcode: number, operandCount: number) {
    this.opcode = opcode;
    this.operandCount = operandCount;
  }
}

export class CommandsInfo {
  public static readonly HALT = new CommandInfo(9, 0);
  public static readonly MOVE = new CommandInfo(7, 2);
  public static readonly ADD = new CommandInfo(1, 3);
public static readonly JUMP_IF_EQUAL = new CommandInfo(4, 3);
}