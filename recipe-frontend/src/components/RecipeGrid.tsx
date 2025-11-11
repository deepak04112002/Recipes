import React, { useMemo } from "react";
import { Recipe, SearchFilters } from "../types/Recipe";
import { RecipeCard } from "./RecipeCard";

interface RecipeGridProps {
  recipes: Recipe[];
  filters: SearchFilters;
  onRecipeClick?: (recipe: Recipe) => void;
  loading?: boolean;
}

export const RecipeGrid: React.FC<RecipeGridProps> = ({
  recipes,
  filters,
  onRecipeClick,
  loading = false,
}) => {
  const filteredAndSortedRecipes = useMemo(() => {
    let filtered = recipes;

    if (filters.selectedTags.length > 0) {
      filtered = filtered.filter((recipe) =>
        filters.selectedTags.some((tag) => recipe.tags.includes(tag))
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[filters.sortBy];
      const bValue = b[filters.sortBy];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return filters.sortOrder === "asc" ? comparison : -comparison;
      }

      // Handle numeric comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        const comparison = aValue - bValue;
        return filters.sortOrder === "asc" ? comparison : -comparison;
      }

      return 0;
    });

    return filtered;
  }, [recipes, filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredAndSortedRecipes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🍳</div>
        <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} onClick={onRecipeClick} />
      ))}
    </div>
  );
};
