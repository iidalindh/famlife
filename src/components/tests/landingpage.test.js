import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { LandingPage } from "../landingPage/LandingPage";

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

test("should show Landingpage", () => {
  render(<LandingPage />);
  let button = screen.getByTestId("get-famlife");
  expect(button).toBeInTheDocument();
});

describe("Go to sigup page when button click", () => {
  it("Redirects to sign up page, when Get Famlife free button on landingpage is clicked", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    const button = screen.getByTestId("get-famlife");

    fireEvent.click(button);
    expect(mockHistoryPush).toHaveBeenCalledWith("/signup");
  });
});
