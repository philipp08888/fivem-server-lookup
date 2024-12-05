import { Results } from "@/src/components/search/Results";
import { TEST_IDS } from "@/src/functions/testIds";
import { fireEvent, render, screen } from "@testing-library/react";
import { noop } from "lodash";
import { mockServers } from "@/tests/integration/frontend/__fixtures__/results.fixture";

describe("<Results />", () => {
  it("should render correctly", () => {
    render(
      <Results
        results={mockServers}
        onClick={() => noop()}
        mode="RECENTLY_SEARCHED"
      />,
    );

    mockServers.forEach((result) => {
      const hostname = screen.getByText(result.hostname);
      expect(hostname).toBeInTheDocument();
    });
  });

  it("should display nothing when recently searched mode and results are empty", () => {
    const { container } = render(
      <Results results={[]} mode="RECENTLY_SEARCHED" onClick={() => noop()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should execute on click function with specific id", () => {
    const mockOnClick = jest.fn();

    render(
      <Results
        results={mockServers}
        onClick={(id) => mockOnClick(id)}
        mode="RECENTLY_SEARCHED"
      />,
    );

    const serverTile = screen.getByTestId(
      TEST_IDS.RESULTS.SERVER_TILE(mockServers[0].hostname),
    );

    fireEvent.click(serverTile);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockServers[0].id);
  });
});
