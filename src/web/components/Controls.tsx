import React from "react";

interface ControlsProps {
  onStep: () => void;
  onRun: () => void;
  onUndo: () => void;
  onReset: () => void;
  canStep: boolean;
  canRun: boolean;
  canUndo: boolean;
  canReset: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onStep,
  onRun,
  onUndo,
  onReset,
  canStep,
  canRun,
  canUndo,
  canReset,
}) => {
  return (
    <div className="card controls">
      <h2 className="card-title">Controls</h2>
      <div className="button-grid">
        <button
          className="btn-secondary"
          onClick={onReset}
          disabled={!canReset}
        >
          ⏮ Reset
        </button>
        <button className="btn-secondary" onClick={onUndo} disabled={!canUndo}>
          ◀ Undo
        </button>
        <button className="btn-primary" onClick={onStep} disabled={!canStep}>
          Step ▶
        </button>
        <button className="btn-success" onClick={onRun} disabled={!canRun}>
          Run ▶▶
        </button>
      </div>
    </div>
  );
};
