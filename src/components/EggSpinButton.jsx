import React from "react";

const EggSpinButton = ({ label, value, onChange, is_small, max, min = 0 }) => {
  const handleInputChange = (ev) => {
    const newValue = Math.max(
      min,
      Math.min(max || 99, Number(ev.target.value) || min)
    );
    onChange({ target: { value: newValue } });
  };

  const handleIncrement = () => {
    const newValue = Math.min(max || 99, value + (is_small ? 10 : 1));
    onChange({ target: { value: newValue } });
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - (is_small ? 10 : 1));
    onChange({ target: { value: newValue } });
  };

  return (
    <label>
      {label}
      <div className={`spin ${is_small ? "small" : ""}`}>
        <button
          onClick={handleDecrement}
          aria-label={`decrease ${label.toLowerCase()}`}
          disabled={value <= min}
        >
          −
        </button>
        <input
          type="number"
          min={min}
          max={max || 99}
          value={value}
          onChange={handleInputChange}
          aria-label={`${label} input`}
        />
        <button
          onClick={handleIncrement}
          aria-label={`increase ${label.toLowerCase()}`}
          disabled={value >= (max || 99)}
        >
          +
        </button>
      </div>
    </label>
  );
};

export default EggSpinButton;
