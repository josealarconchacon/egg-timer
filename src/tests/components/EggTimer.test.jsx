import React from "react";
import { render, screen } from "@testing-library/react";
import EggTimer from "../../components/EggTimer";

// mock egg display and egg control component for prop checks
jest.mock("../../components/EggDisplay", () => (props) => {
  return <div data-testid="mock-egg-display">{JSON.stringify(props)}</div>;
});

jest.mock("../../components/EggControl", () => (props) => {
  return <div data-testid="mock-egg-control">{JSON.stringify(props)}</div>;
});

describe("EggTimer component", () => {
  test("should render main structure sections", () => {
    render(<EggTimer />);
    expect(screen.getByText(/Perfect Egg Cooking Guide/i)).toBeInTheDocument();
    expect(screen.getByTestId("mock-egg-display")).toBeInTheDocument();
    expect(screen.getByTestId("mock-egg-control")).toBeInTheDocument();
    expect(screen.getByText(/Critical Timing/i)).toBeInTheDocument();
    expect(screen.getByText(/Water Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Egg Size/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Temperature/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Audio Cues/i)).toBeInTheDocument();
    expect(screen.getByText(/Controls/i)).toBeInTheDocument();
  });

  test("passes expected props to EggDisplay", () => {
    render(<EggTimer />);
    const display = screen.getByTestId("mock-egg-display");
    // parse the props object as text for checking expected props
    const props = JSON.parse(display.textContent);
    expect(props).toHaveProperty("remaining_seconds");
    expect(props).toHaveProperty("progress");
    expect(props).toHaveProperty("is_running");
    expect(props).toHaveProperty("is_finished");
  });

  test("passes expected props to EggControl", () => {
    render(<EggTimer />);
    const control = screen.getByTestId("mock-egg-control");
    const props = JSON.parse(control.textContent);
    expect(props).toHaveProperty("total_seconds");
    expect(props).toHaveProperty("is_running");
    expect(props).toHaveProperty("is_finished");
    expect(props).toHaveProperty("PRESETS");
    expect(props).toHaveProperty("MIN_TIMER_SECONDS");
  });

  test("renders all cooking guide sections", () => {
    render(<EggTimer />);
    expect(screen.getByText(/Critical Timing/i)).toBeInTheDocument();
    expect(screen.getByText(/Water Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Egg Size/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Temperature/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Audio Cues/i)).toBeInTheDocument();
    expect(screen.getByText(/Controls/i)).toBeInTheDocument();
  });
});
