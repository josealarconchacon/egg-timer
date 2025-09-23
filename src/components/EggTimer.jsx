import React from "react";
import { useEggTimer } from "../../hooks/useEggTimer";
import EggDisplay from "./EggDisplay";
import EggControl from "./EggControl";

const EggTimer = () => {
  // hook to manage the egg timer
  const {
    remaining_seconds,
    total_seconds,
    set_total_seconds,
    is_running,
    is_finished,
    progress,
    PRESETS,
    MIN_TIMER_SECONDS,
    formatTime,
    start_timer,
    stop_timer,
    reset_timer,
    restart_timer,
    set_preset,
    add_seconds,
  } = useEggTimer();

  return (
    <div className="egg-timer-wrapper">
      <div className="timer-section">
        <EggDisplay
          remaining_seconds={remaining_seconds}
          progress={progress}
          format_time={formatTime}
          is_running={is_running}
          is_finished={is_finished}
          onToggle={is_running ? stop_timer : start_timer}
          onRestart={restart_timer}
        />
        <div className="right">
          <EggControl
            total_seconds={total_seconds}
            set_total_seconds={set_total_seconds}
            add_seconds={add_seconds}
            is_running={is_running}
            is_finished={is_finished}
            start_timer={start_timer}
            stop_timer={stop_timer}
            reset_timer={reset_timer}
            restart_timer={restart_timer}
            PRESETS={PRESETS}
            MIN_TIMER_SECONDS={MIN_TIMER_SECONDS}
            set_preset={set_preset}
          />
        </div>
      </div>
      <div className="cooking-guide">
        <div className="guide-header">
          <span className="guide-icon">🥚</span>
          <h3>Perfect Egg Cooking Guide</h3>
        </div>

        <div className="guide-sections">
          <div className="guide-section critical">
            <div className="section-header">
              <span className="section-icon">⚠️</span>
              <h4>Critical Timing</h4>
            </div>
            <p>
              Start the timer <strong>once water is boiling</strong>, not when
              you put eggs in!
            </p>
          </div>

          <div className="guide-section">
            <div className="section-header">
              <span className="section-icon">💧</span>
              <h4>Water Level</h4>
            </div>
            <p>Water should cover eggs by 1 inch (2.5 cm)</p>
          </div>

          <div className="guide-section">
            <div className="section-header">
              <span className="section-icon">📏</span>
              <h4>Egg Size</h4>
            </div>
            <p>
              Large eggs are standard. Adjust 1 minute for smaller and larger
              eggs
            </p>
          </div>

          <div className="guide-section">
            <div className="section-header">
              <span className="section-icon">🌡️</span>
              <h4>Temperature</h4>
            </div>
            <p>
              Room temperature eggs cook slightly faster than fridge cold eggs
            </p>
          </div>

          <div className="guide-section">
            <div className="section-header">
              <span className="section-icon">🔊</span>
              <h4>Audio Cues</h4>
            </div>
            <p>Progressive beeps during the last 10 seconds</p>
          </div>

          <div className="guide-section">
            <div className="section-header">
              <span className="section-icon">👆</span>
              <h4>Controls</h4>
            </div>
            <p>Click the egg to start/pause, or use the buttons below</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EggTimer;
