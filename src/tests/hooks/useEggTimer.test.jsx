import { renderHook, act } from "@testing-library/react";
import { useEggTimer } from "../../../hooks/useEggTimer";

//mock audio context
const mockAudioContext = {
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    frequency: { value: 0 },
    type: "sine",
    start: jest.fn(),
    stop: jest.fn(),
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
  })),
  destination: {},
  currentTime: 0,
  state: "running",
  resume: jest.fn().mockResolvedValue(),
};

Object.defineProperty(window, "AudioContext", {
  writable: true,
  value: jest.fn(() => mockAudioContext),
});

Object.defineProperty(window, "webkitAudioContext", {
  writable: true,
  value: jest.fn(() => mockAudioContext),
});

const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

describe("useEggTimer", () => {
  let hookResult;
  let result;

  beforeEach(() => {
    // reset all mocks
    jest.clearAllMocks();
    jest.useFakeTimers();

    console.warn = jest.fn();
    console.error = jest.fn();

    hookResult = renderHook(() => useEggTimer());
    result = hookResult.result;
  });

  afterEach(() => {
    jest.useRealTimers();
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
    hookResult.unmount();
  });

  describe("initialization", () => {
    test("should initialize with default values", () => {
      expect(result.current.is_running).toBe(false);
      expect(result.current.is_finished).toBe(false);
      expect(result.current.remaining_seconds).toBe(270); // Default Soft preset
      expect(result.current.total_seconds).toBe(270);
      expect(result.current.progress).toBe(1);
    });

    test("should provide all expected properties and methods", () => {
      expectedProperties.forEach((prop) => {
        expect(result.current).toHaveProperty(prop);
      });
    });

    test("should provide correct preset values", () => {
      const presets = result.current.PRESETS;
      expect(presets).toHaveLength(3);
      expect(presets[0]).toEqual({
        name: "Soft",
        seconds: 270,
        description: "4-5 min (runny yolk)",
      });
      expect(presets[1]).toEqual({
        name: "Medium",
        seconds: 390,
        description: "6-7 min (jammy yolk)",
      });
      expect(presets[2]).toEqual({
        name: "Hard",
        seconds: 630,
        description: "9-12 min (fully set)",
      });
    });

    test("should have correct minimum timer seconds", () => {
      expect(result.current.MIN_TIMER_SECONDS).toBe(30);
    });
  });

  describe("formatTime", () => {
    test("should format time correctly for various inputs", () => {
      testCases.forEach(({ input, expected }) => {
        expect(result.current.formatTime(input)).toBe(expected);
      });
    });
  });

  describe("timer control", () => {
    describe("start_timer", () => {
      test("should start timer when conditions are met", () => {
        act(() => {
          result.current.set_preset(60);
        });

        act(() => {
          result.current.start_timer();
        });

        expect(result.current.is_running).toBe(true);
        expect(result.current.is_finished).toBe(false);
      });

      test("should not start timer when already running", () => {
        act(() => {
          result.current.set_preset(60);
          result.current.start_timer();
        });

        const initialRemaining = result.current.remaining_seconds;

        act(() => {
          result.current.start_timer();
        });

        expect(result.current.is_running).toBe(true);
        act(() => {
          jest.advanceTimersByTime(1000);
        });

        expect(result.current.remaining_seconds).toBeLessThan(initialRemaining);
      });

      test("should not start timer when remaining seconds is below minimum", () => {
        act(() => {
          result.current.set_preset(10); // below minimum - will be set to 30
        });

        act(() => {
          result.current.set_total_seconds(30);
        });

        expect(result.current.is_running).toBe(false);
      });

      test("should countdown timer correctly", () => {
        act(() => {
          result.current.set_preset(30); // use minimum allowed time
          result.current.start_timer();
        });
        act(() => {
          jest.advanceTimersByTime(2000);
        });

        expect(result.current.remaining_seconds).toBe(28);
        expect(result.current.progress).toBeCloseTo(28 / 30, 2);
      });

      test("should complete timer and trigger alarm", () => {
        act(() => {
          result.current.set_preset(30); // use minimum time
          result.current.start_timer();
        });
        act(() => {
          jest.advanceTimersByTime(30000);
        });

        expect(result.current.is_running).toBe(false);
        expect(result.current.is_finished).toBe(true);
        expect(result.current.remaining_seconds).toBe(0);
        expect(result.current.progress).toBe(0);

        // verify audio context was called for alarm
        expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      });

      test("should play beeps in last 10 seconds", () => {
        act(() => {
          result.current.set_preset(30); // Use minimum time
          result.current.start_timer();
        });
        act(() => {
          jest.advanceTimersByTime(20000);
        });
        expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      });
    });

    describe("stop_timer", () => {
      test("should stop running timer", () => {
        act(() => {
          result.current.set_preset(60);
          result.current.start_timer();
        });
        expect(result.current.is_running).toBe(true);
        act(() => {
          result.current.stop_timer();
        });

        expect(result.current.is_running).toBe(false);
      });

      test("should not affect stopped timer", () => {
        expect(result.current.is_running).toBe(false);

        act(() => {
          result.current.stop_timer();
        });

        expect(result.current.is_running).toBe(false);
      });
    });

    describe("reset_timer", () => {
      test("should reset timer to initial state", () => {
        // set custom time and start timer
        act(() => {
          result.current.set_preset(60);
          result.current.start_timer();
        });
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        // reset
        act(() => {
          result.current.reset_timer();
        });

        expect(result.current.is_running).toBe(false);
        expect(result.current.is_finished).toBe(false);
        expect(result.current.total_seconds).toBe(270); // Back to initial
        expect(result.current.remaining_seconds).toBe(270);
      });
    });

    describe("restart_timer", () => {
      test("should restart timer when finished", () => {
        // complete a timer
        act(() => {
          result.current.set_preset(30); // use minimum time
          result.current.start_timer();
        });
        act(() => {
          jest.advanceTimersByTime(30000);
        });
        expect(result.current.is_finished).toBe(true);
        expect(result.current.is_running).toBe(false);
        // restart
        act(() => {
          result.current.restart_timer();
        });
        expect(result.current.is_finished).toBe(false);
        expect(result.current.remaining_seconds).toBe(30);

        // Now manually start the timer
        act(() => {
          result.current.start_timer();
        });

        expect(result.current.is_running).toBe(true);
      });

      test("should not restart when not finished", () => {
        act(() => {
          result.current.set_preset(60);
          result.current.start_timer();
        });

        act(() => {
          result.current.restart_timer();
        });
        expect(result.current.is_running).toBe(true);
        expect(result.current.remaining_seconds).toBe(60);
      });
    });
  });

  describe("timer configuration", () => {
    describe("set_preset", () => {
      test("should set timer to exact preset value", () => {
        act(() => {
          result.current.set_preset(390); // medium preset
        });
        expect(result.current.total_seconds).toBe(390);
        expect(result.current.remaining_seconds).toBe(390);
        expect(result.current.is_running).toBe(false);
      });

      test("should enforce minimum timer duration", () => {
        act(() => {
          result.current.set_preset(10); // below minimum
        });
        expect(result.current.total_seconds).toBe(30);
        expect(result.current.remaining_seconds).toBe(30);
      });

      test("should stop running timer when setting preset", () => {
        act(() => {
          result.current.set_preset(60);
          result.current.start_timer();
        });
        expect(result.current.is_running).toBe(true);
        act(() => {
          result.current.set_preset(120);
        });
        expect(result.current.is_running).toBe(false);
        expect(result.current.total_seconds).toBe(120);
      });
    });

    describe("add_seconds", () => {
      test("should add seconds to current timer", () => {
        act(() => {
          result.current.set_preset(60);
        });
        act(() => {
          result.current.add_seconds(30);
        });
        expect(result.current.total_seconds).toBe(90);
        expect(result.current.remaining_seconds).toBe(90);
      });

      test("should subtract seconds when negative value provided", () => {
        act(() => {
          result.current.set_preset(90);
        });
        act(() => {
          result.current.add_seconds(-30);
        });
        expect(result.current.total_seconds).toBe(60);
        expect(result.current.remaining_seconds).toBe(60);
      });

      test("should enforce minimum duration", () => {
        act(() => {
          result.current.set_preset(60);
        });
        act(() => {
          result.current.add_seconds(-100); // would go below minimum
        });
        expect(result.current.total_seconds).toBe(30);
        expect(result.current.remaining_seconds).toBe(30);
      });

      test("should stop running timer when adding seconds", () => {
        act(() => {
          result.current.set_preset(60);
          result.current.start_timer();
        });
        expect(result.current.is_running).toBe(true);
        act(() => {
          result.current.add_seconds(30);
        });
        expect(result.current.is_running).toBe(false);
      });
    });

    describe("set_total_seconds", () => {
      test("should set custom timer duration", () => {
        act(() => {
          result.current.set_total_seconds(300);
        });
        expect(result.current.total_seconds).toBe(300);
        expect(result.current.remaining_seconds).toBe(300);
      });
      test("should enforce minimum duration", () => {
        act(() => {
          result.current.set_total_seconds(10);
        });
        expect(result.current.total_seconds).toBe(30);
        expect(result.current.remaining_seconds).toBe(30);
      });

      test("should stop running timer when setting duration", () => {
        act(() => {
          result.current.set_preset(60);
          result.current.start_timer();
        });

        expect(result.current.is_running).toBe(true);

        act(() => {
          result.current.set_total_seconds(120);
        });

        expect(result.current.is_running).toBe(false);
        expect(result.current.total_seconds).toBe(120);
      });
    });
  });

  describe("progress calculation", () => {
    test("should calculate progress correctly", () => {
      act(() => {
        result.current.set_preset(100);
      });
      expect(result.current.progress).toBe(1); // 100%
      act(() => {
        result.current.start_timer();
      });
      act(() => {
        jest.advanceTimersByTime(25000);
      });
      expect(result.current.progress).toBeCloseTo(0.75, 2);
      act(() => {
        jest.advanceTimersByTime(75000);
      });

      expect(result.current.progress).toBe(0);
    });
  });

  describe("cleanup and unmount", () => {
    test("should cleanup intervals on unmount", () => {
      const clearIntervalSpy = jest.spyOn(window, "clearInterval");

      act(() => {
        result.current.set_preset(60);
        result.current.start_timer();
      });
      hookResult.unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();
      clearIntervalSpy.mockRestore();
    });
  });
});

const expectedProperties = [
  "remaining_seconds",
  "total_seconds",
  "set_total_seconds",
  "is_running",
  "is_finished",
  "progress",
  "PRESETS",
  "MIN_TIMER_SECONDS",
  "formatTime",
  "start_timer",
  "stop_timer",
  "reset_timer",
  "restart_timer",
  "set_preset",
  "add_seconds",
];

const testCases = [
  { input: 0, expected: "00:00" },
  { input: 30, expected: "00:30" },
  { input: 60, expected: "01:00" },
  { input: 90, expected: "01:30" },
  { input: 125, expected: "02:05" },
  { input: 3600, expected: "60:00" },
  { input: 3661, expected: "61:01" },
  { input: 59, expected: "00:59" },
  { input: 119, expected: "01:59" },
  { input: 3665, expected: "61:05" },
];
