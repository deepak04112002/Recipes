package com.recipes.recipes_backend.dto.response;

import com.recipes.recipes_backend.dto.ExternalRecipeDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExternalRecipeResponse {
    private List<ExternalRecipeDto> recipes;
    private int total;
    private int skip;
    private int limit;
}
