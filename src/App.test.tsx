import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renders title", () => {
  render(<App />);
  const linkElement = screen.getByText(/Master swim workout/i);
  expect(linkElement).toBeInTheDocument();
});
