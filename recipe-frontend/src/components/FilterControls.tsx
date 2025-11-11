import React from "react";
import { SearchFilters } from "../types/Recipe";

interface FilterControlsProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableTags: string[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  availableTags,
}) => {
  const handleSortChange = (field: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      ...filters,
      selectedTags: [],
      sortBy: "cookTimeMinutes",
      sortOrder: "asc",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      {/* Sort Controls */}
      <div className="flex flex-wrap items-center gap-6 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700 flex items-center">
            📊 Sort by:
          </span>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange("sortBy", e.target.value)}
            className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          >
            <option value="cookTimeMinutes">Cook Time</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Order:</span>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleSortChange("sortOrder", e.target.value)}
            className="border-2 border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        {filters.selectedTags.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-all"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700 flex items-center">
              🏷️ Filter by tags:
            </span>
            <span className="text-xs text-gray-500">
              {filters.selectedTags.length} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-4 py-2 text-sm rounded-full font-medium transition-all duration-200 ${
                  filters.selectedTags.includes(tag)
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
              >
                {tag}
                {filters.selectedTags.includes(tag) && (
                  <span className="ml-2">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
