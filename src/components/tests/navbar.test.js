import { render, screen } from "@testing-library/react";
import { Navbar } from "../navbar/Navbar";

const links = [
  { text: "Log in", location: "/login" },
  { text: "Sign up", location: "/signup" },
];

test("should show Navbar", () => {
  render(<Navbar />);
  let p = screen.getByText(/Log in/);
  expect(p).toBeInTheDocument();
});

test.each(links)("Check if Nav Bar have %s link.", (link) => {
  render(<Navbar />);
  const linkDom = screen.getByText(link.text);
  expect(linkDom).toHaveAttribute("href", link.location);
});
