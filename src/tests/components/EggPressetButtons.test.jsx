import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EggPressetButtons from "../../components/EggPressetButtons";

describe("EggPressetButtons", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all preset buttons", () => {
      render(<EggPressetButtons {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /soft \(3m\)/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /medium \(6m\)/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /hard \(10m\)/i })
      ).toBeInTheDocument();
    });

    it("renders container with correct class", () => {
      const { container } = render(<EggPressetButtons {...defaultProps} />);
      expect(container.firstChild).toHaveClass("presets");
    });
    it("renders each button with correct class", () => {
      render(<EggPressetButtons {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveClass("preset");
      });
    });

    it("displays preset names correctly", () => {
      render(<EggPressetButtons {...defaultProps} />);
      expect(screen.getByText("Soft")).toBeInTheDocument();
      expect(screen.getByText("Medium")).toBeInTheDocument();
      expect(screen.getByText("Hard")).toBeInTheDocument();
    });

    it("displays time in minutes correctly", () => {
      render(<EggPressetButtons {...defaultProps} />);
      expect(screen.getByText("(3m)")).toBeInTheDocument();
      expect(screen.getByText("(6m)")).toBeInTheDocument();
      expect(screen.getByText("(10m)")).toBeInTheDocument();
    });

    it("applies small class to time spans", () => {
      render(<EggPressetButtons {...defaultProps} />);
      const timeSpans = screen.getAllByText(/\(\d+m\)/);
      timeSpans.forEach((span) => {
        expect(span).toHaveClass("small");
      });
    });

    it("sets title attribute with description", () => {
      render(<EggPressetButtons {...defaultProps} />);
      expect(screen.getByRole("button", { name: /soft/i })).toHaveAttribute(
        "title",
        "Soft boiled egg"
      );
      expect(screen.getByRole("button", { name: /medium/i })).toHaveAttribute(
        "title",
        "Medium boiled egg"
      );
      expect(screen.getByRole("button", { name: /hard/i })).toHaveAttribute(
        "title",
        "Hard boiled egg"
      );
    });
  });

  describe("Active state (aria-pressed)", () => {
    it('sets aria-pressed="true" for active preset', () => {
      render(<EggPressetButtons {...defaultProps} total_seconds={180} />);
      const softButton = screen.getByRole("button", { name: /soft/i });
      const mediumButton = screen.getByRole("button", { name: /medium/i });
      const hardButton = screen.getByRole("button", { name: /hard/i });
      expect(softButton).toHaveAttribute("aria-pressed", "true");
      expect(mediumButton).toHaveAttribute("aria-pressed", "false");
      expect(hardButton).toHaveAttribute("aria-pressed", "false");
    });

    it('sets aria-pressed="true" for different active preset', () => {
      render(<EggPressetButtons {...defaultProps} total_seconds={360} />);
      const softButton = screen.getByRole("button", { name: /soft/i });
      const mediumButton = screen.getByRole("button", { name: /medium/i });
      const hardButton = screen.getByRole("button", { name: /hard/i });
      expect(softButton).toHaveAttribute("aria-pressed", "false");
      expect(mediumButton).toHaveAttribute("aria-pressed", "true");
      expect(hardButton).toHaveAttribute("aria-pressed", "false");
    });

    it('sets aria-pressed="false" for all presets when no match', () => {
      render(<EggPressetButtons {...defaultProps} total_seconds={999} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-pressed", "false");
      });
    });
  });

  describe("Click functionality", () => {
    it("calls set_preset with correct seconds when clicked", () => {
      render(<EggPressetButtons {...defaultProps} />);
      const softButton = screen.getByRole("button", { name: /soft/i });
      fireEvent.click(softButton);
      expect(defaultProps.set_preset).toHaveBeenCalledWith(180);
    });

    it("calls set_preset with correct seconds for different presets", () => {
      render(<EggPressetButtons {...defaultProps} />);
      const mediumButton = screen.getByRole("button", { name: /medium/i });
      fireEvent.click(mediumButton);
      expect(defaultProps.set_preset).toHaveBeenCalledWith(360);
      const hardButton = screen.getByRole("button", { name: /hard/i });
      fireEvent.click(hardButton);
      expect(defaultProps.set_preset).toHaveBeenCalledWith(600);
    });

    it("calls set_preset only once per click", () => {
      render(<EggPressetButtons {...defaultProps} />);
      const softButton = screen.getByRole("button", { name: /soft/i });
      fireEvent.click(softButton);
      expect(defaultProps.set_preset).toHaveBeenCalledTimes(1);
    });
  });

  describe("Time calculation", () => {
    it("correctly calculates minutes from seconds", () => {
      render(<EggPressetButtons {...defaultProps} presets={customPresets} />);
      expect(screen.getByText("(1m)")).toBeInTheDocument();
      expect(screen.getByText("(4m)")).toBeInTheDocument();
      expect(screen.getByText("(15m)")).toBeInTheDocument();
    });

    it("handles seconds less than 60 correctly", () => {
      render(<EggPressetButtons {...defaultProps} presets={shortPresets} />);
      expect(screen.getByText("(0m)")).toBeInTheDocument();
    });

    it("handles large numbers of seconds correctly", () => {
      render(<EggPressetButtons {...defaultProps} presets={longPresets} />);
      expect(screen.getByText("(60m)")).toBeInTheDocument();
    });

    it("floors decimal minutes correctly", () => {
      render(<EggPressetButtons {...defaultProps} presets={decimalPresets} />);
      expect(screen.getByText("(1m)")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("renders correctly with empty presets array", () => {
      const { container } = render(
        <EggPressetButtons {...defaultProps} presets={[]} />
      );
      const presetsContainer = container.querySelector(".presets");
      expect(presetsContainer).toHaveClass("presets");
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("handles preset with zero seconds", () => {
      render(<EggPressetButtons {...defaultProps} presets={zeroPresets} />);
      expect(screen.getByText("(0m)")).toBeInTheDocument();
    });

    it("handles presets with same seconds but different names", () => {
      render(
        <EggPressetButtons
          {...defaultProps}
          presets={duplicatePresets}
          total_seconds={180}
        />
      );
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-pressed", "true");
      });
    });

    it("handles missing description gracefully", () => {
      render(
        <EggPressetButtons
          {...defaultProps}
          presets={presetsWithoutDescription}
        />
      );
      const button = screen.getByRole("button", { name: /test/i });
      expect(button).not.toHaveAttribute("title");
    });

    it("handles preset names with special characters", () => {
      render(<EggPressetButtons {...defaultProps} presets={specialPresets} />);
      expect(screen.getByText("Extra-Soft!")).toBeInTheDocument();
      expect(screen.getByText("Medium & Hard")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("provides accessible names for screen readers", () => {
      render(<EggPressetButtons {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /soft.*3m/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /medium.*6m/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /hard.*10m/i })
      ).toBeInTheDocument();
    });

    it("uses aria-pressed for toggle button semantics", () => {
      render(<EggPressetButtons {...defaultProps} total_seconds={360} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).toHaveAttribute("aria-pressed");
      });
    });

    it("provides descriptive titles for tooltips", () => {
      render(<EggPressetButtons {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach((button, index) => {
        expect(button).toHaveAttribute("title", mockPresets[index].description);
      });
    });
  });
});

const mockPresets = [
  { name: "Soft", seconds: 180, description: "Soft boiled egg" },
  { name: "Medium", seconds: 360, description: "Medium boiled egg" },
  { name: "Hard", seconds: 600, description: "Hard boiled egg" },
];

const defaultProps = {
  presets: mockPresets,
  total_seconds: 180,
  set_preset: jest.fn(),
};

const customPresets = [
  { name: "Quick", seconds: 60, description: "1 minute" },
  { name: "Standard", seconds: 240, description: "4 minutes" },
  { name: "Long", seconds: 900, description: "15 minutes" },
];

const shortPresets = [
  { name: "Very Quick", seconds: 30, description: "30 seconds" },
];

const longPresets = [
  { name: "Very Long", seconds: 3600, description: "1 hour" },
];

const decimalPresets = [
  { name: "Odd Time", seconds: 90, description: "1.5 minutes" },
];

const zeroPresets = [{ name: "None", seconds: 0, description: "No time" }];

const duplicatePresets = [
  { name: "Option A", seconds: 180, description: "First option" },
  { name: "Option B", seconds: 180, description: "Second option" },
];

const presetsWithoutDescription = [{ name: "Test", seconds: 180 }];

const specialPresets = [
  { name: "Extra-Soft!", seconds: 120, description: "Special egg" },
  { name: "Medium & Hard", seconds: 480, description: "Mixed style" },
];
