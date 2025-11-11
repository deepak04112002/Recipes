package com.recipes.recipes_backend.controller;

import com.recipes.recipes_backend.dto.request.RecipeSearchRequest;
import com.recipes.recipes_backend.dto.response.CustomResponse;
import com.recipes.recipes_backend.entity.Recipe;
import com.recipes.recipes_backend.service.RecipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@Tag(name = "Recipe Management", description = "APIs for managing and searching recipes")
@CrossOrigin(origins = "*")
@Validated
@Slf4j
public class RecipeController {

    private final RecipeService recipeService;

    /**
     * Load recipes from external API
     *
     * @return ResponseEntity<CustomResponse<String>>
     */
    @PostMapping("/load")
    @Operation(summary = "Load recipes from external API", description = "Loads all recipes from the external DummyJSON API into the local H2 database and indexes them for search")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recipe loading initiated successfully", content = @Content(schema = @Schema(implementation = CustomResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error - failed to connect to external API", content = @Content(schema = @Schema(implementation = CustomResponse.class)))
    })
    public ResponseEntity<CustomResponse<String>> loadRecipes() {
        log.info("Entered loadRecipes controller");
        return ResponseEntity.ok(recipeService.loadRecipesFromExternalApi());
    }

    /**
     * Search recipes by name or cuisine
     *
     * @param request RecipeSearchRequest
     * @return ResponseEntity<CustomResponse<List<Recipe>>>
     */
    @PostMapping("/search")
    @Operation(summary = "Search recipes", description = "Search recipes by name or cuisine using free text search with minimum 3 characters")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search completed successfully", content = @Content(schema = @Schema(implementation = CustomResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad request - invalid search parameters or query too short", content = @Content(schema = @Schema(implementation = CustomResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(schema = @Schema(implementation = CustomResponse.class)))
    })
    public ResponseEntity<CustomResponse<List<Recipe>>> searchRecipes(
            @Parameter(description = "Search request containing query string (minimum 3 characters)", required = true)
            @Valid @RequestBody RecipeSearchRequest request) {
        log.info("Entered searchRecipes controller with query: {}", request.getQuery());
        return ResponseEntity.ok(recipeService.searchRecipes(request));
    }

    /**
     * Get recipe by ID
     *
     * @param id Recipe ID
     * @return ResponseEntity<CustomResponse<Recipe>>
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get recipe by ID", description = "Retrieve a specific recipe by its unique identifier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Recipe found and retrieved successfully", content = @Content(schema = @Schema(implementation = CustomResponse.class))),
            @ApiResponse(responseCode = "400", description = "Bad request - invalid recipe ID format", content = @Content(schema = @Schema(implementation = CustomResponse.class))),
            @ApiResponse(responseCode = "404", description = "Not found - recipe with specified ID does not exist", content = @Content(schema = @Schema(implementation = CustomResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(schema = @Schema(implementation = CustomResponse.class)))
    })
    public ResponseEntity<CustomResponse<Recipe>> getRecipeById(
            @Parameter(description = "Recipe ID (must be a positive integer)", required = true, example = "1")
            @PathVariable @NotNull @Min(value = 1, message = "Recipe ID must be positive") Long id) {
        log.info("Entered getRecipeById controller with id: {}", id);
        return ResponseEntity.ok(recipeService.findById(id));
    }

    /**
     * Get all recipes
     *
     * @return ResponseEntity<CustomResponse<List<Recipe>>>
     */
    @GetMapping
    @Operation(summary = "Get all recipes", description = "Retrieve all recipes from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All recipes retrieved successfully", content = @Content(schema = @Schema(implementation = CustomResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content(schema = @Schema(implementation = CustomResponse.class)))
    })
    public ResponseEntity<CustomResponse<List<Recipe>>> getAllRecipes() {
        log.info("Entered getAllRecipes controller");
        return ResponseEntity.ok(recipeService.findAll());
    }
}
