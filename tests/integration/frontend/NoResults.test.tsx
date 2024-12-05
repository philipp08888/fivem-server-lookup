import { fireEvent, render, screen } from "@testing-library/react";
import { NoResults } from "@/src/components/search/NoResults";
import { TEST_IDS } from "@/src/functions/testIds";

describe("<NoResults />", () => {
  it("should render correctly", () => {
    const mockOnClick = jest.fn();

    render(<NoResults query="SERVER_ID" onClick={() => mockOnClick()} />);

    const noResultsHeading = screen.queryByText("No results found");
    const searchWithId = screen.queryByText("Search with Id: SERVER_ID");
    const noResultSearch = screen.getByTestId(
      TEST_IDS.RESULTS.NO_RESULTS_SEARCH,
    );

    expect(noResultsHeading).toBeInTheDocument();
    expect(searchWithId).toBeInTheDocument();
    expect(noResultSearch).toBeInTheDocument();

    fireEvent.click(noResultSearch);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
