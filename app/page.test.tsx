import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the patch champion changes heading", async () => {
    render(await Home());

    expect(
      screen.getByRole("heading", { name: /patch 26\.14 champion changes/i })
    ).toBeInTheDocument();
  });

  it("renders a champion card from the mock data", async () => {
    render(await Home());

    expect(screen.getByRole("heading", { name: "Azir" })).toBeInTheDocument();
  });
});
