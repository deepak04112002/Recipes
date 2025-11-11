import { render, screen, fireEvent } from "@testing-library/react";
import { RecipeModal } from "../RecipeModal";
import { Recipe } from "../../types/Recipe";

const mockRecipe: Recipe = {
  id: 1,
  name: "Test Recipe",
  cuisine: "Italian",
  ingredients: ["ingredient1", "ingredient2"],
  instructions: ["step1", "step2"],
  tags: ["tag1", "tag2"],
  cookTimeMinutes: 30,
  image: "test-image.jpg"
};

describe("RecipeModal", () => {
  test("renders when open", () => {
    render(
      <RecipeModal
        recipe={mockRecipe}
        isOpen={true}
        onClose={jest.fn()}
      />
    );
    
    expect(screen.getByText("Test Recipe")).toBeInTheDocument();
    expect(screen.getByText("🍽️ Italian")).toBeInTheDocument();
    expect(screen.getByText("ingredient1")).toBeInTheDocument();
    expect(screen.getByText("step1")).toBeInTheDocument();
  });

  test("does not render when closed", () => {
    render(
      <RecipeModal
        recipe={mockRecipe}
        isOpen={false}
        onClose={jest.fn()}
      />
    );
    
    expect(screen.queryByText("Test Recipe")).not.toBeInTheDocument();
  });

  test("calls onClose when close button clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <RecipeModal
        recipe={mockRecipe}
        isOpen={true}
        onClose={mockOnClose}
      />
    );
    
    fireEvent.click(screen.getByText("×"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
