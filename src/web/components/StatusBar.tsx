import React from "react";

interface StatusBarProps {
  programCounter: number;
  stepCount: number;
  isHalted: boolean;
  loaded: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  programCounter,
  stepCount,
  isHalted,
  loaded,
}) => {
  const getStatus = () => {
    if (!loaded) return "No Program";
    if (isHalted) return "Halted";
    if (stepCount === 0) return "Ready";
    return "Running";
  };

  const getStatusClass = () => {
    if (!loaded) return "error";
    if (isHalted) return "halted";
    if (stepCount === 0) return "ready";
    return "running";
  };

  return (
    <div className="card">
      <h2 className="card-title">Status</h2>
      <div className="status-bar">
        <div className="status-item">
          <div className="status-label">Program Counter</div>
          <div className="status-value">{programCounter}</div>
        </div>
        <div className="status-item">
          <div className="status-label">Step Count</div>
          <div className="status-value">{stepCount}</div>
        </div>
        <div className="status-item">
          <div className="status-label">State</div>
          <div className={`status-value ${getStatusClass()}`}>
            {getStatus()}
          </div>
        </div>
      </div>
    </div>
  );
};
