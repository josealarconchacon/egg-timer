import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EggDisplay from "../../components/EggDisplay";

describe("EggDisplay", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders without crashing", () => {
      render(<EggDisplay {...defaultProps} />);
      expect(screen.getByText("3:00")).toBeInTheDocument();
    });

    it("displays formatted time", () => {
      render(<EggDisplay {...defaultProps} remaining_seconds={125} />);
      expect(mockFormatTime).toHaveBeenCalledWith(125);
      expect(screen.getByText("2:05")).toBeInTheDocument();
    });

    it("displays DONE when completed", () => {
      render(
        <EggDisplay
          {...defaultProps}
          remaining_seconds={0}
          is_finished={true}
        />
      );
      expect(screen.getByText("DONE!")).toBeInTheDocument();
    });

    it("applies aria-live attribute to time display", () => {
      render(<EggDisplay {...defaultProps} />);
      const timeElement = screen.getByText("3:00");
      expect(timeElement).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("CSS Classes", () => {
    it("applies finished class when egg is completed", () => {
      const { container } = render(
        <EggDisplay
          {...defaultProps}
          remaining_seconds={0}
          is_finished={true}
        />
      );
      const eggShell = container.querySelector(".egg-shell");
      expect(eggShell).toHaveClass("finished");
    });

    it("applies final-countdown class during last 10 seconds", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} remaining_seconds={7} is_running={true} />
      );
      const eggShell = container.querySelector(".egg-shell");
      expect(eggShell).toHaveClass("final-countdown");
    });

    it("does not apply final-countdown class when paused", () => {
      const { container } = render(
        <EggDisplay
          {...defaultProps}
          remaining_seconds={7}
          is_running={false}
        />
      );
      const eggShell = container.querySelector(".egg-shell");
      expect(eggShell).not.toHaveClass("final-countdown");
    });

    it("does not apply final-countdown class at exactly 0 seconds", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} remaining_seconds={0} is_running={true} />
      );
      const eggShell = container.querySelector(".egg-shell");
      expect(eggShell).not.toHaveClass("final-countdown");
    });
  });

  describe("Yolk Scaling", () => {
    it("calculates yolk scale correctly at 0% progress", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} progress={0} />
      );
      const yolk = container.querySelector(".yolk");
      expect(yolk).toHaveStyle({ transform: "scale(0.6)" });
    });

    it("calculates yolk scale correctly at 50% progress", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} progress={0.5} />
      );
      const yolk = container.querySelector(".yolk");
      expect(yolk).toHaveStyle({ transform: "scale(0.8)" });
    });

    it("calculates yolk scale correctly at 100% progress", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} progress={1} />
      );
      const yolk = container.querySelector(".yolk");
      expect(yolk).toHaveStyle({ transform: "scale(1)" });
    });
  });

  describe("Progress Ring", () => {
    it("renders progress ring when timer is running", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} is_running={true} />
      );
      const progressRing = container.querySelector(".progress-ring");
      expect(progressRing).toBeInTheDocument();
    });

    it("does not render progress ring when timer is not running", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} is_running={false} />
      );
      const progressRing = container.querySelector(".progress-ring");
      expect(progressRing).not.toBeInTheDocument();
    });

    it("sets correct progress CSS variable", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} progress={0.3} is_running={true} />
      );
      const progressRing = container.querySelector(".progress-ring");
      expect(progressRing).toHaveStyle({ "--progress": "70%" });
    });
  });

  describe("Hint Text", () => {
    it("shows start hint when not running", () => {
      render(<EggDisplay {...defaultProps} is_running={false} />);
      expect(screen.getByText("Click the egg to start")).toBeInTheDocument();
    });

    it("shows pause hint when running", () => {
      render(<EggDisplay {...defaultProps} is_running={true} />);
      expect(screen.getByText("Click the egg to pause")).toBeInTheDocument();
    });

    it("shows restart hint when completed", () => {
      render(
        <EggDisplay
          {...defaultProps}
          remaining_seconds={0}
          is_finished={true}
        />
      );
      expect(screen.getByText("Click to restart")).toBeInTheDocument();
    });
  });

  describe("Click Interactions", () => {
    it("calls onToggle when clicked and not completed", () => {
      render(<EggDisplay {...defaultProps} />);
      const container = screen.getByText("3:00").closest(".egg-container");
      fireEvent.click(container);
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
      expect(defaultProps.onRestart).not.toHaveBeenCalled();
    });

    it("calls onRestart when clicked and completed", () => {
      render(
        <EggDisplay
          {...defaultProps}
          remaining_seconds={0}
          is_finished={true}
        />
      );
      const container = screen.getByText("DONE!").closest(".egg-container");
      fireEvent.click(container);
      expect(defaultProps.onRestart).toHaveBeenCalledTimes(1);
      expect(defaultProps.onToggle).not.toHaveBeenCalled();
    });

    it("calls onToggle when onRestart is not provided", () => {
      render(
        <EggDisplay
          {...defaultProps}
          remaining_seconds={0}
          is_finished={true}
          onRestart={undefined}
        />
      );
      const container = screen.getByText("DONE!").closest(".egg-container");
      fireEvent.click(container);
      expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("applies final-countdown class at exactly 10 seconds", () => {
      const { container } = render(
        <EggDisplay
          {...defaultProps}
          remaining_seconds={10}
          is_running={true}
        />
      );
      const eggShell = container.querySelector(".egg-shell");
      expect(eggShell).toHaveClass("final-countdown");
    });

    it("does not apply final-countdown class at exactly 11 seconds", () => {
      const { container } = render(
        <EggDisplay
          {...defaultProps}
          remaining_seconds={11}
          is_running={true}
        />
      );
      const eggShell = container.querySelector(".egg-shell");
      expect(eggShell).not.toHaveClass("final-countdown");
    });

    it("handles remaining_seconds at 9", () => {
      const { container } = render(
        <EggDisplay {...defaultProps} remaining_seconds={9} is_running={true} />
      );
      const eggShell = container.querySelector(".egg-shell");
      expect(eggShell).toHaveClass("final-countdown");
    });
  });
});

const mockFormatTime = jest.fn((seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
});

const defaultProps = {
  remaining_seconds: 180,
  progress: 0.5,
  format_time: mockFormatTime,
  is_running: false,
  is_finished: false,
  onToggle: jest.fn(),
  onRestart: jest.fn(),
};
