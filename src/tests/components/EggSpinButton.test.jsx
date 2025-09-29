import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EggSpinButton from "../../components/EggSpinButton";

describe("EggSpinButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders with label and initial value", () => {
      render(<EggSpinButton {...defaultProps} />);
      expect(screen.getByText("Test Label")).toBeInTheDocument();
      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
    });

    it("renders increment and decrement buttons", () => {
      render(<EggSpinButton {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /decrease test label/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /increase test label/i })
      ).toBeInTheDocument();
    });

    it("applies small class when is_small is true", () => {
      render(<EggSpinButton {...defaultProps} is_small={true} />);
      const spinDiv = screen
        .getByText("Test Label")
        .parentElement.querySelector(".spin");
      expect(spinDiv).toHaveClass("spin", "small");
    });

    it("applies only spin class when is_small is false", () => {
      render(<EggSpinButton {...defaultProps} is_small={false} />);
      const spinDiv = screen
        .getByText("Test Label")
        .parentElement.querySelector(".spin");
      expect(spinDiv).toHaveClass("spin");
      expect(spinDiv).not.toHaveClass("small");
    });

    it("sets correct input attributes", () => {
      render(<EggSpinButton {...defaultProps} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("type", "number");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "10");
      expect(input).toHaveAttribute("aria-label", "Test Label input");
    });

    it("uses default max of 99 when max is not provided", () => {
      const propsWithoutMax = { ...defaultProps };
      delete propsWithoutMax.max;
      render(<EggSpinButton {...propsWithoutMax} />);
      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("max", "99");
    });
  });

  describe("Increment functionality", () => {
    it("increments by 1 when is_small is false", () => {
      render(<EggSpinButton {...defaultProps} is_small={false} />);
      const incrementBtn = screen.getByRole("button", {
        name: /increase test label/i,
      });
      fireEvent.click(incrementBtn);
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 6 },
      });
    });

    it("increments by 10 when is_small is true", () => {
      render(<EggSpinButton {...defaultProps} is_small={true} max={20} />);
      const incrementBtn = screen.getByRole("button", {
        name: /increase test label/i,
      });
      fireEvent.click(incrementBtn);
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 15 },
      });
    });

    it("does not exceed max value when incrementing", () => {
      render(<EggSpinButton {...defaultProps} value={10} />);
      const incrementBtn = screen.getByRole("button", {
        name: /increase test label/i,
      });
      fireEvent.click(incrementBtn);
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it("uses default max of 99 when max is not provided", () => {
      const propsWithoutMax = { ...defaultProps, value: 98 };
      delete propsWithoutMax.max;
      render(<EggSpinButton {...propsWithoutMax} />);
      const incrementBtn = screen.getByRole("button", {
        name: /increase test label/i,
      });
      fireEvent.click(incrementBtn);
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 99 },
      });
    });

    it("disables increment button when at max value", () => {
      render(<EggSpinButton {...defaultProps} value={10} />);
      const incrementBtn = screen.getByRole("button", {
        name: /increase test label/i,
      });
      expect(incrementBtn).toBeDisabled();
    });

    it("disables increment button when at default max of 99", () => {
      const propsWithoutMax = { ...defaultProps, value: 99 };
      delete propsWithoutMax.max;
      render(<EggSpinButton {...propsWithoutMax} />);
      const incrementBtn = screen.getByRole("button", {
        name: /increase test label/i,
      });
      expect(incrementBtn).toBeDisabled();
    });
  });

  describe("Decrement functionality", () => {
    it("decrements by 1 when is_small is false", () => {
      render(<EggSpinButton {...defaultProps} is_small={false} />);
      const decrementBtn = screen.getByRole("button", {
        name: /decrease test label/i,
      });
      fireEvent.click(decrementBtn);
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 4 },
      });
    });

    it("decrements by 10 when is_small is true", () => {
      render(<EggSpinButton {...defaultProps} is_small={true} value={15} />);
      const decrementBtn = screen.getByRole("button", {
        name: /decrease test label/i,
      });
      fireEvent.click(decrementBtn);
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 5 },
      });
    });

    it("does not go below min value when decrementing", () => {
      render(<EggSpinButton {...defaultProps} value={0} />);
      const decrementBtn = screen.getByRole("button", {
        name: /decrease test label/i,
      });
      fireEvent.click(decrementBtn);
      expect(defaultProps.onChange).not.toHaveBeenCalled();
    });

    it("disables decrement button when at min value", () => {
      render(<EggSpinButton {...defaultProps} value={0} />);
      const decrementBtn = screen.getByRole("button", {
        name: /decrease test label/i,
      });
      expect(decrementBtn).toBeDisabled();
    });
  });

  describe("Input change functionality", () => {
    it("handles valid numeric input", () => {
      render(<EggSpinButton {...defaultProps} />);
      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "7" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 7 },
      });
    });

    it("constrains input to max value", () => {
      render(<EggSpinButton {...defaultProps} />);
      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "15" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 10 },
      });
    });

    it("constrains input to min value", () => {
      render(<EggSpinButton {...defaultProps} />);
      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "-5" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 0 },
      });
    });

    it("handles non-numeric input by using min value", () => {
      render(<EggSpinButton {...defaultProps} />);
      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "abc" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 0 },
      });
    });

    it("handles empty input by using min value", () => {
      render(<EggSpinButton {...defaultProps} />);
      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 0 },
      });
    });

    it("uses default max of 99 for input validation when max is not provided", () => {
      const propsWithoutMax = { ...defaultProps };
      delete propsWithoutMax.max;
      render(<EggSpinButton {...propsWithoutMax} />);
      const input = screen.getByRole("spinbutton");
      fireEvent.change(input, { target: { value: "150" } });
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 99 },
      });
    });
  });

  describe("Edge cases", () => {
    it("handles min value of 0 (default)", () => {
      const propsWithoutMin = { ...defaultProps };
      delete propsWithoutMin.min;
      render(<EggSpinButton {...propsWithoutMin} value={1} />);
      const decrementBtn = screen.getByRole("button", {
        name: /decrease test label/i,
      });
      fireEvent.click(decrementBtn);
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 0 },
      });
    });

    it("handles custom min value", () => {
      render(<EggSpinButton {...defaultProps} min={5} value={6} />);
      const decrementBtn = screen.getByRole("button", {
        name: /decrease test label/i,
      });
      fireEvent.click(decrementBtn);
      expect(defaultProps.onChange).toHaveBeenCalledWith({
        target: { value: 5 },
      });
    });

    it("handles single value range (min equals max)", () => {
      render(<EggSpinButton {...defaultProps} min={5} max={5} value={5} />);
      const incrementBtn = screen.getByRole("button", {
        name: /increase test label/i,
      });
      const decrementBtn = screen.getByRole("button", {
        name: /decrease test label/i,
      });
      expect(incrementBtn).toBeDisabled();
      expect(decrementBtn).toBeDisabled();
    });
  });
});

const defaultProps = {
  label: "Test Label",
  value: 5,
  onChange: jest.fn(),
  min: 0,
  max: 10,
};
