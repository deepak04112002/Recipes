import React from "react";
import { Recipe } from "../types/Recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transform hover:scale-105 transition-all duration-300 overflow-hidden group"
      onClick={() => onClick?.(recipe)}
    >
      <div className="relative overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjxmb250LXNpemU9IjMwIj7wn42zPC9mb250LXNpemU+PGJyLz5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=";
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          ⏱️ {recipe.cookTimeMinutes}m
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {recipe.name}
        </h3>
        
        <div className="flex items-center mb-3">
          <span className="text-sm text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full">
            🍽️ {recipe.cuisine}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            📝 {recipe.instructions.length} steps
          </span>
          <span className="flex items-center">
            🏷️ {recipe.tags.length} tags
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 2 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">
              +{recipe.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
