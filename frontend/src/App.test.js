import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Homepage tests", () => {
  test("renders search bar", () => {
    render(<Home />);
    const searchbar = screen.getByPlaceholderText(/search/i);
    expect(searchbar).toBeInTheDocument();
  });
});

describe("Wiki Page Tests", () => {
  test("renders wiki page", () => {
    render(<WikiPage />);
    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
  });

  test("renders edit button", () => {
    render(<WikiPage />);
    const button = Screen.getByText(/edit/i);
    expect(button).toBeInTheDocument();
  });
});
