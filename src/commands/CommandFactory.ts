import { ICommand } from "../interfaces/ICommand";
import { MoveCommand } from "./MoveCommand";
import { HaltCommand } from "./HaltCommand";
import { AddCommand } from "./AddCommand";
import { CommandsInfo } from "./CommandsInfo";
import { JumpIfEqualCommand } from "./JumpIfEqualCommand";

export class CommandFactory {
  private static commands: Map<number, ICommand> = new Map<number, ICommand>([
    [CommandsInfo.ADD.opcode, new AddCommand()],
    [CommandsInfo.MOVE.opcode, new MoveCommand()],
    [CommandsInfo.HALT.opcode, new HaltCommand()],
    [CommandsInfo.JUMP_IF_EQUAL.opcode, new JumpIfEqualCommand()],
  ]);

  static createCommand(opcode: number): ICommand {
    const command = this.commands.get(opcode);

    if (!command) {
      throw new Error(`Unknown command opcode: ${opcode}`);
    }

    return command;
  }
}
