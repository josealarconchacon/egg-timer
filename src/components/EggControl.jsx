import React from "react";

const EggControl = ({
  total_seconds,
  set_total_seconds,
  add_seconds,
  is_running,
  start_timer,
  stop_timer,
  reset_timer,
  PRESETS,
  set_preset,
}) => {
  return (
    <div>
      <div className="right">
        <div className="control">
          <PresetButtons
            preset={PRESETS}
            total_seconds={total_seconds}
            set_preset={set_preset}
          />
          <div className="custom">
            <SpinButton
              label="Minutes"
              value={Math.round(total_seconds % 60)}
              onChange={(ev) => {
                const sec = Math.max(0, Math.min(59, Number(ev.target.value)));
                const mins = Math.floor(total_seconds / 60);
                set_total_seconds(mins * 60 + sec);
              }}
              onIncrement={() => add_seconds(10)}
              onDecrement={() => add_seconds(-10)}
            />
          </div>
          <div className="buttons">
            <button
              className="start"
              onClick={() => (is_running ? stop_timer() : start_timer())}
            >
              {is_running ? "Pause" : "Start"}
            </button>
            <button className="reset" onClick={reset_timer}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EggControl;
