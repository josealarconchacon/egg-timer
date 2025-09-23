import React from "react";

const EggPressetButtons = ({ presets, total_seconds, set_preset }) => {
  return (
    <div className="presets">
      {presets.map((p) => (
        <button
          key={p.name}
          className="preset"
          onClick={() => set_preset(p.seconds)}
          aria-pressed={total_seconds === p.seconds}
          title={p.description}
        >
          {p.name}{" "}
          <span className="small">({Math.floor(p.seconds / 60)}m)</span>
        </button>
      ))}
    </div>
  );
};

export default EggPressetButtons;
