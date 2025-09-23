import React from "react";
import svgPath from "../assets/svg/svgPath";

const EggDisplay = ({
  remaining_seconds,
  progress,
  format_time,
  is_running,
  is_finished,
  onToggle,
  onRestart,
}) => {
  const yolk_scale = 0.6 + 0.4 * progress;
  const is_completed = remaining_seconds === 0 && is_finished;
  const is_final_countdown =
    remaining_seconds <= 10 && remaining_seconds > 0 && is_running;

  const handleClick = () => {
    if (is_completed && onRestart) {
      onRestart();
    } else {
      onToggle();
    }
  };

  return (
    <div className="egg-container" onClick={handleClick}>
      <div
        className={`egg-shell ${is_completed ? "finished" : ""} ${
          is_final_countdown ? "final-countdown" : ""
        }`}
      >
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <g dangerouslySetInnerHTML={{ __html: svgPath }} />
        </svg>
        <div className="yolk-wrapper">
          <div className="yolk" style={{ transform: `scale(${yolk_scale})` }} />
          <div className="time" aria-live="polite">
            {is_completed ? "DONE!" : format_time(remaining_seconds)}
          </div>
        </div>
        {is_running && (
          <div
            className="progress-ring"
            style={{
              "--progress": `${(1 - progress) * 100}%`,
            }}
          />
        )}
      </div>
      <div className="egg-hint">
        {is_completed
          ? "Click to restart"
          : `Click the egg to ${is_running ? "pause" : "start"}`}
      </div>
    </div>
  );
};

export default EggDisplay;
