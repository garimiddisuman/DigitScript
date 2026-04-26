import React from "react";
import { IProgramController } from "../../interfaces/IProgramController";
import { CommandsInfo } from "../../commands/CommandsInfo";

interface MemoryGridProps {
  controller: IProgramController;
  programCounter: number;
  maxCells: number;
}

export const MemoryGrid: React.FC<MemoryGridProps> = ({
  controller,
  programCounter,
  maxCells,
}) => {
  const startLocation = 1;
  const endLocation = maxCells;

  const getOperandCount = (opcode: number): number => {
    const commandMap: Record<number, number> = {
      [CommandsInfo.HALT.opcode]: CommandsInfo.HALT.operandCount,
      [CommandsInfo.MOVE.opcode]: CommandsInfo.MOVE.operandCount,
      [CommandsInfo.ADD.opcode]: CommandsInfo.ADD.operandCount,
      [CommandsInfo.JUMP_IF_EQUAL.opcode]:
        CommandsInfo.JUMP_IF_EQUAL.operandCount,
    };
    return commandMap[opcode] ?? 0;
  };

  let operandStart = 0;
  let operandEnd = 0;
  try {
    const opcode = controller.getMemoryValue(programCounter);
    const operandCount = getOperandCount(opcode);
    operandStart = programCounter + 1;
    operandEnd = programCounter + operandCount;
  } catch {
    // Ignore errors
  }

  const renderMemoryCells = () => {
    const cells = [];
    for (let loc = startLocation; loc <= endLocation; loc++) {
      let value: number;
      try {
        value = controller.getMemoryValue(loc);
      } catch {
        value = 0;
      }

      const isOpcode = loc === programCounter;
      const isOperand = loc >= operandStart && loc <= operandEnd;

      let className = "memory-cell";
      if (isOpcode) className += " opcode";
      else if (isOperand) className += " operand";

      cells.push(
        <div key={loc} className="memory-cell-container">
          <div className={className}>
            <div className="memory-value">{value}</div>
          </div>
          <div className="memory-location">{loc}</div>
        </div>,
      );
    }
    return cells;
  };

  return (
    <div className="card memory-card">
      <h2 className="card-title">
        Memory View (Locations {startLocation}-{endLocation})
      </h2>
      <div className="memory-grid-wrapper">
        <div className="memory-grid">{renderMemoryCells()}</div>
      </div>
      <div className="legend">
        <div className="legend-item">
          <div className="legend-box opcode"></div>
          <span>Opcode</span>
        </div>
        <div className="legend-item">
          <div className="legend-box operand"></div>
          <span>Operand</span>
        </div>
      </div>
    </div>
  );
};
