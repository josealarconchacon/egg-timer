import { useEffect, useState, useRef, useCallback, useMemo } from "react";

// options for the egg timer
const PRESETS = [
  { name: "Soft", seconds: 270, description: "4-5 min (runny yolk)" },
  { name: "Medium", seconds: 390, description: "6-7 min (jammy yolk)" },
  { name: "Hard", seconds: 630, description: "9-12 min (fully set)" },
];

// minimum timer duration, 30 seconds
const MIN_TIMER_SECONDS = 30;

// format the time in minutes and seconds
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remaining_seconds = seconds % 60;
  const pad = (num) => String(num).padStart(2, "0");
  return `${pad(minutes)}:${pad(remaining_seconds)}`;
};

// audio context for sounds
const createBeepSound = (frequency = 800, duration = 200) => {
  try {
    // check if audio is supported
    if (!window.AudioContext && !window.webkitAudioContext) {
      console.warn("Web Audio API not supported");
      return;
    }

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(console.warn);
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.warn("Audio not supported:", error);
  }
};

// alarm sound for timer completion
const createAlarmSound = () => {
  try {
    // check if audio is supported
    if (!window.AudioContext && !window.webkitAudioContext) {
      console.warn("Web Audio API not supported");
      return;
    }

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(console.warn);
    }

    // sequence of beeps for the alarm
    const playBeep = (frequency, duration, delay = 0) => {
      setTimeout(() => {
        try {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = frequency;
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + duration / 1000
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration / 1000);
        } catch (beepError) {
          console.warn("Error playing beep:", beepError);
        }
      }, delay);
    };

    playBeep(1000, 400, 0);
    playBeep(800, 400, 500);
    playBeep(1000, 400, 1000);
    playBeep(800, 400, 1500);
    playBeep(1000, 600, 2000);
  } catch (error) {
    console.warn("Audio not supported:", error);
  }
};

// hook to manage the egg timer
export const useEggTimer = () => {
  const initial_seconds = PRESETS[0].seconds;
  const [total_seconds, set_total_seconds] = useState(initial_seconds);
  const [remaining_seconds, set_remaining_seconds] = useState(total_seconds);
  const [is_running, set_is_running] = useState(false);
  const [is_finished, set_is_finished] = useState(false);
  const interval_ref = useRef(null);
  const beep_timeout_ref = useRef(null);

  // cleanup function
  const cleanup = useCallback(() => {
    if (interval_ref.current) {
      clearInterval(interval_ref.current);
      interval_ref.current = null;
    }
    if (beep_timeout_ref.current) {
      clearTimeout(beep_timeout_ref.current);
      beep_timeout_ref.current = null;
    }
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    set_remaining_seconds(total_seconds);
    set_is_finished(false);
  }, [total_seconds]);

  // handle timer completion
  const handleTimerCompletion = useCallback(() => {
    cleanup();
    set_is_running(false);
    set_is_finished(true);
    set_remaining_seconds(0);

    // final alarm sound (more prominent sequence)
    setTimeout(() => {
      createAlarmSound();
    }, 100);
  }, [cleanup]);

  // start the timer
  const start_timer = useCallback(() => {
    if (
      !is_running &&
      remaining_seconds > 0 &&
      remaining_seconds >= MIN_TIMER_SECONDS
    ) {
      set_is_running(true);
      set_is_finished(false);

      interval_ref.current = setInterval(() => {
        set_remaining_seconds((prev) => {
          const new_seconds = prev - 1;

          // progressive beeps in last 10 seconds of timer
          if (new_seconds <= 10 && new_seconds > 0) {
            createBeepSound(600, 150);
          }

          if (new_seconds <= 0) {
            handleTimerCompletion();
            return 0;
          }
          return new_seconds;
        });
      }, 1000);
    }
  }, [is_running, remaining_seconds, handleTimerCompletion]);

  // stop the timer
  const stop_timer = useCallback(() => {
    if (is_running) {
      cleanup();
      set_is_running(false);
    }
  }, [is_running, cleanup]);

  // reset the timer
  const reset_timer = useCallback(() => {
    cleanup();
    set_is_running(false);
    set_is_finished(false);
    set_total_seconds(initial_seconds);
    set_remaining_seconds(initial_seconds);
  }, [cleanup, initial_seconds]);

  // restart timer after completion
  const restart_timer = useCallback(() => {
    if (is_finished) {
      set_is_finished(false);
      set_remaining_seconds(total_seconds);
      start_timer();
    }
  }, [is_finished, total_seconds, start_timer]);

  const set_preset = useCallback(
    (seconds) => {
      stop_timer();
      const new_seconds = Math.max(MIN_TIMER_SECONDS, seconds);
      set_total_seconds(new_seconds);
      set_remaining_seconds(new_seconds);
    },
    [stop_timer]
  );

  const add_seconds = useCallback(
    (seconds) => {
      stop_timer();
      set_total_seconds((prev) => {
        const new_seconds = Math.max(MIN_TIMER_SECONDS, prev + seconds);
        set_remaining_seconds(new_seconds);
        return new_seconds;
      });
    },
    [stop_timer]
  );

  const set_custom_seconds = useCallback(
    (seconds) => {
      stop_timer();
      const new_seconds = Math.max(MIN_TIMER_SECONDS, seconds);
      set_total_seconds(new_seconds);
      set_remaining_seconds(new_seconds);
    },
    [stop_timer]
  );

  const progress = useMemo(() => {
    return total_seconds > 0 ? remaining_seconds / total_seconds : 0;
  }, [total_seconds, remaining_seconds]);

  return {
    remaining_seconds,
    total_seconds,
    set_total_seconds: set_custom_seconds,
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
  };
};
