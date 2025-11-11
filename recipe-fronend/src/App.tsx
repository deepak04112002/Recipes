import React, { useState, useMemo } from "react";
import { SearchInput } from "./components/SearchInput";
import { FilterControls } from "./components/FilterControls";
import { RecipeGrid } from "./components/RecipeGrid";
import { RecipeModal } from "./components/RecipeModal";
import { Recipe, SearchFilters } from "./types/Recipe";
import { recipeService } from "./services/recipeService";

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "cookTimeMinutes",
    sortOrder: "asc",
    selectedTags: [],
  });

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [recipes]);

  const handleTitleClick = () => {
    window.location.reload();
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await recipeService.loadRecipes();
      const allRecipesData = await recipeService.getAllRecipes();
      setAllRecipes(allRecipesData);
      setRecipes(allRecipesData);
      setDataLoaded(true);
    } catch (err) {
      setError("Failed to load recipe data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length < 3) return;

    setLoading(true);
    setError(null);

    try {
      const results = await recipeService.searchRecipes(searchQuery);
      setRecipes(results);
    } catch (err: any) {
      setError(err.message || "Failed to search recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    if (value === "" && allRecipes.length > 0) {
      setRecipes(allRecipes);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Compact Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-4 cursor-pointer hover:from-orange-700 hover:to-orange-900 transition-all duration-300"
            onClick={handleTitleClick}
          >
            🍳 Recipe Finder
          </h1>

          {!dataLoaded && (
            <div className="text-center">
              <button
                onClick={loadInitialData}
                disabled={loading}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-md"
              >
                {loading ? "Loading..." : "🚀 Load Recipe Data"}
              </button>
            </div>
          )}

          {dataLoaded && (
            <SearchInput
              value={searchQuery}
              onChange={handleSearchQueryChange}
              onSearch={handleSearch}
              loading={loading}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-xl mb-8 shadow-lg">
            <div className="flex items-center">
              <div className="text-2xl mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold">Something went wrong</h3>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome State */}
        {!loading && !error && !dataLoaded && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto border border-orange-100">
              <div className="text-8xl mb-6">🍽️</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Cook Something Amazing?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Get started by loading our recipe database filled with delicious
                recipes from around the world. From quick weeknight dinners to
                elaborate weekend feasts, we've got you covered!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="text-3xl mb-2">🔍</div>
                  <h3 className="font-semibold text-gray-800">Smart Search</h3>
                  <p className="text-sm text-gray-600">
                    Find recipes by name or cuisine
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl mb-2">🏷️</div>
                  <h3 className="font-semibold text-gray-800">Filter & Sort</h3>
                  <p className="text-sm text-gray-600">
                    Organize by tags and cook time
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-3xl mb-2">📱</div>
                  <h3 className="font-semibold text-gray-800">Mobile Ready</h3>
                  <p className="text-sm text-gray-600">
                    Cook anywhere, anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {dataLoaded && recipes.length > 0 && (
          <>
            <FilterControls
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={availableTags}
            />

            <div className="mb-6">
              <div className="bg-white rounded-xl shadow-md p-4 border border-orange-100">
                <p className="text-gray-700 font-medium flex items-center">
                  <span className="text-2xl mr-2">🎯</span>
                  Found{" "}
                  <span className="text-orange-600 font-bold mx-1">
                    {recipes.length}
                  </span>
                  recipe{recipes.length !== 1 ? "s" : ""}
                  {searchQuery && (
                    <span className="ml-1">
                      for "
                      <span className="text-orange-600 font-semibold">
                        {searchQuery}
                      </span>
                      "
                    </span>
                  )}
                </p>
              </div>
            </div>

            <RecipeGrid
              recipes={recipes}
              filters={filters}
              onRecipeClick={handleRecipeClick}
              loading={loading}
            />
          </>
        )}

        {/* No Results State */}
        {dataLoaded && recipes.length === 0 && !loading && !error && (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg mx-auto border border-orange-100">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                No Recipes Found
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't find any recipes matching your search. Try adjusting
                your search terms or filters.
              </p>
              <div className="space-y-3 text-sm text-gray-500">
                <p>
                  💡 <strong>Tips:</strong>
                </p>
                <p>• Try broader search terms</p>
                <p>• Check your spelling</p>
                <p>• Remove some filters</p>
                <p>• Search by cuisine type</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default App;
