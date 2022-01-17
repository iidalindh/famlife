import { render, screen } from "@testing-library/react";
import { CalendarCopy } from "../calendar/CalendarCopy";

test("should show daypilot-calender", () => {
  render(<CalendarCopy />);
  const calendar = screen.getByTestId("calendar");
  expect(calendar).toBeInTheDocument();
});

test("should show daypilot-month-picker", () => {
  render(<CalendarCopy />);
  const monthPicker = screen.getByTestId("month-picker");
  expect(monthPicker).toBeInTheDocument();
});
