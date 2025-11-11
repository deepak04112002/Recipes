package com.recipes.recipes_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecipeSearchRequest {
    @NotBlank(message = "Search query cannot be empty")
    @Size(min = 3, max = 100, message = "Search query must be between 3 and 100 characters")
    private String query;
}
