import React, { useState } from "react";

interface HelpProps {
  isOpen: boolean;
  onClose: () => void;
  maxCells: number;
  onMaxCellsChange: (value: number) => void;
}

export const Help: React.FC<HelpProps> = ({
  isOpen,
  onClose,
  maxCells,
  onMaxCellsChange,
}) => {
  const [activeTab, setActiveTab] = useState<"instructions" | "settings">(
    "instructions",
  );

  if (!isOpen) return null;

  const exampleProgram = `// Example 1: Simple Addition
// Add two numbers at locations 991 and 992, store result in 993
7 991 1
7 992 2
1 991 992 993
9

// Example 2: Conditional Logic
// Jump if two values are equal
7 901 5
7 902 5
4 901 902 7  // Jump to location 7 if equal
9

// Example 3: Loop Counter
// Count from 0 to 3
7 801 0      // Counter at 801
7 802 1      // Increment value
7 803 3      // Max value
1 801 802 801 // Increment counter
4 801 803 11  // If counter == max, jump to 11
4 1 1 5       // Always jump to 5 (loop)
9             // Halt`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Help & Settings</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "instructions" ? "active" : ""}`}
            onClick={() => setActiveTab("instructions")}
          >
            📖 Instructions
          </button>
          <button
            className={`tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "instructions" && (
            <div className="instructions">
              <h3>DigitScript Instructions</h3>

              <div className="instruction-section">
                <h4>Available Commands</h4>
                <ul>
                  <li>
                    <strong>1 loc1 loc2 loc3</strong> - ADD: Add values at loc1
                    and loc2, store result in loc3
                  </li>
                  <li>
                    <strong>7 loc value</strong> - MOVE: Store value at location
                    loc
                  </li>
                  <li>
                    <strong>4 loc1 loc2 target</strong> - JUMP IF EQUAL: If
                    values at loc1 and loc2 are equal, jump to target location
                  </li>
                  <li>
                    <strong>9</strong> - HALT: Stop execution
                  </li>
                </ul>
              </div>

              <div className="instruction-section">
                <h4>Memory Locations</h4>
                <p>Memory locations range from 1 to 1000.</p>
                <p>Each location can store an integer value.</p>
              </div>

              <div className="instruction-section">
                <h4>Example Programs</h4>
                <pre className="code-example">{exampleProgram}</pre>
              </div>

              <div className="instruction-section">
                <h4>How to Use</h4>
                <ol>
                  <li>Enter your program in the text area</li>
                  <li>Click "Load Program" to parse and load it</li>
                  <li>Use "Step" to execute one instruction at a time</li>
                  <li>Use "Run" to execute until halt</li>
                  <li>Use "Undo" to step backward</li>
                  <li>Use "Reset" to return to start</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="settings">
              <h3>Settings</h3>

              <div className="setting-item">
                <label htmlFor="max-cells">
                  Memory Cells to Display (1-1000):
                </label>
                <div className="setting-control">
                  <input
                    type="number"
                    id="max-cells"
                    min="10"
                    max="1000"
                    step="10"
                    value={maxCells}
                    onChange={(e) =>
                      onMaxCellsChange(
                        Math.max(
                          10,
                          Math.min(1000, parseInt(e.target.value) || 100),
                        ),
                      )
                    }
                  />
                  <span className="setting-hint">
                    Currently showing first {maxCells} cells
                  </span>
                </div>
              </div>

              <div className="setting-info">
                <p>
                  💡 <strong>Tip:</strong> Reduce cell count for better
                  performance with large programs.
                </p>
                <p>The memory grid displays cells with color coding:</p>
                <ul>
                  <li>
                    <span style={{ color: "#27ae60" }}>Green</span> = Opcode
                    (command)
                  </li>
                  <li>
                    <span style={{ color: "#3498db" }}>Blue</span> = Operand
                    (parameter)
                  </li>
                  <li>
                    <span style={{ color: "#999" }}>Gray</span> = Unused
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
