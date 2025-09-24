import { renderHook, act } from "@testing-library/react";
import { useEggTimer } from "../../../hooks/useEggTimer";

describe("useEggTimer", () => {
  let result;
  let hookResult;

  beforeEach(() => {
    hookResult = renderHook(() => useEggTimer());
    result = hookResult.result;
  });

  afterEach(() => {
    hookResult.unmount();
  });

  describe("initialization", () => {
    test("should initialize with default values", () => {
      expect(result.current.is_running).toBe(false);
      expect(result.current.is_finished).toBe(false);
      expect(typeof result.current.remaining_seconds).toBe("number");
    });
  });

  // format the time
  describe("formatTime", () => {
    test("should format time correctly for various inputs", () => {
      // Test basic formatting
      expect(result.current.formatTime(0)).toBe("00:00");
      expect(result.current.formatTime(30)).toBe("00:30");
      expect(result.current.formatTime(60)).toBe("01:00");
      expect(result.current.formatTime(90)).toBe("01:30");
      expect(result.current.formatTime(125)).toBe("02:05");

      // Test larger values
      expect(result.current.formatTime(3600)).toBe("60:00");
      expect(result.current.formatTime(3661)).toBe("61:01");

      // Test edge cases
      expect(result.current.formatTime(59)).toBe("00:59");
      expect(result.current.formatTime(119)).toBe("01:59");
    });
  });

  // start the timer
  describe("start_timer", () => {
    test("should set is_running to true", () => {
      act(() => result.current.start_timer());
      expect(result.current.is_running).toBe(true);
    });
  });

  // stop the timer
  describe("stop_timer", () => {
    test("should set is_running to false", () => {
      act(() => result.current.start_timer());
      act(() => result.current.stop_timer());
      expect(result.current.is_running).toBe(false);
    });
  });

  // reset the timer
  describe("reset_timer", () => {
    test("should reset timer to initial state", () => {
      act(() => result.current.set_preset(60));
      act(() => result.current.start_timer());
      act(() => result.current.reset_timer());
      expect(result.current.is_running).toBe(false);
      expect(result.current.is_finished).toBe(false);
    });
  });

  // restart the timer
  describe("restart_timer", () => {
    test("should restart timer when finished", () => {
      act(() => result.current.set_preset(30));
      act(() => result.current.start_timer());
      act(() => result.current.restart_timer());
      expect(result.current.is_running).toBe(true);
    });
  });

  // set the preset
  describe("set_preset", () => {
    test("should set total_seconds and remaining_seconds", () => {
      act(() => result.current.set_preset(390)); // Medium
      expect(result.current.total_seconds).toBeGreaterThanOrEqual(30);
      expect(result.current.remaining_seconds).toBeGreaterThanOrEqual(30);
    });
    test("should set to exact value if above minimum", () => {
      act(() => result.current.set_preset(390));
      expect(result.current.total_seconds).toBe(390);
      expect(result.current.remaining_seconds).toBe(390);
    });

    test("should cap at minimum value", () => {
      act(() => result.current.set_preset(5)); // Below minimum
      expect(result.current.total_seconds).toBe(30);
      expect(result.current.remaining_seconds).toBe(30);
    });
  });

  // add seconds
  describe("add_seconds", () => {
    test("should add seconds to timer", () => {
      act(() => result.current.set_preset(60));
      act(() => result.current.add_seconds(30));
      expect(result.current.total_seconds).toBe(90);
      expect(result.current.remaining_seconds).toBe(90);
    });
    test("should not go below MIN_TIMER_SECONDS", () => {
      act(() => result.current.set_preset(60));
      act(() => result.current.add_seconds(-100));
      expect(result.current.total_seconds).toBeGreaterThanOrEqual(
        result.current.MIN_TIMER_SECONDS
      );
    });
    test("should add zero correctly", () => {
      act(() => result.current.set_preset(60));
      act(() => result.current.add_seconds(0));
      expect(result.current.total_seconds).toBe(60);
    });
  });

  // set the custom seconds
  describe("set_total_seconds", () => {
    test("should set total_seconds and remaining_seconds to Soft", () => {
      act(() => result.current.set_total_seconds(270));
      expect(result.current.total_seconds).toBe(270);
      expect(result.current.remaining_seconds).toBe(270);
    });

    test("should set total_seconds and remaining_seconds to Medium", () => {
      act(() => result.current.set_total_seconds(390));
      expect(result.current.total_seconds).toBe(390);
      expect(result.current.remaining_seconds).toBe(390);
    });

    test("should set total_seconds and remaining_seconds to Hard", () => {
      act(() => result.current.set_total_seconds(630));
      expect(result.current.total_seconds).toBe(630);
      expect(result.current.remaining_seconds).toBe(630);
    });

    test("should set both to minimum if given value is below minimum", () => {
      act(() => result.current.set_total_seconds(10));
      expect(result.current.total_seconds).toBe(30);
      expect(result.current.remaining_seconds).toBe(30);
    });
  });
});
