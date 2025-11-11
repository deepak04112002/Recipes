import { render, screen } from "@testing-library/react";
import { RecipeGrid } from "../RecipeGrid";
import { Recipe, SearchFilters } from "../../types/Recipe";

const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: "Recipe A",
    cuisine: "Italian",
    ingredients: ["ing1"],
    instructions: ["step1"],
    tags: ["tag1"],
    cookTimeMinutes: 20,
    image: "image1.jpg",
  },
  {
    id: 2,
    name: "Recipe B",
    cuisine: "Asian",
    ingredients: ["ing2"],
    instructions: ["step2"],
    tags: ["tag2"],
    cookTimeMinutes: 30,
    image: "image2.jpg",
  },
];

const mockFilters: SearchFilters = {
  sortBy: "cookTimeMinutes",
  sortOrder: "asc",
  selectedTags: [],
};

describe("RecipeGrid", () => {
  test("renders recipes", () => {
    render(<RecipeGrid recipes={mockRecipes} filters={mockFilters} />);

    expect(screen.getByText("Recipe A")).toBeInTheDocument();
    expect(screen.getByText("Recipe B")).toBeInTheDocument();
  });

  test("sorts recipes by cook time ascending", () => {
    render(<RecipeGrid recipes={mockRecipes} filters={mockFilters} />);

    const recipeElements = screen.getAllByText(/Recipe [AB]/);
    expect(recipeElements[0]).toHaveTextContent("Recipe A");
    expect(recipeElements[1]).toHaveTextContent("Recipe B");
  });

  test("filters recipes by tags", () => {
    const filtersWithTag: SearchFilters = {
      ...mockFilters,
      selectedTags: ["tag1"],
    };

    render(<RecipeGrid recipes={mockRecipes} filters={filtersWithTag} />);

    expect(screen.getByText("Recipe A")).toBeInTheDocument();
    expect(screen.queryByText("Recipe B")).not.toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(<RecipeGrid recipes={[]} filters={mockFilters} loading={true} />);

    const loadingCards = screen.getAllByTestId("loading-card");
    expect(loadingCards).toHaveLength(8);
  });

  test("shows no results message", () => {
    render(<RecipeGrid recipes={[]} filters={mockFilters} loading={false} />);

    expect(screen.getByText("No recipes found")).toBeInTheDocument();
  });
});
