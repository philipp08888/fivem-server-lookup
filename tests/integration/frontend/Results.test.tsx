import { Results } from "@/src/components/search/Results";
import { TEST_IDS } from "@/src/functions/testIds";
import { Server } from "@prisma/client";
import { fireEvent, render, screen } from "@testing-library/react";
import { noop } from "lodash";

describe("<Results />", () => {
  it("should render correctly", () => {
    const results: Server[] = [
      {
        id: "ABC123",
        hostname: "Test Server ABC",
        image: "#",
      },
      {
        id: "DEF456",
        hostname: "Test Server DEF",
        image: "#",
      },
      {
        id: "GHI789",
        hostname: "Test Server GHI",
        image: "#",
      },
    ];

    render(
      <Results
        loading={false}
        results={results}
        onClick={() => noop()}
        tag="RECENTLY_SEARCHED"
      />,
    );

    results.forEach((result) => {
      const hostname = screen.getByText(result.hostname);
      expect(hostname).toBeInTheDocument();
    });
  });

  it("should display no results text when no results but query provided", () => {
    const providedResults: Server[] = [];

    render(
      <Results
        results={providedResults}
        query="Query"
        loading={false}
        tag="SEARCH_RESULTS"
        onClick={() => noop()}
      />,
    );

    const noResultsHeading = screen.queryByText("No results found");
    const searchWithId = screen.queryByText("Search with Id: Query");

    expect(noResultsHeading).toBeInTheDocument();
    expect(searchWithId).toBeInTheDocument();
  });

  it("should display nothing when recently searched mode and results are empty", () => {
    const { container } = render(
      <Results
        loading={false}
        results={[]}
        tag="RECENTLY_SEARCHED"
        onClick={() => noop()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should execute on click function with specific id", () => {
    const results: Server[] = [
      {
        id: "ABC123",
        hostname: "Test Server ABC",
        image: "#",
      },
      {
        id: "DEF456",
        hostname: "Test Server DEF",
        image: "#",
      },
      {
        id: "GHI789",
        hostname: "Test Server GHI",
        image: "#",
      },
    ];

    const mockOnClick = jest.fn();

    render(
      <Results
        loading={false}
        results={results}
        onClick={(id) => mockOnClick(id)}
        tag="RECENTLY_SEARCHED"
      />,
    );

    const serverTile = screen.getByTestId(
      TEST_IDS.RESULTS.SERVER_TILE(results[0].hostname),
    );

    fireEvent.click(serverTile);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(results[0].id);
  });
});
