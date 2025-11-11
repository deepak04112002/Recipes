import axios, { AxiosError } from "axios";
import { Recipe, CustomResponse } from "../types/Recipe";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
const REQUEST_TIMEOUT =
  parseInt(process.env.REACT_APP_REQUEST_TIMEOUT || "10000") || 10000;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiCall = async <T>(
  apiCall: () => Promise<{ data: CustomResponse<T> }>
): Promise<T> => {
  try {
    const response = await apiCall();
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Network error occurred"
      );
    }
    throw error;
  }
};

export const recipeService = {
  loadRecipes: async (): Promise<string> => {
    return handleApiCall(() =>
      api.post<CustomResponse<string>>("/recipes/load")
    );
  },

  searchRecipes: async (query: string): Promise<Recipe[]> => {
    return handleApiCall(() =>
      api.post<CustomResponse<Recipe[]>>("/recipes/search", { query })
    );
  },

  getRecipeById: async (id: number): Promise<Recipe> => {
    return handleApiCall(() =>
      api.get<CustomResponse<Recipe>>(`/recipes/${id}`)
    );
  },

  getAllRecipes: async (): Promise<Recipe[]> => {
    return handleApiCall(() => api.get<CustomResponse<Recipe[]>>("/recipes"));
  },
};
