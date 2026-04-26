import React, { useState } from "react";
import { ProgramController } from "../controllers/ProgramController";
import { ProgramInput } from "./components/ProgramInput";
import { Controls } from "./components/Controls";
import { StatusBar } from "./components/StatusBar";
import { MemoryGrid } from "./components/MemoryGrid";
import { Help } from "./components/Help";

export const App: React.FC = () => {
  const [controller] = useState(() => new ProgramController());
  const [, forceUpdate] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [maxCells, setMaxCells] = useState(100);

  const refresh = () => forceUpdate({});

  const handleLoadProgram = (program: string) => {
    try {
      controller.loadProgram(program);
      setError(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleClear = () => {
    controller.clear();
    setError(null);
    refresh();
  };

  const handleStep = () => {
    try {
      controller.step();
      setError(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleRun = () => {
    try {
      controller.run();
      setError(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleUndo = () => {
    try {
      controller.undo();
      setError(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleReset = () => {
    try {
      controller.reset();
      setError(null);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const info = controller.getProgramInfo();

  return (
    <div className="app">
      <header className="header">
        <h1>DigitScript Interpreter</h1>
        <button className="help-button" onClick={() => setIsHelpOpen(true)}>
          ❓ Help
        </button>
      </header>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="main-container">
        <div className="left-panel">
          <ProgramInput onLoad={handleLoadProgram} onClear={handleClear} />
          <Controls
            onStep={handleStep}
            onRun={handleRun}
            onUndo={handleUndo}
            onReset={handleReset}
            canStep={info.loaded && !info.isHalted}
            canRun={info.loaded && !info.isHalted}
            canUndo={info.canUndo}
            canReset={info.loaded}
          />
          <StatusBar
            programCounter={info.currentInstruction}
            stepCount={info.stepCount}
            isHalted={info.isHalted}
            loaded={info.loaded}
          />
        </div>

        <MemoryGrid
          controller={controller}
          programCounter={info.currentInstruction}
          maxCells={maxCells}
        />
      </div>

      <Help
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        maxCells={maxCells}
        onMaxCellsChange={setMaxCells}
      />
    </div>
  );
};
