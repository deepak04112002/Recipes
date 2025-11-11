package com.recipes.recipes_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExternalRecipeDto {
    private Long id;
    private String name;
    private String cuisine;
    private List<String> ingredients;
    private List<String> instructions;
    private List<String> tags;
    private Integer cookTimeMinutes;
    private String image;
}
