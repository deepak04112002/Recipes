export interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  cookTimeMinutes: number;
  image: string;
}

export interface CustomResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
  success: boolean;
}

export interface SearchFilters {
  sortBy: "cookTimeMinutes" | "name";
  sortOrder: "asc" | "desc";
  selectedTags: string[];
}
