import { useEffect, useState, useRef } from "react";

// options for the egg timer
const PRESETS = [
  { name: "Soft", seconds: 360 },
  { name: "Medium", seconds: 480 },
  { name: "Hard", seconds: 600 },
];

// format the time in minutes and seconds
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remaining_seconds = seconds % 60;
  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(minutes)}: ${pad(remaining_seconds)}`;
};

// hook to manage the egg timer
export const useEggTimer = () => {
  const initial_seconds = PRESETS[0].seconds;
  const [total_seconds, set_total_seconds] = useState(initial_seconds);
  const [remaining_seconds, set_remaining_seconds] = useState(total_seconds);
  const [is_running, set_is_running] = useState(false);
  const interval_ref = useRef(null);

  useEffect(() => {
    set_remaining_seconds(total_seconds);
  }, [total_seconds]);

  // start the timer
  const start_timer = () => {
    if (!is_running) {
      set_is_running(true);
      interval_ref.current = setInterval(() => {
        set_remaining_seconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval_ref.current);
            set_is_running(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // stop the timer
  const stop_timer = () => {
    if (is_running) {
      clearInterval(interval_ref.current);
      set_is_running(false);
    }
  };

  // reset the timer
  const reset_timer = () => {
    stop_timer();
    set_total_seconds(initial_seconds);
  };

  const set_preset = (seconds) => {
    stop_timer();
    set_total_seconds(seconds);
  };

  const add_seconds = (seconds) => {
    stop_timer();
    set_total_seconds((prev) => Math.max(0, prev + seconds));
  };

  const set_progress = remaining_seconds / total_seconds;

  return {
    remaining_seconds,
    total_seconds,
    is_running,
    set_progress,
    PRESETS,
    formatTime,
    start_timer,
    stop_timer,
    reset_timer,
    set_preset,
    add_seconds,
  };
};
