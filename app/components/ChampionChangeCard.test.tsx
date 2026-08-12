import { render, screen } from "@testing-library/react";
import ChampionChangeCard from "./ChampionChangeCard";
import type { ChampionChanges } from "@/app/types/patch";

const azirChanges: ChampionChanges = {
  championName: "Azir",
  changes: [
    {
      entity_name: "Azir",
      entity_type: "champion",
      change_type: "buff",
      summary: "Conqueror now applies 2 stacks per on-hit instead of 1 via Arise!.",
    },
    {
      entity_name: "Azir",
      entity_type: "champion",
      change_type: "bug_fix",
      summary: "Fixed a bug where Arise! soldiers would occasionally not path correctly.",
    },
  ],
};

describe("ChampionChangeCard", () => {
  it("renders the champion name as a heading", () => {
    render(<ChampionChangeCard championChanges={azirChanges} />);

    expect(screen.getByRole("heading", { name: "Azir" })).toBeInTheDocument();
  });

  it("renders every change's summary text", () => {
    render(<ChampionChangeCard championChanges={azirChanges} />);

    expect(
      screen.getByText(/Conqueror now applies 2 stacks per on-hit/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/soldiers would occasionally not path correctly/i)
    ).toBeInTheDocument();
  });

  it("renders a badge with the expected label for each change_type", () => {
    render(<ChampionChangeCard championChanges={azirChanges} />);

    expect(screen.getByText("Buff")).toBeInTheDocument();
    expect(screen.getByText("Bug Fix")).toBeInTheDocument();
  });
});
