import React, { useState } from "react";

interface ProgramInputProps {
  onLoad: (program: string) => void;
  onClear: () => void;
}

export const ProgramInput: React.FC<ProgramInputProps> = ({
  onLoad,
  onClear,
}) => {
  const [program, setProgram] = useState("");

  const handleLoad = () => {
    if (program.trim()) {
      onLoad(program);
    }
  };

  const handleClear = () => {
    setProgram("");
    onClear();
  };

  return (
    <div className="card program-input">
      <h2 className="card-title">Program Input</h2>
      <textarea
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        placeholder="Enter your DigitScript program here (e.g., 7 10 20 9)"
      />
      <div className="button-group">
        <button className="btn-primary" onClick={handleLoad}>
          Load Program
        </button>
        <button className="btn-danger" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};
