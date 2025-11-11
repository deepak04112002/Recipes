import { render, screen, fireEvent } from "@testing-library/react";
import { FilterControls } from "../FilterControls";
import { SearchFilters } from "../../types/Recipe";

const mockFilters: SearchFilters = {
  sortBy: "cookTimeMinutes",
  sortOrder: "asc",
  selectedTags: []
};

describe("FilterControls", () => {
  test("renders sort controls", () => {
    render(
      <FilterControls
        filters={mockFilters}
        onFiltersChange={jest.fn()}
        availableTags={[]}
      />
    );
    
    expect(screen.getByText("📊 Sort by:")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Cook Time")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ascending")).toBeInTheDocument();
  });

  test("calls onFiltersChange when sort changes", () => {
    const mockOnFiltersChange = jest.fn();
    render(
      <FilterControls
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        availableTags={[]}
      />
    );
    
    fireEvent.change(screen.getByDisplayValue("Cook Time"), {
      target: { value: "name" }
    });
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      sortBy: "name"
    });
  });

  test("renders and toggles tags", () => {
    const mockOnFiltersChange = jest.fn();
    render(
      <FilterControls
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
        availableTags={["Italian", "Quick"]}
      />
    );
    
    expect(screen.getByText("Italian")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Italian"));
    
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      ...mockFilters,
      selectedTags: ["Italian"]
    });
  });
});
