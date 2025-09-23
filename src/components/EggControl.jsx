import React from "react";
import EggPressetButtons from "./EggPressetButtons";
import EggSpinButton from "./EggSpinButton";

const EggControl = ({
  total_seconds,
  set_total_seconds,
  is_running,
  is_finished,
  start_timer,
  stop_timer,
  reset_timer,
  restart_timer,
  PRESETS,
  MIN_TIMER_SECONDS,
  set_preset,
}) => {
  return (
    <div>
      <div className="right">
        <div className="control">
          <EggPressetButtons
            presets={PRESETS}
            total_seconds={total_seconds}
            set_preset={set_preset}
          />
          <div className="custom">
            <EggSpinButton
              label="Minutes"
              value={Math.floor((total_seconds || 0) / 60)}
              onChange={(ev) => {
                const mins = Number(ev.target.value);
                const secs = (total_seconds || 0) % 60;
                const new_total = mins * 60 + secs;
                set_total_seconds(Math.max(MIN_TIMER_SECONDS, new_total));
              }}
              max={99}
              min={0}
            />
            <EggSpinButton
              label="Seconds"
              value={(total_seconds || 0) % 60}
              is_small={true}
              onChange={(ev) => {
                const secs = Number(ev.target.value);
                const mins = Math.floor((total_seconds || 0) / 60);
                const new_total = mins * 60 + secs;
                set_total_seconds(Math.max(MIN_TIMER_SECONDS, new_total));
              }}
              max={59}
              min={0}
            />
          </div>
          <div className="buttons">
            <button
              className={`start ${is_running ? "pause" : ""} ${
                is_finished ? "finished" : ""
              }`}
              onClick={() => {
                if (is_finished) {
                  restart_timer();
                } else if (is_running) {
                  stop_timer();
                } else {
                  start_timer();
                }
              }}
              disabled={!is_finished && total_seconds < MIN_TIMER_SECONDS}
            >
              {is_finished ? "Restart" : is_running ? "Pause" : "Start"}
            </button>
            {!is_finished && (
              <button className="reset" onClick={reset_timer}>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EggControl;
