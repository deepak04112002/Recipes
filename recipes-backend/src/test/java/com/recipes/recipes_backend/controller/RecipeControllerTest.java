package com.recipes.recipes_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipes.recipes_backend.dto.request.RecipeSearchRequest;
import com.recipes.recipes_backend.dto.response.CustomResponse;
import com.recipes.recipes_backend.entity.Recipe;
import com.recipes.recipes_backend.service.RecipeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RecipeController.class)
class RecipeControllerTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        public RecipeService recipeService() {
            return mock(RecipeService.class);
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RecipeService recipeService;

    @Autowired
    private ObjectMapper objectMapper;

    private Recipe testRecipe;

    @BeforeEach
    void setUp() {
        testRecipe = Recipe.builder()
                .id(1L)
                .name("Test Recipe")
                .cuisine("Italian")
                .cookTimeMinutes(30)
                .build();
    }

    @Test
    void loadRecipes_ShouldReturnSuccess() throws Exception {
        CustomResponse<String> response = CustomResponse.success("Recipe loading initiated successfully", "Success");
        when(recipeService.loadRecipesFromExternalApi()).thenReturn(response);

        mockMvc.perform(post("/api/recipes/load"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void searchRecipes_ValidRequest_ShouldReturnRecipes() throws Exception {
        RecipeSearchRequest request = new RecipeSearchRequest();
        request.setQuery("pasta");

        CustomResponse<List<Recipe>> response = CustomResponse.success(Collections.singletonList(testRecipe), "Search completed successfully");
        when(recipeService.searchRecipes(any(RecipeSearchRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/recipes/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void getAllRecipes_ShouldReturnAllRecipes() throws Exception {
        CustomResponse<List<Recipe>> response = CustomResponse.success(List.of(testRecipe), "All recipes retrieved");
        when(recipeService.findAll()).thenReturn(response);

        mockMvc.perform(get("/api/recipes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
