package com.recipes.recipes_backend.service;

import com.recipes.recipes_backend.dto.request.RecipeSearchRequest;
import com.recipes.recipes_backend.dto.response.CustomResponse;
import com.recipes.recipes_backend.dto.response.ExternalRecipeResponse;
import com.recipes.recipes_backend.entity.Recipe;
import com.recipes.recipes_backend.exception.RecipeNotFoundException;
import com.recipes.recipes_backend.repository.RecipeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RecipeServiceTest {

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private ExternalRecipeClient externalRecipeClient;

    @Mock
    private SearchService searchService;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private RecipeService recipeService;

    private Recipe testRecipe;
    private RecipeSearchRequest searchRequest;

    @BeforeEach
    void setUp() {
        testRecipe = Recipe.builder()
                .id(1L)
                .name("Test Recipe")
                .cuisine("Italian")
                .cookTimeMinutes(30)
                .build();

        searchRequest = new RecipeSearchRequest();
        searchRequest.setQuery("pasta");
    }

    @Test
    void findById_ExistingId_ReturnsCustomResponse() {
        when(recipeRepository.findById(1L)).thenReturn(Optional.of(testRecipe));

        CustomResponse<Recipe> result = recipeService.findById(1L);

        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals("Test Recipe", result.getData().getName());
        verify(recipeRepository).findById(1L);
    }

    @Test
    void findById_NonExistingId_ThrowsException() {
        when(recipeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RecipeNotFoundException.class, () -> recipeService.findById(999L));
    }

    @Test
    void searchRecipes_ValidQuery_ReturnsCustomResponse() {
        List<Recipe> expectedRecipes = Collections.singletonList(testRecipe);
        when(searchService.searchRecipes("pasta")).thenReturn(expectedRecipes);

        CustomResponse<List<Recipe>> result = recipeService.searchRecipes(searchRequest);

        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(1, result.getData().size());
        assertEquals("Test Recipe", result.getData().get(0).getName());
    }

    @Test
    void findAll_ReturnsAllRecipes() {
        List<Recipe> expectedRecipes = Collections.singletonList(testRecipe);
        when(searchService.getAllRecipesWithInitializedCollections()).thenReturn(expectedRecipes);

        CustomResponse<List<Recipe>> result = recipeService.findAll();

        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(1, result.getData().size());
        verify(searchService).getAllRecipesWithInitializedCollections();
    }

    @Test
    void loadRecipesFromExternalApi_ShouldReturnSuccessMessage() {
        ExternalRecipeResponse mockResponse = new ExternalRecipeResponse();
        mockResponse.setRecipes(Collections.emptyList());
        CompletableFuture<ExternalRecipeResponse> mockFuture = CompletableFuture.completedFuture(mockResponse);

        when(externalRecipeClient.fetchAllRecipes()).thenReturn(mockFuture);

        CustomResponse<String> result = recipeService.loadRecipesFromExternalApi();

        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals("Recipe loading initiated successfully", result.getData());
    }

    @Test
    void searchRecipes_EmptyQuery_ShouldReturnEmptyList() {
        RecipeSearchRequest request = new RecipeSearchRequest();
        request.setQuery("   ");

        CustomResponse<List<Recipe>> result = recipeService.searchRecipes(request);

        assertTrue(result.getData().isEmpty());
    }
}
