package com.recipes.recipes_backend.service;

import com.recipes.recipes_backend.dto.request.RecipeSearchRequest;
import com.recipes.recipes_backend.dto.response.CustomResponse;
import com.recipes.recipes_backend.entity.Recipe;
import com.recipes.recipes_backend.exception.RecipeNotFoundException;
import com.recipes.recipes_backend.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final ExternalRecipeClient externalRecipeClient;
    private final SearchService searchService;
    private final ModelMapper modelMapper;

    @Transactional
    public CustomResponse<String> loadRecipesFromExternalApi() {
        log.info("Starting to load recipes from external API");

        if (recipeRepository.count() > 0) {
            log.info("Recipes already loaded, skipping");
            return CustomResponse.success("Recipes already loaded", "Success");
        }

        externalRecipeClient.fetchAllRecipes()
                .thenAccept(response -> {
                    List<Recipe> recipes = response.getRecipes().stream()
                            .map(dto -> {
                                Recipe recipe = modelMapper.map(dto, Recipe.class);
                                recipe.setId(null); // Clear ID to let database generate new ones
                                return recipe;
                            })
                            .toList();

                    recipeRepository.saveAll(recipes);
                    searchService.indexAllRecipes();

                    log.info("Successfully loaded {} recipes", recipes.size());
                })
                .exceptionally(error -> {
                    log.error("Failed to load recipes: {}", error.getMessage());
                    return null;
                });

        return CustomResponse.success("Recipe loading initiated successfully", "Success");
    }

    @Transactional(readOnly = true)
    public CustomResponse<List<Recipe>> searchRecipes(RecipeSearchRequest request) {
        log.info("Searching recipes with query: {}", request.getQuery());

        String query = request.getQuery().trim();
        if (query.length() < 3) {
            return CustomResponse.success(List.of(), "Query too short - minimum 3 characters required");
        }

        List<Recipe> recipes = searchService.searchRecipes(query);
        return CustomResponse.success(recipes, "Search completed successfully");
    }

    @Cacheable("recipes")
    @Transactional(readOnly = true)
    public CustomResponse<Recipe> findById(Long id) {
        log.info("Finding recipe by id: {}", id);
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe not found with id: " + id));
        return CustomResponse.success(recipe, "Recipe retrieved successfully");
    }

    @Transactional(readOnly = true)
    public CustomResponse<List<Recipe>> findAll() {
        log.info("Finding all recipes");

        // Use search service which handles lazy loading
        List<Recipe> recipes = searchService.getAllRecipesWithInitializedCollections();

        return CustomResponse.success(recipes, "All recipes retrieved successfully");
    }


}
