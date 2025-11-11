import { render, screen, fireEvent } from "@testing-library/react";
import { RecipeCard } from "../RecipeCard";
import { Recipe } from "../../types/Recipe";

const mockRecipe: Recipe = {
  id: 1,
  name: "Test Recipe",
  cuisine: "Italian",
  ingredients: ["ingredient1", "ingredient2"],
  instructions: ["step1", "step2"],
  tags: ["tag1", "tag2", "tag3"],
  cookTimeMinutes: 30,
  image: "test-image.jpg",
};

describe("RecipeCard", () => {
  test("renders recipe information", () => {
    render(<RecipeCard recipe={mockRecipe} />);

    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByText("🍽️ Italian")).toBeInTheDocument();
    expect(screen.getByText("⏱️ 30m")).toBeInTheDocument();
    expect(screen.getByText("📝 2 steps")).toBeInTheDocument();
    expect(screen.getByText("🏷️ 3 tags")).toBeInTheDocument();
  });

  test("calls onClick when clicked", () => {
    const mockOnClick = jest.fn();
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText("Test Recipe"));
    expect(mockOnClick).toHaveBeenCalledWith(mockRecipe);
  });

  test("displays limited tags with overflow indicator", () => {
    render(<RecipeCard recipe={mockRecipe} />);

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });
});
